import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant rounded-md p-5 ${
        hover ? 'hover:border-outline hover:shadow-ambient cursor-pointer transition-all' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
