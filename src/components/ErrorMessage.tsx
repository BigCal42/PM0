import React from 'react';
import classNames from 'classnames';

type ErrorMessageProps = {
  error: string | null | undefined;
  className?: string;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, className }) => {
  if (!error) return null;

  return (
    <div
      className={classNames(
        'rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm',
        className,
      )}
      role="alert"
    >
      {error}
    </div>
  );
};
