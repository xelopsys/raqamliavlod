'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Loader from '@/components/loader/video-loading';
import { classNames } from '@/helper';
import useDrag from '@/hooks/use-drag';
import useAuth from '@/hooks/use-auth';
import Pagination from '@/components/pagination/pagination';
import NiceModal from '@ebay/nice-modal-react';
import {
  CheckIcon,
  EyeIcon,
  UserGroupIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import UpdateContest from '@/form/update-contest-modal';

export default function CoursesScreen() {
  const apiUrl = '/api/contests';
  const queryName = 'contests-admin';
  const pathname = usePathname();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState<Record<string, any>>({
    PageIndex: 1,
    PageSize: 5,
    searchText: user?.search || '',
  });

  const { data, isFetching, refetch } = useQuery([queryName], async () => {
    return await axiosinstance.get(apiUrl, { params });
  });

  const deleteMutation = useMutation(
    (id: string) => {
      return axiosinstance.delete(`${apiUrl}/${id}`);
    },
    {
      onSuccess: (data) => {
        toast.success("Kontest o'chirildi");
        queryClient.invalidateQueries();
      },
      onError: (error) => {
        toast.error('Xatolik');
      },
    }
  );

  // const searchMutation = useMutation(
  //   () => {
  //     return axiosinstance.get(`${searchCoursesUrl}/${user?.search}`);
  //   },
  //   {
  //     onSuccess: (data) => {
  //       setSearchData(data?.data);
  //     },
  //   }
  // );

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (item: Record<string, any>) => {
    NiceModal.show(UpdateContest, {
      id: item?.id,
      name: item?.name,
      description: item?.description,
      startdate: item?.startedDate,
      enddate: item?.endDate,
    });
  };

  const handleParameters = (paramaters: Record<string, any>) => {
    setParams((prev) => {
      return {
        ...prev,
        ...paramaters,
      };
    });
  };

  const handleChangePage = useCallback(
    (index: number) => {
      handleParameters({
        PageIndex: index + 1,
      });
    },
    [params]
  );

  useEffect(() => {
    refetch();
  }, [params]);

  useEffect(() => {
    setParams((prev) => {
      return {
        ...prev,
        searchText: user?.search,
      };
    });
  }, [user?.search]);

  return (
    <>
      <div className='w-full h-max flex flex-col justify-start items-start gap-5 overflow-y-scroll scrollbar-none'>
        {data?.data?.data?.map((item: Record<string, any>, index: number) => {
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
              <div className='w-full flex flex-row justify-between items-center'>
                <button
                  disabled={deleteMutation.isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDelete(item?.id);
                  }}
                  type='submit'
                  className='w-max rounded-md py-2 px-5 bg-red-500 text-sm md:text-md lg:text-lg text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white hover:text-red-500 hover:ring-2 hover:ring-red-500'>
                  {deleteMutation.isLoading ? (
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
                      O{"'"}chirish
                    </span>
                  )}
                </button>
                <PencilIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleEdit(item);
                  }}
                  width={20}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className='w-full flex justify-center items-center box-border'>
        <Pagination
          onChangePage={handleChangePage}
          perPage={5}
          totalCount={data?.data?.['length'] || 0}
        />
      </div>
    </>
  );
}
