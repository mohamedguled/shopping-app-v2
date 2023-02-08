import { ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
const buttonVariants = cva(
  'whitespace-nowrap justify-center items-center gap-2 leading-none border-2 font-medium tracking-wide font-inter h-10 w-10',
  {
    variants: {
      color: {
       blue: "border-green-400 text-green-400",
       red: "border-rose-500 text-rose-500"
      },

      rounded: {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
  
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
    //   size: 'lg',
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

export default function OutlineButton({
  disabled,
  loading,
  fullWidth,
  rounded,
//   size,
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
        // size,
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
