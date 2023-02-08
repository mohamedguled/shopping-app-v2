import {
  Delete,
  Get,
  GetAll,
  PresetType,
  ProductType,
  updateProducts,
} from '../../db';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Fragment, useEffect, useState } from 'react';
import produce from 'immer';
import { z } from 'zod';
import { findIndex, map } from 'lodash';
import Button from '../core/Button';
import { useSelectStore, useStore } from '../../store/store';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Update } from '../../db';
import SortableItem from './OrderItem';
import { useForm } from 'react-hook-form';
import { RiCloseFill } from 'react-icons/ri';
import Badge from '../core/Badge';
import SelectComponent from '../core/SelectComponent';
import { shallow } from 'zustand/shallow';

const numParse = z.coerce.number();

export default function Order({
  data,
  refetch,
}: {
  data: ProductType[];
  refetch: () => void;
}) {
  // const { currentItem } = useSelectStore(
  //   state => ({
  //     items: state.items,
  //     currentItem: state.currentItem,
  //   }),
  //   shallow
  // );
  const [dataState, setDataState] = useState(data);
  const [selected, setSelected] = useState<boolean>(false);
  const [touched, setTouched] = useState<boolean>(false);

  function handleDragEnd(e: DragEndEvent) {
    console.log('Drag end');
    const { active, over } = e;
    if (!over?.id) return;
    // console.log('ACTIVE: ', active.id);
    console.log('ACTIVE: ', active.data.current?.name);
    // console.log('OVER :', over?.id);
    console.log('OVER :', over.data.current?.name);

    if (touched === false) {
      setTouched(true);
    }
    if (active.id !== over.id) {
      const newData = produce(dataState, (draft) => {
        const activeId = numParse.parse(active.id);
        const overId = numParse.parse(over.id);
        const activeIndex = findIndex(
          draft,
          (o) => o.id === activeId
        );
        const overIndex = findIndex(draft, (o) => o.id === overId);

        return arrayMove(draft, activeIndex, overIndex);
      });

      if (newData) {
        setDataState(newData);
      }
    }
  }
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const pointerSensor = useSensor(PointerSensor);
  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
    pointerSensor
  );
  const { data: presetsData, refetch: refetchPresets } = useQuery(
    ['presets'],
    () => GetAll<PresetType>('presets')
  );
  async function handleUpdate() {
    const data = map(dataState, (o, i) => {
      const newData = produce(o, (draft) => {
        draft.id = i + 1;
        return draft;
      });
      return newData;
    });
    if (touched) {
      await updateProducts(data);
      refetch();
    } else {
      throw new Error('Error');
    }
  }

  async function handleDeletePreset(name: string) {
    await Delete('presets', name);
  }
  const { register, watch, handleSubmit, reset } = useForm<{
    name: string;
    data: ProductType[];
  }>();

  const nameWatch = watch('name');
  async function handleNewPreset() {
    Update(
      'presets',
      { name: nameWatch, data: dataState },
      nameWatch
    );
  }
  const { newTab } = useStore();
  const updateMutation = useMutation(handleUpdate, {
    onSuccess() {
      newTab('products');
      toast.success('Uppdaterade ordningen');
    },
  });

  const newPresetMutation = useMutation(handleNewPreset, {
    onSuccess() {
      refetchPresets();
      reset();
      setTouched(false);
      toast.success('Sparade ordningen');
    },
  });

  const deletePresetMutation = useMutation(handleDeletePreset, {
    onSuccess() {
      refetchPresets();
    },
  });

  function onSubmit(data: { name: string; data: ProductType[] }) {
    newPresetMutation.mutate();
  }

  useEffect(() => {
    console.log(
      map(presetsData, (o) => {
        return o.name;
      })
    );
  }, [presetsData]);

  function handleBadgeClick(data: ProductType[]) {
    setDataState(data);
    setSelected(true);
    setTouched(false);
  }

  const anyModifier = touched || selected;
  return (
    <div className='flex flex-col'>
      <section className='flex flex-col gap-2 mb-2'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-1'>
            {anyModifier ? (
              <Button
                group
                onClick={() => updateMutation.mutate()}
                color='green'
              >
                Uppdatera
              </Button>
            ) : null}
            <Button group onClick={() => newTab('products')}>
              Varor
            </Button>
          </div>
          {/* {presetsData && (
            <div className='flex items-center gap-1 overflow-x-scroll w-1/2 badge_container'>
              <h3 className='font-semibold'>Sparade</h3>
              {presetsData.map((item) => {
                return (
                  <Badge
                    key={item.name}
                    onClick={() => handleBadgeClick(item.data)}
                    onClose={() =>
                      deletePresetMutation.mutate(item.name)
                    }
                  >
                    {item.name}
                  </Badge>
                );
              })}
            </div>
          )} */}
          {/* {presetsData ? (
            <>
              <select name='presets' id='presets'>
                <option>Välj ordning</option>
                {presetsData.map((item) => {
                  return (
                    <>
                      <option key={item.name}>{item.name}</option>
                    </>
                  );
                })}
              </select>
            </>
          ) : null} */}
          {/* {presetsData && currentItem && (
            <SelectComponent
              defaultOption={presetsData[0]}
              options={presetsData}
            />
          )} */}
        </div>
        {/* <div > */}
        {/* {touched && (
          <form
            className='flex items-center h-10 w-full'
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              {...register('name')}
              type='text'
              placeholder='Namn'
              autoComplete='off'
              className='flex grow text-black border-t border-l border-b border-gray-300 p-2 h-full indent-1 rounded-l-md'
            />
            <button className='h-full font-semibold py-2 px-3 text-sm font-inter rounded-r-md border border-transparent text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
              Spara ordning
            </button>
          </form>
        )} */}
        {/* </div> */}
      </section>

      {dataState && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            strategy={verticalListSortingStrategy}
            items={dataState as any[]}
          >
            <ul className='inline-flex flex-col gap-1 text-white'>
              <>
                {dataState.map((item) => {
                  return (
                    <Fragment key={item.id}>
                      {item.id && item.name && (
                        <SortableItem id={item.id} name={item.name} uploadedImg={item?.uploadedImg} />
                      )}
                    </Fragment>
                  );
                })}
              </>
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
