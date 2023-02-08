import { openDB, DBSchema, StoreNames } from 'idb';
import { filter, find, map } from 'lodash';
import { z } from 'zod';
import { produce } from 'immer';

const product = z.object({
  name: z.string(),
  id: z.number().optional(),
  isCompleted: z.boolean(),
  amount: z.number(),
  details: z.string().optional(),
  hasImg: z.boolean().optional(),
  uploadedImg: z.string().optional(),
});

const preset = z.object({
  name: z.string(),
  data: product.array(),
});

export type ProductType = z.infer<typeof product>;
export type PresetType = z.infer<typeof preset>;
interface MyDB extends DBSchema {
  items: {
    key: string;
    value: ProductType;
  };
  presets: {
    key: string;
    value: PresetType;
  };
}
export async function db() {
  const idb = await openDB<MyDB>('my-db', 1, {
    upgrade(db) {
      db.createObjectStore('items');
      db.createObjectStore('presets');
    },
  });
  return idb;
}

const Products: ProductType[] = [
  {
    name: 'Laktosfri Mjölk',
    amount: 1,
    isCompleted: false,
    details: 'Arla, 1.5 liter',
  },
  {
    name: 'Ost',
    amount: 1,
    isCompleted: false,
    details: 'Port salut 750g - färdigskivad',
  },
  {
    name: 'Bröd',
    amount: 1,
    isCompleted: false,
  },
  {
    name: 'Pålägg',
    amount: 1,
    isCompleted: false,
  },
  {
    name: 'Smör',
    amount: 1,
    isCompleted: false,
    details: 'Bregott, 600g - normalsaltat',
  },
  {
    name: 'Knäckebröd',
    amount: 1,
    isCompleted: false,
    details: 'Leksands, havre spröd gräddat',
  },
  {
    name: 'Te',
    amount: 1,
    isCompleted: false,
    details: 'Lipton, Earl Gray Classic - 100pack',
  },
  {
    name: 'Kaffe',
    amount: 1,
    isCompleted: false,
    details: 'Néscafe lyx, mellanrost',
  },
  {
    name: 'Apelsinmarmelad',
    amount: 1,
    isCompleted: false,
    details: 'BOB, Flaska',
  },
  {
    name: 'Citronsyra',
    amount: 1,
    isCompleted: false,
    details: 'Santa Maria',
  },
  {
    name: 'Honung',
    amount: 1,
    isCompleted: false,
    details: 'ICA-basic, 650g',
  },
  {
    name: 'Kaviar',
    amount: 1,
    isCompleted: false,
    details: 'Kalles kaviar - Original',
  },
  {
    name: 'Laktosfritt smör',
    amount: 1,
    isCompleted: false,
    details: 'Normalsaltat, 300g',
  },
  {
    name: 'Mjukost',
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

export async function updateProductImage(
  name: string,
  imgUrl: string
) {
  try {
    const item = await Get<ProductType>('items', name);
    if (item) {
      const newItem = produce(item, (draft) => {
        draft.hasImg = true;
        draft.uploadedImg = imgUrl;
      });

      await Update('items', newItem, item.name);
    }
  } catch (e) {
    throw new Error('Failed to update image');
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

export async function updateProducts(items: ProductType[]) {
  map(items, async (item) => {
    await (await db()).put('items', item, item.name);
  });
}

export async function Init() {
  map(Products, async (product, i) => {
    const newState = produce(product, (draft) => {
      draft.id = i + 1;
      draft.isCompleted = false;
      draft.hasImg = true;
    });
    await Update('items', newState, newState.name);
  });
}
const schema = z.object({
  name: z.string(),
});
export type AddFormSchema = z.infer<typeof schema>;
export async function addProduct(data: AddFormSchema) {
  try {
    const currentAmount = await GetAll<ProductType[] | null>('items');
    if (currentAmount) {
      const length = currentAmount.length;

      const newData: ProductType = {
        name: data.name,
        id: length + 1,
        isCompleted: false,
        amount: 0,
        hasImg: false,
      };

      await Update('items', newData, data.name);
    }
  } catch (e) {
    throw new Error('Failed to add new product');
  }
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
