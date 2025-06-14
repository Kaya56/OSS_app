// src/components/common/Table.tsx
import React from 'react';

export interface Column<T> {
  key: keyof T | string;
  label?: string;              // texte du header (optionnel)
  header?: React.ReactNode;    // JSX personnalisé pour le header (optionnel, prioritaire)
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  /** Nom de la clé unique dans les données pour `key` React, sinon fallback index */
  rowKey?: keyof T;
}

function Table<T extends object>({
  data,
  columns,
  emptyMessage = 'Aucune donnée disponible',
  rowKey,
  onSort,
  sortField,
  sortDirection,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b">
            {columns.map((col) => {
              const isSorted = col.key === sortField;
              return (
                <th
                  key={String(col.key)}
                  scope="col"
                  onClick={() => col.sortable && onSort && onSort(String(col.key))}
                  className={`px-4 py-2 text-left text-gray-700 font-medium select-none ${
                    col.sortable ? 'cursor-pointer' : ''
                  }`}
                  aria-sort={isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                  title={col.sortable ? 'Cliquer pour trier' : undefined}
                >
                  <div className="inline-flex items-center gap-1">
                    {col.header ?? col.label ?? String(col.key)}
                    {col.sortable && (
                      <span aria-hidden="true" className="text-gray-400">
                        {isSorted ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={
                  rowKey && item[rowKey] !== undefined
                    ? String(item[rowKey])
                    : index
                }
                className="border-b hover:bg-gray-50"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-2 align-top">
                    {col.render
                      ? col.render(item)
                      : col.key in item
                      ? String((item as any)[col.key])
                      : ''}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
