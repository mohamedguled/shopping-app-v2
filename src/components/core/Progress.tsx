import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { HTMLAttributes } from 'react';
const progressWrapperVariants = cva(
  'w-full bg-gray-200 rounded-full dark:bg-gray-700',
  {
    variants: {
      size: {
        sm: 'h-1.5',
        base: 'h-2.5',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
);
const progressVariants = cva('h-full rounded-full', {
  variants: {
    color: {
      blue: 'bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 transition-all ease-in-out duration-300',
    },
  },
});

export type ProgressWrapperVariantProps = VariantProps<
  typeof progressWrapperVariants
>;
export type ProgressVariantProps = VariantProps<
  typeof progressVariants
>;

export interface ProgressProps
  extends ProgressWrapperVariantProps,
    ProgressVariantProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  percentage: number;
}

export default function Progress({
  percentage,
  color,
  size,
}: ProgressProps) {
  return (
    <div className={progressWrapperVariants({ size })}>
      <div
        style={{ width: `${percentage.toString()}%` }}
        className={progressVariants({ color })}
      ></div>
    </div>
  );
}
