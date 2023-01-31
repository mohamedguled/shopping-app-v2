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
// import { CategoryType, updateCategories } from '../../db';
import SortableItem from './CategoryItem';
import { useEffect, useState } from 'react';
import produce from 'immer';
import { z } from 'zod';
import { findIndex, map } from 'lodash';
import Button from '../core/Button';
import { useStore } from '../../store/store';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CategoryType, UpdateCategories } from '../../db/experiment';
const numParse = z.coerce.number();

export default function Categories({
  categories,
  refetch,
  refetchProducts,
}: {
  categories: CategoryType[];
  refetch: () => void;
  refetchProducts: () => void;
}) {
  const [dataState, setDataState] = useState(categories);
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

  async function handleUpdate() {
    const data = map(dataState, (o, i) => {
      const newData = produce(o, (draft) => {
        draft.id = i + 1;
        return draft;
      });
      return newData;
    });
    // console.log('data', data);

    if (touched) {
      await UpdateCategories(data);
      refetch();
      refetchProducts();
    } else {
      throw new Error('Error');
    }
  }
  const { newTab } = useStore();

  const updateMutation = useMutation(handleUpdate, {
    onSuccess() {
      newTab('products');
      toast.success('Uppdaterade kategorier');
    },
  });

  return (
    <div className='flex flex-col'>
      <div className='flex items-center gap-1 mb-2'>
        {touched && (
          <Button
            group
            onClick={() => updateMutation.mutate()}
            color='green'
          >
            Uppdatera
          </Button>
        )}
        <Button group onClick={() => newTab('products')}>
          Varor
        </Button>
      </div>
      {dataState && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            strategy={verticalListSortingStrategy}
            items={dataState}
          >
            <ul className='inline-flex flex-col gap-1 text-white'>
              <>
                {dataState.map((item) => {
                  return <SortableItem key={item.id} {...item} />;
                })}
              </>
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
