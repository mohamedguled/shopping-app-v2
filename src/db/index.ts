import { openDB, DBSchema } from 'idb';
import { filter, find, map } from 'lodash';
import { z } from 'zod';
import { produce } from 'immer';

const categoryKeys = z.enum([
  'Frukt & Grönsaker',
  'Mejeri & Ägg',
  'Drycker',
  'Fryst',
  'Fisk',
  'Bröd & Kakor',
  'Kött, Fågel & Fisk',
]);
export type CategoryName = z.infer<typeof categoryKeys>;
const notEmpty = z.any().array().nonempty();

const product = z.object({
  name: z.string(),
  categoryKey: categoryKeys,
  id: z.number().optional(),
  isCompleted: z.boolean(),
  amount: z.number(),
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
    name: 'Mejeri & Ägg',
  },
  {
    id: 2,
    name: 'Bröd & Kakor',
  },
  {
    id: 3,
    name: 'Kött, Fågel & Fisk',
  },
];

const Products: ProductType[] = [
  {
    name: 'Mjölk',
    categoryKey: 'Mejeri & Ägg',
    amount: 1,
    isCompleted: false,
  },
  {
    name: 'Ost',
    categoryKey: 'Mejeri & Ägg',
    amount: 1,
    isCompleted: false,
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
];

export async function generate() {
  map(Categories, async (category) => {
    await (await db()).put('categories', category, category.name);
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
    await (await db()).put('items', newState, newState.name);
  });
}

export async function updateCategories(categories: CategoryType[]) {
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

export async function getProducts() {
  const store = (await db())
    .transaction('items')
    .objectStore('items');

  const items = store.getAll();

  // items.then((data) => console.log(data));
  if ((await items).length <= 0) return null;

  return items;
}
export async function getCategories() {
  const store = (await db())
    .transaction('categories')
    .objectStore('categories');

  const items = store.getAll();

  // items.then((data) => console.log(data));
  if ((await items).length <= 0) return null;

  return items;
}

export async function deleteProducts() {
  try {
    await (await db()).clear('items');
    return 'Deleted';
  } catch (err) {
    throw new Error('Failed to delete products');
  }
}

export async function changeAmount(name: string, newAmount: number) {
  // console.log(name);
  const item = (await (
    await db()
  ).get('items', `${name}`)) as ProductType;

  if (item) {
    const newItem = produce(item, (draft) => {
      draft.amount = newAmount;
    });
    // console.log(newItem);
    await (await db()).put('items', newItem, newItem.name);
  }
}

export async function toggleComplete(
  name: string,
  newBoolean: boolean
) {
  const item = (await (
    await db()
  ).get('items', `${name}`)) as ProductType;
  if (item) {
    const newItem = produce(item, (draft) => {
      draft.isCompleted = !newBoolean;
    });
    // console.log(newItem);
    await (await db()).put('items', newItem, newItem.name);
  }
}

export async function deleteProduct(name: string) {
  await (await db()).delete('items', name);
}

export async function getCompleted() {
  const items = getProducts();

  const c = filter(await items, { isCompleted: true });
  // console.log(c.length);

  if (c.length <= 0) return null;
  return c;
}
