import { HTMLAttributes, ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { RiCloseFill } from 'react-icons/ri';
const badgeVariants = cva(
  'inline-flex gap-2 items-center px-2 py-1.5 rounded text-base font-bold leading-none',
  {
    variants: {
      color: {
        blue: 'text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
      },
    },
    defaultVariants: {
      color: 'blue',
    },
  }
);
const badgeButtonVariants = cva(
  'p-0.5 inline-flex items-center bg-transparent rounded-sm text-lg',
  {
    variants: {
      color: {
        blue: 'text-blue-500 hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300',
      },
    },
    defaultVariants: {
      color: 'blue',
    },
  }
);
export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
export type BadgeButtonVariantProps = VariantProps<
  typeof badgeButtonVariants
>;

export interface BadgeProps
  extends BadgeVariantProps,
    BadgeButtonVariantProps,
    Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  children?: ReactNode;
  onClose?: () => void;
}

export default function Badge({
  children,
  color,
  onClose,
  onClick,
}: BadgeProps) {
  return (
    <span className={badgeVariants({ color })}>
      <p className='cursor-pointer' onClick={onClick}>
        {children}
      </p>
      <button
        className={badgeButtonVariants({ color })}
        aria-label='Ta bort'
        onClick={onClose}
      >
        <RiCloseFill />
      </button>
    </span>
  );
}
