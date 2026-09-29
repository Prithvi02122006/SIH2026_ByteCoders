import React from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  emptyMessage = 'No records logged yet.',
  className = '',
  onRowClick,
}: DataTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="py-10 text-center text-xs text-[#64625A] bg-[#FCF9F2] rounded-[10px] border border-[#EAE3CE]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-[12px] border border-[#E5DECE] bg-[#FCF9F2] ${className}`}>
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#E5DECE] bg-[#F7F2E4] text-[#3D3B34]">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-2.5 px-3.5 font-semibold text-[11px] uppercase tracking-wider ${
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left'
                } ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EAE3CE]/70">
          {data.map((row, rIdx) => (
            <tr
              key={rIdx}
              onClick={() => onRowClick && onRowClick(row)}
              className={`hover:bg-[#F9F5EC] transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {columns.map((col, cIdx) => (
                <td
                  key={cIdx}
                  className={`py-2.5 px-3.5 text-[#1F201C] ${
                    col.align === 'right'
                      ? 'text-right font-mono'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.cell
                    ? col.cell(row, rIdx)
                    : col.accessorKey
                    ? String(row[col.accessorKey] ?? '')
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Indian Currency Formatter helper
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Indian Date Formatter (DD/MM/YYYY)
export function formatDateIN(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}
