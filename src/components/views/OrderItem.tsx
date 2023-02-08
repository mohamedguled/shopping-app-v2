import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import firstLetter from '../../utils/firstLetter';
import { formatText } from '../../utils/formatText';

export default function SortableItem(props: {
  name: string;
  id: number;
  uploadedImg?: string;
}) {
  const { transform, transition, setNodeRef, attributes, listeners } =
    useSortable({ id: props.id, data: { name: props.name } });

  const style = {
    transform: CSS.Transform.toString(transform),
    touchAction: 'none',
  };
  return (
    <li
      className='text-lg font-semibold py-2 px-5 bg-slate-800/90 inline-flex items-center rounded-md gap-3'
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div
        style={{
          backgroundImage: `${
            props.uploadedImg
              ? `url('${props.uploadedImg}')`
              : `url('/${formatText.dash(
                  firstLetter.lowerCase(props.name)
                )}.jpg')`
          }`,
        }}
        className='w-7 aspect-square bg-contain'
      ></div>
      {props.name}
    </li>
  );
}
