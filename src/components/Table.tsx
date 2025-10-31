import { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  rows: ReactNode[][];
}

export function Table({ headers, rows }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-dark-border">
      <table className="min-w-full divide-y divide-dark-border">
        <thead className="bg-dark-surface">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-medium text-dark-text-muted uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-dark-card divide-y divide-dark-border">
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-dark-surface transition-colors">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

