'use client';

import React, { useEffect, useState, useCallback } from 'react';
import PaginatedTable from '@/components/table/paginated-table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Headers } from '@/components/table/headers';
import axiosinstance from '@/utility/axiosinstance';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { TObject } from '@/types';
import { BookmarkIcon, HeartIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import useAuth from '@/hooks/use-auth';
import Pagination from '@/components/pagination/pagination';
import Link from 'next/link';

export function DefineDifficultyType({ type }: { type: string }) {
  if (type === 'oson' || type === 'Oson') {
    return (
      <span className='text-white bg-green-400 rounded-lg px-[10px] py-1'>
        {type}
      </span>
    );
  }
  if (
    type === "o'rta" ||
    type === "O'rta" ||
    type === 'orta' ||
    type === 'Orta' ||
    type === 'o`rta' ||
    type === 'O`rta'
  ) {
    return (
      <span className='text-black bg-yellow-400 rounded-lg px-[10px] py-1'>
        {type}
      </span>
    );
  }
  if (type === 'qiyin' || type === 'Qiyin') {
    return (
      <span className='text-white bg-red-400 rounded-lg px-[10px] py-1'>
        {type}
      </span>
    );
  }
  if (type === 'Murakkab' || type === 'murakkab') {
    return (
      <span className='text-white bg-purple-400 rounded-lg px-[10px] py-1'>
        {type}
      </span>
    );
  }
  return (
    <span className='text-black bg-gray-400 rounded-lg px-[10px] py-1'>
      {type}
    </span>
  );
}

export default function ContestScreen() {
  const { generalProblemSetsRowCol } = Headers();
  const router = useRouter();
  const apiUrl = '/api/problemsets';
  const saveProblemsetUrl = `/api/pinnedproblemset/`;
  const searchProblemsetUrl = `/api/problemsets/search`;
  const searchProblemsetName = `search-problemset`;
  const queryName = 'problemsets-table';
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const [parameters, setParameters] = useState({
    PageIndex: page || 1,
    PageSize: 5,
  });
  const [searchData, setSearchData] = useState<Record<string, any>[]>([]);
  const { data, isFetching, refetch } = useQuery(
    [queryName, page],
    async () => {
      return await axiosinstance.get(apiUrl, { params: parameters });
    }
  );

  const saveProblemSetMutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.post(`${saveProblemsetUrl}${data?.id}`);
    },
    {
      onSuccess: () => {
        toast.success('Masala saqlandi');
      },
      onError: (error: Record<string, any>) => {
        if (error?.response?.status === 400) {
          toast.error('Masala mavjud');
        }
      },
    }
  );

  const searchMutation = useMutation(
    () => {
      return axiosinstance.get(`${searchProblemsetUrl}/${user?.search}`);
    },
    {
      onSuccess: (data) => {
        setSearchData(data?.data?.data);
      },
    }
  );

  const handleSetParameters = (filterFormData: TObject) => {
    setParameters((previous) => {
      return { ...previous, ...filterFormData };
    });
  };

  const handleSaveContest = (id: number) => {
    saveProblemSetMutation.mutate({ id });
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
  useEffect(() => {
    router.replace(`${pathname}?page=${parameters?.PageIndex || 1}`);
  }, [parameters, pathname]);

  useEffect(() => {
    refetch();
  }, [parameters]);

  useEffect(() => {
    if (user?.search) searchMutation.mutate();
  }, [user?.search]);
  return (
    <>
      {user?.search ? (
        searchData?.length > 0 ? (
          searchData?.map((item: Record<string, any>, index: number) => {
            return (
              <Link
                key={index}
                href={`${pathname}/problemset?id=${item?.id}`}
                className='w-full flex flex-col justify-start items-start bg-white rounded-md py-6 px-7 gap-5'>
                <h1 className='text-lg md:text-xl lg:text-2xl font-semibold'>
                  #{item?.id} {item?.name}
                </h1>
                <div className='w-full flex flex-row flex-wrap justify-start items-start gap-5'>
                  <section className='flex flex-row justify-center items-center gap-2'>
                    Qiyinchilik:
                    <DefineDifficultyType type={item?.type} />
                  </section>
                  <section className='flex flex-row justify-center items-center gap-2'>
                    Xotira:
                    <span className='px-[10px] py-1 bg-blue text-white rounded-lg'>
                      {item?.memoryLimit / 1000}Mb
                    </span>
                  </section>
                </div>
                {item?.definition &&
                  (item?.definition?.startsWith('<') ||
                  item?.definition?.startsWith('\n') ? null : (
                    <p className='w-full text-gray-500 font-normal break-words text-lg lg:text-xl'>
                      {item?.definition?.slice(0, 150)}
                    </p>
                  ))}

                <div className='text-[#8B92A5] flex flex-row justify-end items-center w-full'>
                  {/* <span className='flex flex-row justify-center items-center gap-1'>
                    <HeartIcon width={18} />
                  </span> */}
                  <button
                    disabled={!isAuthenticated}
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      handleSaveContest(item?.id);
                    }}
                    className='flex flex-row justify-center items-center gap-1 disabled:opacity-20 disabled:cursor-not-allowed'>
                    <BookmarkIcon width={18} />
                  </button>
                </div>
              </Link>
            );
          })
        ) : (
          'Topshiriq mavjud emas'
        )
      ) : (
        <>
          <div className='w-full h-full flex flex-col justify-start items-start rounded-xl overflow-y-scroll scrollbar-none gap-5'>
            {/* <h1 className='my-3 text-xl font-semibold'>Masalalar</h1> */}
            {/* <PaginatedTable
          isPaginated={data?.data?.['length'] > 15 || false}
          columns={generalProblemSetsRowCol}
          data={data?.data?.data || []}
          loading={isFetching}
          onChangePage={handleChangePage}
          perPage={15}
          pageNum={Number(page) || 1}
          url={`${pathname}/problemset`}
          activeColor='bg-gray-100'
          totalCount={data?.data?.['length']}
        /> */}
            {data?.data?.data?.map(
              (item: Record<string, any>, index: number) => {
                return (
                  <Link
                    key={index}
                    href={`${pathname}/problemset?id=${item?.id}`}
                    className='w-full flex flex-col justify-start items-start bg-white rounded-md py-6 px-7 gap-5'>
                    <h1 className='text-lg md:text-xl lg:text-2xl font-semibold'>
                      #{item?.id} {item?.name}
                    </h1>
                    <div className='w-full flex flex-row flex-wrap justify-start items-start gap-5'>
                      <section className='flex flex-row justify-center items-center gap-2'>
                        Qiyinchilik:
                        <DefineDifficultyType type={item?.type} />
                      </section>
                      <section className='flex flex-row justify-center items-center gap-2'>
                        Xotira:
                        <span className='px-[10px] py-1 bg-blue text-white rounded-lg'>
                          {item?.memoryLimit / 1000}Mb
                        </span>
                      </section>
                    </div>
                    {item?.definition &&
                      (item?.definition?.startsWith('<') ||
                      item?.definition?.startsWith('\n') ? null : (
                        <p className='w-full text-gray-500 font-normal break-words text-lg lg:text-xl'>
                          {item?.definition?.slice(0, 150)}
                        </p>
                      ))}

                    <div className='text-[#8B92A5] flex flex-row justify-end items-center w-full'>
                      {/* <span className='flex flex-row justify-center items-center gap-1'>
                        <HeartIcon width={18} />0
                      </span> */}
                      <button
                        disabled={!isAuthenticated}
                        onClick={(event) => {
                          event.stopPropagation();
                          event.preventDefault();
                          handleSaveContest(item?.id);
                        }}
                        className='flex flex-row justify-center items-center gap-1 disabled:opacity-20 disabled:cursor-not-allowed'>
                        <BookmarkIcon width={18} />
                      </button>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
          <div className='w-full flex justify-center items-center box-border'>
            <Pagination
              onChangePage={handleChangePage}
              perPage={5}
              totalCount={data?.data?.['length'] || 0}
            />
          </div>
        </>
      )}
    </>
  );
}
