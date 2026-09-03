import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant rounded-md p-5 ${
        hover ? 'hover:border-outline hover:shadow-ambient cursor-pointer transition-all' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
