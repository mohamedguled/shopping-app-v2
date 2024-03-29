import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import {
  ChangeEvent,
  HTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { formatText } from '../../utils/formatText';
import firstLetter from '../../utils/firstLetter';
import { HiPlus, HiMinus } from 'react-icons/hi';
import OutlineButton from './OutlineButton';
import { AiFillDelete, AiFillTags } from 'react-icons/ai';
import { MdClose } from 'react-icons/md';
import { BiCheck } from 'react-icons/bi';
import { FaUpload } from 'react-icons/fa';
import { z } from 'zod';
import {
  // CategoryType,
  Delete,
  ToggleComplete,
  UpdateAmount,
} from '../../db/experiment';
import { useMutation } from '@tanstack/react-query';
import { updateProductImage } from '../../db';
const cardVariants = cva(
  'relative rounded-md flex pr-3 transition-all duration-150 items-center justify-between gap-x-2 w-full',
  {
    variants: {
      isCompleted: {
        true: 'bg-card-grayed/90',
        false: 'bg-card-base/90',
      },
    },
  }
);

const imageVariants = cva(
  'w-[110px] aspect-square bg-cover bg-no-repeat bg-center rounded-tl-sm rounded-bl-sm',
  {
    variants: {
      isCompleted: {
        true: 'opacity-50',
      },
      hasImg: {
        false: 'flex justify-center items-center bg-white relative',
      },
    },
  }
);
export type CardVariantProps = VariantProps<typeof cardVariants>;

export interface CardProps
  extends CardVariantProps,
    HTMLAttributes<HTMLDivElement> {
  name: string;
  amount: number;
  isCompleted: boolean;
  // category: CategoryType | null;
  details: string | null;
  refetch: () => void;
  hasImg?: boolean;
  uploadedImg?: string;
  // refetchCompleted: () => void;
}

const inputNum = z.number().min(0);

export default function Card({
  name,
  isCompleted,
  amount,
  details,
  refetch,
  hasImg,
  uploadedImg,
  // refetchCompleted,
  // category,

  ...props
}: CardProps) {
  const [value, setValue] = useState<number>(amount);
  const [completed, setCompleted] = useState<boolean>(isCompleted);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    UpdateAmount(name, value);
  }, [value, UpdateAmount, name]);

  async function handleDelete() {
    // await deleteProduct(name);
    await Delete('items', name);
    refetch();
  }

  async function handleToggleCompleted() {
    // refetch();
    setCompleted((prev) => !prev);
    await ToggleComplete(name, completed);
    // refetchCompleted();
    setIsLoading(true);

    setTimeout(() => setIsLoading(false), 100);
  }

  async function newImage(url: string) {
    await updateProductImage(name, url);
    return name;
  }
  const newImageMutation = useMutation(newImage, {
    onSuccess() {
      refetch();
      console.log('new image');
    },
    onError() {
      console.log('failed to update image');
    },
  });

  function handleFile(files: FileList | null) {
    if (!files) return;

    let file = files[0];

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      const urlSchema = z.string();

      newImageMutation.mutate(urlSchema.parse(reader.result));
    };
    reader.onerror = function () {
      console.log(reader.error);
    };
  }

  return (
    <div
      style={{ width: 'min(100%, 900px)' }}
      className={cardVariants({ isCompleted: completed })}
      {...props}
    >
      <section className='flex items-center gap-2'>
        {hasImg === false ? (
          <div
            className={imageVariants({
              isCompleted: completed,
              hasImg,
            })}
          >
            <label className='cursor-pointer' htmlFor='file'>
              <FaUpload className='text-4xl' />
            </label>
            <input
              onChange={(e) => handleFile(e.currentTarget.files)}
              type='file'
              name='file'
              id='file'
            />
          </div>
        ) : (
          <div
            className={imageVariants({ isCompleted: completed })}
            style={{
              // backgroundImage: `url('/${formatText.dash(
              //   firstLetter.lowerCase(name)
              // )}.jpg')`,
              backgroundImage: `${
                uploadedImg
                  ? `url('${uploadedImg}')`
                  : `url('/${formatText.dash(
                      firstLetter.lowerCase(name)
                    )}.jpg')`
              }`,
            }}
          ></div>
        )}

        <div className='flex flex-col justify-center ml-2'>
          {/* {unitAmount && (
            <p className='text-gray-300'>{unitAmount}</p>
          )} */}
          {details && (
            <p
              className={`text-base ${
                completed ? 'text-gray-400' : 'text-gray-200'
              }`}
            >
              {details}
            </p>
          )}
          <h3
            className={[
              'text-3xl font-semibold text-white',
              `${completed ? 'line-through text-gray-300' : ''}`,
            ].join(' ')}
          >
            {name}
          </h3>

          {/* {category && (
            <div
              className={`flex items-center gap-1 text-sm ${
                completed ? 'text-gray-400' : 'text-sky-300'
              }`}
            >
              <AiFillTags />
              <p>{category.name}</p>
            </div>
          )} */}
        </div>
      </section>
      <section className='flex items-center gap-x-5 pr-3'>
        <div className='flex gap-x-[5px] items-center text-white'>
          <button
            className='p-1'
            onClick={() =>
              setValue((prev) => {
                const newValue = prev - 1;
                const parsed = inputNum.safeParse(newValue);
                if (parsed.success) return parsed.data;
                return prev;
              })
            }
          >
            <HiMinus />
          </button>

          <input
            className='bg-transparent w-[5ch] text-center px-0 py-1 m-0 rounded-md flex justify-center items-center text-sm font-bold border-2'
            type='number'
            min='1'
            max='100'
            value={value}
            onChange={(e) =>
              setValue(parseInt(e.currentTarget.value))
            }
          />
          <button
            className='p-1'
            onClick={() => setValue((prev) => prev + 1)}
          >
            <HiPlus />
          </button>
        </div>

        <div className='flex gap-[11px]'>
          <OutlineButton
            onClick={() => handleToggleCompleted()}
            disabled={isLoading}
            color='blue'
            group
          >
            {completed ? (
              <MdClose className='text-3xl' />
            ) : (
              <BiCheck className='text-3xl' />
            )}
          </OutlineButton>
          <OutlineButton onClick={handleDelete} color='red' group>
            <AiFillDelete className='text-xl' />
          </OutlineButton>
        </div>
      </section>
    </div>
  );
}
