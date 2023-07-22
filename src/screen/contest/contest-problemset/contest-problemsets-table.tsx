'use client';

import React, { useEffect, useState, useCallback } from 'react';
import PaginatedTable from '@/components/table/paginated-table';
import { useQuery } from '@tanstack/react-query';
import { Headers } from '@/components/table/headers';
import axiosinstance from '@/utility/axiosinstance';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { TObject } from '@/types';

export default function ProblemSetsTable({ id }: { id: string | number }) {
  const { problemSetRowCol } = Headers();
  const router = useRouter();
  const apiUrl = `/api/contests/${id}/problemSets`;
  const queryName = 'problemSets-table';
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const [parameters, setParameters] = useState({
    PageIndex: page || 1,
    PageSize: 10,
  });
  const { data, isFetching, refetch } = useQuery([queryName], async () => {
    return await axiosinstance.get(apiUrl, { params: parameters });
  });

  // const {
  // 	data: participants,
  // 	isFetching,
  // 	refetch,
  // } = useQuery([queryName], async () => {
  // 	return await axiosinstance.get(apiUrl, { params: parameters });
  // });

  const handleSetParameters = (filterFormData: TObject) => {
    setParameters((previous) => {
      return { ...previous, ...filterFormData };
    });
  };

  const handleChangePage = useCallback(
    (index: number) => {
      handleSetParameters({
        ...parameters,
        PageIndex: index + 1,
      });
    },
    [parameters]
  );
  // useEffect(() => {
  // 	router.replace(`${pathname}?page=${parameters?.PageIndex || 1}`);
  // }, [parameters.page, pathname]);

  useEffect(() => {
    refetch();
  }, [parameters]);

  return (
    <>
      <div className='w-full h-max flex flex-col justify-start items-start'>
        <PaginatedTable
          isPaginated={true}
          columns={problemSetRowCol}
          data={data?.data || []}
          loading={isFetching}
          onChangePage={handleChangePage}
          perPage={10}
          activeColor='bg-gray-100'
          url={`${pathname}/${id}/problemset`}
          totalCount={data?.data?.length}
        />
      </div>
    </>
  );
}
