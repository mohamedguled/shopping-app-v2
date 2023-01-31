import { openDB, DBSchema, StoreNames } from 'idb';
import { find, map } from 'lodash';
import { z } from 'zod';
import { produce } from 'immer';

const categoryKeys = z.enum([
  'Mejeri & Ost',
  'Bröd & Kakor',
  'Kött, Fågel & Fisk',
  'Skafferi',
  'Sill, kaviar & rom',
]);
export type CategoryName = z.infer<typeof categoryKeys>;

const product = z.object({
  name: z.string(),
  categoryKey: categoryKeys,
  id: z.number().optional(),
  isCompleted: z.boolean(),
  amount: z.number(),
  details: z.string().optional(),
  category: z
    .object({
      name: categoryKeys,
      id: z.number(),
    })
    .optional(),
});

export type ProductType = z.infer<typeof product>;
export type CategoryType = {
  name: CategoryName;
  id: number;
};

interface MyDB extends DBSchema {
  categories: {
    value: CategoryType;
    key: string;
  };
  items: {
    key: string;
    value: ProductType;
  };
}

export async function db() {
  const idb = await openDB<MyDB>('my-db', 1, {
    upgrade(db) {
      db.createObjectStore('categories');
      db.createObjectStore('items');
    },
  });
  return idb;
}

const Categories: CategoryType[] = [
  {
    id: 1,
    name: 'Mejeri & Ost',
  },
  {
    id: 2,
    name: 'Bröd & Kakor',
  },
  {
    id: 3,
    name: 'Kött, Fågel & Fisk',
  },
  {
    id: 4,
    name: 'Skafferi',
  },
  {
    id: 5,
    name: 'Sill, kaviar & rom',
  },
];

const Products: ProductType[] = [
  {
    name: 'Laktosfri Mjölk',
    categoryKey: 'Mejeri & Ost',
    amount: 1,
    isCompleted: false,
    details: 'Arla, 1.5 liter',
  },
  {
    name: 'Ost',
    categoryKey: 'Mejeri & Ost',
    amount: 1,
    isCompleted: false,
    details: 'Port salut 750g - färdigskivad',
  },
  {
    name: 'Bröd',
    categoryKey: 'Bröd & Kakor',
    amount: 1,
    isCompleted: false,
  },
  {
    name: 'Pålägg',
    categoryKey: 'Kött, Fågel & Fisk',
    amount: 1,
    isCompleted: false,
  },
  {
    name: 'Smör',
    categoryKey: 'Mejeri & Ost',
    amount: 1,
    isCompleted: false,
    details: 'Bregott, 600g - normalsaltat',
  },
  {
    name: 'Knäckebröd',
    categoryKey: 'Bröd & Kakor',
    amount: 1,
    isCompleted: false,
    details: 'Leksands, havre spröd gräddat',
  },
  {
    name: 'Te',
    categoryKey: 'Skafferi',
    amount: 1,
    isCompleted: false,
    details: 'Lipton, Earl Gray Classic - 100pack',
  },
  {
    name: 'Kaffe',
    categoryKey: 'Skafferi',
    amount: 1,
    isCompleted: false,
    details: 'Néscafe lyx, mellanrost',
  },
  {
    name: 'Apelsinmarmelad',
    categoryKey: 'Skafferi',
    amount: 1,
    isCompleted: false,
    details: 'BOB, Flaska',
  },
  {
    name: 'Citronsyra',
    categoryKey: 'Skafferi',
    amount: 1,
    isCompleted: false,
    details: 'Santa Maria',
  },
  {
    name: 'Honung',
    categoryKey: 'Skafferi',
    amount: 1,
    isCompleted: false,
    details: 'ICA-basic, 650g',
  },
  {
    name: 'Kaviar',
    categoryKey: 'Sill, kaviar & rom',
    amount: 1,
    isCompleted: false,
    details: 'Kalles kaviar - Original',
  },
  {
    name: 'Laktosfritt smör',
    categoryKey: 'Mejeri & Ost',
    amount: 1,
    isCompleted: false,
    details: 'Normalsaltat, 300g',
  },
  {
    name: 'Mjukost',
    categoryKey: 'Mejeri & Ost',
    amount: 1,
    isCompleted: false,
    details: 'Kalvi, räkost och skinkost - 275g',
  },
];

export async function GetAll<Type>(storeName: StoreNames<MyDB>) {
  const store = (await db())
    .transaction(storeName)
    .objectStore(storeName);

  const items = store.getAll();
  if ((await items).length <= 0) return null;

  return items as Promise<Type[]>;
}
export async function Get<Type>(
  storeName: StoreNames<MyDB>,
  name: string
) {
  const item = await (await db()).get(storeName, name);

  return item as Type;
}

export async function Update(
  storeName: StoreNames<MyDB>,
  data: any,
  key: string
) {
  return await (await db()).put(storeName, data, key);
}

export async function UpdateAmount(name: string, newAmount: number) {
  try {
    const item = await Get<ProductType>('items', name);

    if (item) {
      const newItem = produce(item, (draft) => {
        draft.amount = newAmount;
      });

      await Update('items', newItem, item.name);
    }
  } catch (e) {
    throw new Error('Failed to update amount');
  }
}

export async function DeleteAll(storeName: StoreNames<MyDB>) {
  try {
    await (await db()).clear(storeName);
  } catch (e) {
    throw new Error('Failed to delete');
  }
}

export async function Delete(
  storeName: StoreNames<MyDB>,
  key: string
) {
  try {
    await (await db()).delete(storeName, key);
  } catch (e) {
    throw new Error('Failed to delete');
  }
}

export async function UpdateCategories(categories: CategoryType[]) {
  map(categories, async (category) => {
    await (await db()).put('categories', category, category.name);
  });
  map(Products, async (product, i) => {
    const newState = produce(product, (draft) => {
      draft.id = i + 1;
      draft.isCompleted = false;
      draft.category = find(
        categories,
        (o) => o.name === draft.categoryKey
      );
    });
    await (await db()).put('items', newState, newState.name);
  });
}
export async function Init() {
  map(Categories, async (category) => {
    await Update('categories', category, category.name);
  });
  map(Products, async (product, i) => {
    const newState = produce(product, (draft) => {
      draft.id = i + 1;
      draft.isCompleted = false;
      draft.category = find(
        Categories,
        (o) => o.name === draft.categoryKey
      );
    });
    await Update('items', newState, newState.name);
  });
}

export async function ToggleComplete(
  name: string,
  newBoolean: boolean
) {
  try {
    const item = await Get<ProductType>('items', name);
    if (item) {
      const newItem = produce(item, (draft) => {
        draft.isCompleted = !newBoolean;
      });

      await (await db()).put('items', newItem, newItem.name);
    }
  } catch (e) {
    throw new Error('Failed to toggle');
  }
}
