import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableItem(props: {
  name: string;
  id: number;
}) {
  const { transform, transition, setNodeRef, attributes, listeners } =
    useSortable({ id: props.id, data: { name: props.name } });

  const style = {
    transform: CSS.Transform.toString(transform),
    touchAction: 'none',
  };
  return (
    <li
      className='py-2 px-5 bg-slate-800/90 inline-flex rounded-md'
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {props.name}
    </li>
  );
}
