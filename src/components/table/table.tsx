import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { classNames } from '@/helper';

export interface TableProperties {
  data: any[];
  columns: any[];
  loading: boolean;
  onSort?: (sortData: any) => void;
}

function Table({ columns, data, loading, onSort }: TableProperties) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const colData = useMemo(() => data, [data]);
  const colColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data: colData,
    columns: colColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className=' box-border h-max  w-full overflow-x-scroll scrollbar-none bg-white'>
      <table className='box-border min-w-[1200px] w-full flex-col flex-nowrap items-start justify-center font-body'>
        <thead className='h-max min-h-[52px] w-full rounded-sm text-gray-400 font-normal'>
          {!!table?.getHeaderGroups() &&
            (table?.getHeaderGroups() || [])?.map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className='flex h-full w-full flex-row items-center justify-evenly gap-y-6 rounded-sm text-center'>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className='flex min-h-[40px] w-full min-w-[160px] flex-wrap items-center justify-center py-2 text-center text-lg'>
                      {header.isPlaceholder ? undefined : (
                        <button
                          type='button'
                          aria-label='Sort'
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: () => {
                              header.column.getToggleSortingHandler()?.(
                                header.column.getIsSorted()
                              );
                              return onSort?.({
                                id: header.id,
                                desc: header.column.getIsSorted(),
                              });
                            },
                          }}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{ asc: ' 🔼', desc: ' 🔽' }?.[
                            header.column.getIsSorted() as string
                          ] ?? undefined}
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
        </thead>
        <tbody className='h-max w-full'>
          {loading ? (
            <tr className='flex h-full w-full flex-row items-center justify-center'>
              Loading...
            </tr>
          ) : (
            (table?.getRowModel()?.rows || []).map(
              (row: any, index: number) => {
                return (
                  <tr
                    key={row.id}
                    className={classNames(
                      'flex h-max w-full cursor-pointer flex-row items-center justify-evenly rounded-sm text-center hover:bg-slate-100',
                      index === table?.getRowModel()?.rows?.length - 1
                        ? ''
                        : 'border-b-[1px] border-gray-100'
                    )}>
                    {(row?.getVisibleCells() || []).map((cell: any) => {
                      return (
                        <td
                          key={cell.id}
                          className='box-content flex h-fit min-h-[40px] w-full min-w-[160px] flex-wrap items-center justify-center break-words text-center text-base'>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              }
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

Table.defaultProps = {
  onSort: () => {},
};

export default Table;
