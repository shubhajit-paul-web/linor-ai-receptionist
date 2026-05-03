import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type Row,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  isLoading?: boolean;
  rowCount?: number;
  emptyState?: ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
  /** Optional render override for the row container — used by virtualized variants. */
  rowClassName?: string;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  rowCount = 8,
  emptyState,
  onRowClick,
  className,
  rowClassName,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[12px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)]',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-[var(--color-overlay)]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-[var(--color-border-subtle)]">
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        'h-8 px-3 text-left font-medium text-[10px] uppercase tracking-wider text-[var(--color-tertiary)]',
                        'whitespace-nowrap',
                      )}
                      style={{ width: header.getSize() }}
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1 hover:text-[var(--color-secondary)] transition-colors"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sortDir === 'asc' ? (
                            <ChevronUp className="size-3" />
                          ) : sortDir === 'desc' ? (
                            <ChevronDown className="size-3" />
                          ) : (
                            <ChevronsUpDown className="size-3 opacity-40" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading
              ? Array.from({ length: rowCount }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--color-border-subtle)]">
                    {table.getAllColumns().map((c) => (
                      <td key={c.id} className="h-[var(--row-height)] px-3">
                        <Skeleton className="h-3 w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.length === 0
                ? null
                : table.getRowModel().rows.map((row: Row<T>) => (
                    <tr
                      key={row.id}
                      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                      className={cn(
                        'border-b border-[var(--color-border-subtle)] last:border-b-0 transition-colors',
                        onRowClick && 'cursor-pointer hover:bg-[var(--color-elevated)]',
                        rowClassName,
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="h-[var(--row-height)] px-3 align-middle text-[var(--color-secondary)] whitespace-nowrap"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
      {!isLoading && table.getRowModel().rows.length === 0 && (
        <div className="px-6 py-12">{emptyState ?? <DefaultEmptyState />}</div>
      )}
    </div>
  );
}

function DefaultEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-1">
      <p className="text-sm text-[var(--color-secondary)]">No results</p>
      <p className="text-xs text-[var(--color-tertiary)]">Try adjusting filters or search.</p>
    </div>
  );
}
