import { classNames } from '@/helper';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

const paginationClasses = {
  linkClass: 'h-full w-full  flex items-center justify-center',
  class: 'h-10 w-10',
};

export interface PaginationProperties {
  totalCount?: number;
  perPage?: number;
  currentPage: number;
  onChangePage: (index: number) => void;
}

export interface AppPaginationProperties
  extends Omit<PaginationProperties, 'currentPage'> {
  pageNum?: number;
  activeColor?: string;
}

function AppPagination({
  perPage,
  totalCount,
  onChangePage,
  pageNum,
  activeColor,
}: AppPaginationProperties) {
  const [pageCount, setPageCount] = useState(0);
  const [pageRangeDisplayed, setpageRangeDisplayed] = useState(0);

  const handlePageClick = (event: any) => {
    onChangePage(event.selected);
  };

  useEffect(() => {
    setpageRangeDisplayed(perPage!);
    setPageCount(totalCount! / perPage!);
  }, [totalCount, perPage]);

  return (
    <div className=' box-border flex flex-row justify-start items-center rounded-lg  h-max  w-max overflow-x-scroll  scrollbar-none scroll-smooth'>
      <ReactPaginate
        containerClassName='border border-blue-500 w-full h-max'
        pageLinkClassName={paginationClasses.linkClass}
        breakLinkClassName={paginationClasses.linkClass}
        pageClassName={paginationClasses.class}
        breakClassName={paginationClasses.class}
        nextClassName={paginationClasses.class}
        previousClassName={paginationClasses.class}
        nextLinkClassName={paginationClasses.linkClass}
        previousLinkClassName={paginationClasses.linkClass}
        className='box-border flex max-w-[1200px] w-max items-center justify-between font-body py-2 scrollbar-none gap-x-2 !list-none'
        activeClassName={classNames(
          'text-black rounded-md h-10 w-12',
          activeColor ? activeColor : 'bg-white'
        )}
        breakLabel='...'
        nextLabel={
          <ChevronRightIcon
            width={20}
            color={'rgb(147 51 234 / var(--tw-border-opacity))'}
          />
        }
        previousLabel={
          <ChevronLeftIcon
            width={20}
            color={'rgb(147 51 234 / var(--tw-border-opacity))'}
          />
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={pageRangeDisplayed}
        pageCount={Math.ceil(pageCount)}
        forcePage={(pageNum && pageNum - 1) || 0}
        renderOnZeroPageCount={undefined}
      />
    </div>
  );
}

AppPagination.defaultProps = {
  pageNum: 0,
};

export default AppPagination;
