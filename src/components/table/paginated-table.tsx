import React from 'react';
import LinkedTable, { LinkedProperties } from './linked-table';
import NewTable from './table';
import AppPagination, {
  AppPaginationProperties,
} from '../pagination/pagination';

interface PaginatedProperties
  extends Omit<LinkedProperties, 'url' | 'query'>,
    AppPaginationProperties {
  isPaginated: boolean;
  url?: string;
  query?: string;
}

function PaginatedTable({
  isPaginated,
  url,
  totalCount,
  pageNum,
  onChangePage,
  perPage,
  data,
  columns,
  loading,
  onSort,
  query,
  activeColor,
  searchParam,
}: PaginatedProperties) {
  return (
    <div className='flex h-full w-full flex-col flex-nowrap box-border'>
      {url ? (
        <LinkedTable
          query={query || ''}
          url={url || ''}
          data={data}
          columns={columns}
          loading={loading}
          onSort={onSort}
          searchParam={searchParam}
        />
      ) : (
        <NewTable
          data={data}
          columns={columns}
          loading={loading}
          onSort={onSort}
        />
      )}
      {isPaginated && (
        <div className='w-full h-max flex flex-row justify-center items-center'>
          <AppPagination
            totalCount={totalCount}
            pageNum={pageNum}
            onChangePage={onChangePage}
            perPage={perPage}
            activeColor={activeColor}
          />
        </div>
      )}
    </div>
  );
}

PaginatedTable.defaultProps = {
  url: '',
  query: '',
};

export default PaginatedTable;
