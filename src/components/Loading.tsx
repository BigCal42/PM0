interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-transparent border-t-blue-500 border-r-purple-500 mb-4"></div>
        <p className="text-dark-text-muted">{message}</p>
      </div>
    </div>
  );
}

