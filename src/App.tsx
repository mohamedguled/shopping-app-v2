import { useEffectOnce } from 'usehooks-ts';
import { useQuery, useMutation } from '@tanstack/react-query';
import Button from './components/core/Button';
import Card from './components/core/Card';
import { sortBy } from 'lodash';
import { useMemo } from 'react';
import { shallow } from 'zustand/shallow';
import { useStore } from './store/store';
import { HiPlus } from 'react-icons/hi';
import {
  AddFormSchema,
  addProduct,
  // CategoryType,
  db,
  DeleteAll,
  GetAll,
  Init,
  ProductType,
  Update,
} from './db';
import { toast, Toaster } from 'react-hot-toast';
import Order from './components/views/Order';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
export default function App() {
  useEffectOnce(() => {
    db();
  });

  // function handleAddProduct() {

  //   return
  // }
  // const addProductMutation = useMutation(handleAddProduct, {
  //   onSuccess() {

  //   }
  // })

  const { data, isLoading, refetch } = useQuery(['products'], () =>
    GetAll<ProductType>('items')
  );
  // const {
  //   data: categories,
  //   // isLoading: categoriesLoading,
  //   refetch: categoriesRefetch,
  // } = useQuery(['categories'], () =>
  //   GetAll<CategoryType>('categories')
  // );
  const { register, handleSubmit, reset } = useForm<AddFormSchema>();

  const addMutation = useMutation(addProduct, {
    onSuccess() {
      reset();
      toast.success('Lagt till ny produkt');
      refetch();
    },
  });
  function onSubmit(data: AddFormSchema) {
    addMutation.mutate(data);
  }
  const sortedData = useMemo(() => {
    const sortedArr = sortBy(data, (o) => o?.id);
    return sortedArr;
  }, [data]);
  // const sortedCategoryData = useMemo(() => {
  //   const sortedArr = sortBy(categories, (o) => o.id);
  //   return sortedArr;
  // }, [categories]);

  function handleGenerate() {
    return Init();
  }
  const generateMutation = useMutation(handleGenerate, {
    onSuccess() {
      refetch();
      // categoriesRefetch();
    },
  });

  function handleDelete() {
    return DeleteAll('items');
    // return DeleteAll('categories');
  }
  const deleteMutation = useMutation(handleDelete, {
    onSuccess() {
      refetch();
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
            <h3 className='text-4xl mb-2'>Handlingslista</h3>
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
                  <Button group onClick={() => newTab('order')}>
                    Ordning
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
            <form
              className='flex h-10 mb-2'
              onSubmit={handleSubmit(onSubmit)}
              style={{ width: 'min(100%, 900px)' }}
            >
              <input
                type='text'
                placeholder='Lägg till en egen produkt'
                className='border border-r-0 border-gray-400/70 rounded-l-md h-full grow placeholder:text-gray-500'
                autoComplete='off'
                {...register('name')}
              />
              <button
                type='submit'
                className='h-full py-2 px-3 text-lg font-inter rounded-r-md border border-transparent text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                <HiPlus />
              </button>
            </form>
            {data && sortedData ? (
              <main className='flex flex-col gap-y-1'>
                {sortedData.map((item) => (
                  <Card
                    key={item.name}
                    name={item.name}
                    amount={item.amount}
                    isCompleted={item.isCompleted}
                    details={item?.details ?? null}
                    refetch={refetch}
                    hasImg={item?.hasImg}
                    uploadedImg={item?.uploadedImg}
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

        {currentTab === 'order' && data && (
          <Order data={data} refetch={refetch} />
        )}

        {/* {currentTab === 'categories' &&
          categories &&
          sortedCategoryData && (
            <Categories
              categories={sortedCategoryData}
              refetch={categoriesRefetch}
              refetchProducts={refetch}
            />
          )} */}
      </div>
    </>
  );
}
