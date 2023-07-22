'use client';

import React, { useEffect, useState, useCallback } from 'react';
import PaginatedTable from '@/components/table/paginated-table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Headers } from '@/components/table/headers';
import axiosinstance from '@/utility/axiosinstance';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { classNames } from '@/helper';
import { TObject } from '@/types';
import useAuth from '@/hooks/use-auth';
import { BookmarkIcon, HeartIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

export default function ContestScreen() {
  const { contestRowCol } = Headers();
  const router = useRouter();
  const apiUrl = '/api/contests/topregs';
  // const apiUrl = '/api/contests';
  const registerContestUrl = '/api/contests/registr';
  const saveContestUrl = `/api/pinnedcontest/`;
  const queryName = 'contest-table-top';
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const [parameters, setParameters] = useState({
    PageIndex: page || 1,
  });
  const { data, isFetching } = useQuery([queryName], async () => {
    return await axiosinstance.get(apiUrl);
  });

  const mutation = useMutation((data: Record<string, any>) => {
    return axiosinstance.post(registerContestUrl, data);
  });

  const saveContestMutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.post(`${saveContestUrl}${data?.id}`);
    },
    {
      onSuccess: () => {
        toast.success('Musobaqa saqlandi');
      },
    }
  );

  const handleSetParameters = (filterFormData: TObject) => {
    setParameters((previous) => {
      return { ...previous, ...filterFormData };
    });
  };

  const handleSaveContest = (id: number) => {
    saveContestMutation.mutate({ id });
  };

  const handleChangePage = useCallback(
    (index: number) => {
      handleSetParameters({
        ...parameters,
        page: index + 1,
      });
    },
    [parameters]
  );

  // useEffect(() => {
  //   if (!tab) {
  //     router.replace(`${pathname}?tab=1`);
  //   }
  // }, [tab, pathname]);

  // useEffect(() => {
  //   if (!tab) router.replace(`${pathname}?tab=1`);
  // }, [tab]);

  return (
    <>
      <div className='w-full h-max flex flex-col justify-start items-start gap-5 overflow-y-scroll scrollbar-none'>
        {/* <h1 className='my-3 text-xl font-semibold'>
          Boshlanadigan Musobaqalar
        </h1> */}
        {data?.data?.['length'] > 0 ? (
          data?.data?.data?.map((item: Record<string, any>, index: number) => {
            return (
              <div
                key={index}
                className='w-full flex flex-col justify-start items-start bg-white rounded-md py-6 px-7 gap-5'>
                <h1 className='text-lg md:text-xl lg:text-2xl font-semibold'>
                  {item?.name}
                </h1>
                {item?.description && (
                  <p className='w-full text-gray-500 font-normal'>
                    {item?.description}
                  </p>
                )}
                {item?.status !== 'Finished' ? (
                  <button
                    disabled={mutation.isLoading}
                    type='submit'
                    className='w-max rounded-md py-2 px-5 bg-blue text-sm md:text-md lg:text-lg text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white hover:text-blue hover:ring-2 hover:ring-blue'>
                    {mutation.isLoading ? (
                      <>
                        <svg
                          aria-hidden='true'
                          role='status'
                          className='inline w-4 h-4 mr-3 text-white animate-spin'
                          viewBox='0 0 100 101'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                            fill='#E5E7EB'
                          />
                          <path
                            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                            fill='currentColor'
                          />
                        </svg>
                        Bir oz kuting...
                      </>
                    ) : (
                      <span className='flex flex-row justify-center items-center gap-3'>
                        Ro{"'"}yxatdan o{"'"}tish
                      </span>
                    )}
                  </button>
                ) : (
                  <p className='text-gray-500 text-lg'>Musobaqa yakunlandi</p>
                )}
                <div className='text-[#8B92A5] flex flex-row justify-between items-center w-full'>
                  <span className='flex flex-row justify-center items-center gap-1'>
                    <HeartIcon width={18} />0
                  </span>
                  <button
                    disabled={!isAuthenticated || item?.status === 'Finished'}
                    onClick={() => handleSaveContest(item?.id)}
                    className='flex flex-row justify-center items-center gap-1 disabled:opacity-20 disabled:cursor-not-allowed'>
                    <BookmarkIcon width={18} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className='w-full flex flex-col justify-center items-center bg-white rounded-md py-6 px-7 gap-5'>
            <h1 className='text-lg md:text-xl lg:text-2xl font-medium'>
              Hozirda top musobaqalar mavjud emas
            </h1>
          </div>
        )}
      </div>
    </>
  );
}
