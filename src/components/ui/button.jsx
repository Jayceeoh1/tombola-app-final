export function Button({ children, onClick, className = '', variant = 'default' }) {
  const base = variant === 'outline'
    ? 'border border-gray-400 text-gray-700 bg-white hover:bg-gray-100'
    : variant === 'destructive'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-blue-600 text-white hover:bg-blue-700';
  return (
    <button onClick={onClick} className={`rounded px-4 py-2 transition ${base} ${className}`}>
      {children}
    </button>
  );
}
