import { ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
const buttonVariants = cva(
  'whitespace-nowrap justify-center items-center gap-2 leading-none border focus:outline-none font-medium tracking-wide font-inter focus:ring-4',
  {
    variants: {
      color: {
        default:
          'text-gray-900 bg-white border-gray-300 hover:bg-gray-100 focus:ring-gray-200  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
        primary:
          'border-transparent text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
        green:
          'border-transparent text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800',
        dark: 'border-transparent outline-none bg-gray-800 text-white hover:bg-gray-900 focus:outline-none focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700',
        red: 'border-transparent text-white bg-rose-700 hover:bg-rose-800 focus:ring-green-300 dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800',
      },

      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-xs',
        lg: 'px-6 py-3 text-sm',
      },
      rounded: {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        // left: 'rounded-tl-md rounded-bl-md',
        // right: 'rounded-tr-md rounded-br-md',
      },
      fullWidth: {
        true: 'flex w-full',
        false: 'inline-flex w-auto self-start',
      },
      disabled: {
        true: 'pointer-events-none',
      },
      loading: {
        true: 'bg-opacity-80',
      },
      font: {
        fira: 'font-fira',
        inter: 'font-inter',
      },
      flexWrap: {
        true: 'max-w-1/2 flex-1',
        // four: 'max-w-1/2 min-w-1/4 flex-1',
        // five: 'max-w-1/2 min-w-1/5 flex-1',
      },
      group: {
        true: 'first:rounded-r-none last:rounded-l-none',
      },
    },
    compoundVariants: [
      {
        rounded: 'sm',
        group: true,
        className:
          'first:rounded-r-none first:rounded-l-sm last:rounded-l-none last:rounded-r-sm only:rounded-sm rounded-none',
      },
      {
        rounded: 'md',
        group: true,
        className:
          'first:rounded-r-none first:rounded-l-md last:rounded-l-none last:rounded-r-md only:rounded-md rounded-none',
      },
      {
        rounded: 'lg',
        group: true,
        className:
          'first:rounded-r-none first:rounded-l-lg last:rounded-l-none last:rounded-r-lg only:rounded-lg rounded-none',
      },
    ],

    defaultVariants: {
      color: 'default',
      size: 'lg',
      rounded: 'md',
      fullWidth: false,
    },
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
export type FramerButtonBaseProps = VariantProps<
  typeof motion.button
>;

export interface ButtonProps
  extends ButtonVariantProps,
    Omit<FramerButtonBaseProps, 'disabled' | 'color'> {
  children?: ReactNode;
}

export default function Button({
  disabled,
  loading,
  fullWidth,
  rounded,
  size,
  color,
  whileTap,
  initial,
  children,
  font,
  flexWrap,
  group,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      initial={initial}
      whileTap={whileTap}
      className={buttonVariants({
        disabled,
        fullWidth,
        loading,
        rounded,
        size,
        color,
        font,
        flexWrap,
        group,
      })}
      {...props}
    >
      {loading ? (
        <PulseLoader
          color='currentColor'
          size={11}
          className='m-0 p-0 leading-none'
        />
      ) : (
        children
      )}
    </motion.button>
  );
}
