import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
}

export function Card({ children, title, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-dark-card rounded-xl shadow-2xl border border-dark-border p-6 backdrop-blur-sm bg-opacity-90 hover:border-blue-500/50 transition-all duration-300 ${className}`}
      {...props}
    >
      {title && (
        <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{title}</h3>
      )}
      <div className="text-dark-text-muted">
        {children}
      </div>
    </div>
  );
}

