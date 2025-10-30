import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
}

export function Card({ children, title, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow p-6 ${className}`}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      )}
      {children}
    </div>
  );
}

