import { useEffectOnce } from 'usehooks-ts';
import { useQuery, useMutation } from '@tanstack/react-query';
import Button from './components/core/Button';
import Card from './components/core/Card';
import { sortBy } from 'lodash';
import { useMemo } from 'react';
import Categories from './components/views/Categories';
import { shallow } from 'zustand/shallow';
import { useStore } from './store/store';
import {
  CategoryType,
  db,
  DeleteAll,
  GetAll,
  Init,
  ProductType,
} from './db/experiment';
import { Toaster } from 'react-hot-toast';
export default function App() {
  useEffectOnce(() => {
    db();
  });

  const { data, isLoading, refetch } = useQuery(['products'], () =>
    GetAll<ProductType>('items')
  );
  const {
    data: categories,
    // isLoading: categoriesLoading,
    refetch: categoriesRefetch,
  } = useQuery(['categories'], () =>
    GetAll<CategoryType>('categories')
  );

  const sortedData = useMemo(() => {
    const sortedArr = sortBy(data, (o) => o.category?.id);
    return sortedArr;
  }, [data]);
  const sortedCategoryData = useMemo(() => {
    const sortedArr = sortBy(categories, (o) => o.id);
    return sortedArr;
  }, [categories]);

  function handleGenerate() {
    return Init();
  }
  const generateMutation = useMutation(handleGenerate, {
    onSuccess() {
      refetch();
      categoriesRefetch();
    },
  });

  function handleDelete() {
    DeleteAll('items');
    return DeleteAll('categories');
  }
  const deleteMutation = useMutation(handleDelete, {
    onSuccess() {
      refetch();
      categoriesRefetch();
      // refetchCompleted();
    },
  });

  const { currentTab } = useStore(
    (state) => ({ currentTab: state.currentTab }),
    shallow
  );
  const { newTab } = useStore();

  return (
    <>
      <Toaster position='top-right' />
      <div className='p-8'>
        <div className='font-bold'>
          {!data && !isLoading ? (
            <h3 className='text-4xl mb-4'>Handlingslistan är tom</h3>
          ) : (
            <h3 className='text-4xl mb-4'>Handlingslista</h3>
          )}
        </div>
        <div className='mb-2'>
          {data && !isLoading ? (
            <div className='flex items-center gap-1'>
              {currentTab === 'products' ? (
                <>
                  <Button
                    group
                    color='red'
                    onClick={() => deleteMutation.mutate()}
                  >
                    Radera handlingslistan
                  </Button>
                  <Button group onClick={() => newTab('categories')}>
                    Kategorier
                  </Button>
                </>
              ) : null}
            </div>
          ) : null}
          {!data && !isLoading ? (
            <Button
              color='primary'
              onClick={() => generateMutation.mutate()}
            >
              Ny handlingslista
            </Button>
          ) : null}
        </div>

        {currentTab === 'products' && (
          <>
            {data && sortedData ? (
              <main className='flex flex-col gap-y-1'>
                {sortedData.map((item) => (
                  <Card
                    key={item.name}
                    name={item.name}
                    amount={item.amount}
                    isCompleted={item.isCompleted}
                    category={item?.category ?? null}
                    details={item?.details ?? null}
                    refetch={refetch}
                    // refetchCompleted={refetchCompleted}
                  />
                ))}
              </main>
            ) : null}

            {!data && !isLoading ? (
              <div className='flex justify-center mt-10'>
                <img src='/empty.svg' className=' bg-white w-[70%]' />
              </div>
            ) : null}
          </>
        )}
        {currentTab === 'categories' &&
          categories &&
          sortedCategoryData && (
            <Categories
              categories={sortedCategoryData}
              refetch={categoriesRefetch}
              refetchProducts={refetch}
            />
          )}
      </div>
    </>
  );
}
