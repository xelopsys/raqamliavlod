import React, { useState } from 'react';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import Link from 'next/link';
import { TableProperties } from './table';
import { classNames } from '@/helper';

export interface LinkedProperties extends TableProperties {
  url: string;
  query: string;
  searchParam?: string;
}

function LinkedTable({
  url,
  loading,
  data,
  columns,
  onSort,
  query,
  searchParam,
}: LinkedProperties) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    sortingFns: {
      myCustomSorting: (rowA: any, rowB: any, columnId: any): number =>
        rowA.getValue(columnId).value < rowB.getValue(columnId).value ? 1 : -1,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className=' box-border h-max  w-full overflow-scroll scrollbar-none bg-white'>
      <table className='box-border w-full min-w-[1200px] flex-col flex-nowrap items-start justify-center font-body'>
        <thead className='h-max min-h-[52px] w-full rounded-sm text-gray-400'>
          {!!table?.getHeaderGroups() &&
            (table?.getHeaderGroups() || [])?.map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className='flex h-full w-full flex-row items-center justify-center gap-y-6 rounded-sm text-center font-normal'>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className='min-h-[40px] w-full min-w-[160px] py-2 text-center text-lg'>
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
                          {
                            { empty: '', asc: ' 🔼', desc: ' 🔽' }?.[
                              header.column.getIsSorted() || 'empty'
                            ]
                          }
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
                  <Link
                    href={`${url}?id=${
                      row.original?.[query] || row.original?.id
                    }${searchParam ? `&${searchParam}` : ''}`}
                    key={row.original?.id}>
                    <tr
                      key={row.original?.id}
                      className={classNames(
                        'flex h-max w-full cursor-pointer flex-row items-center justify-center rounded-sm text-center hover:bg-slate-100',
                        index === table?.getRowModel()?.rows?.length - 1
                          ? ''
                          : 'border-b-[1px] border-gray-100'
                      )}>
                      {(row?.getVisibleCells() || []).map((cell: any) => {
                        return (
                          <td
                            key={cell.id}
                            className='box-border flex h-fit min-h-[40px] w-full min-w-[160px] flex-row flex-wrap items-center justify-center break-words text-center text-base underline decoration-purple-500'>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </Link>
                );
              }
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LinkedTable;
