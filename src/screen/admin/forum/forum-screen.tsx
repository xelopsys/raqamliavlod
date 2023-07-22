'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import useAuth from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { classNames, compareDateAndGetLastSeen } from '@/helper';
import { usePathname } from 'next/navigation';
import { TObject } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import Loader from '@/components/loader/block-loading';
import Pagination from '@/components/pagination/pagination';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function ForumScreen() {
  const apiUrl = '/api/questions/filtr';
  const questionUrl = '/api/questions';
  const questionRateUrl = '/api/questionrates';
  const weekUrl = '/api/questions/week';
  const questionName = 'questions-table';
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [params, setParams] = useState<Record<string, any>>({
    PageIndex: 1,
    PageSize: 5,
  });

  const deleteMutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.delete(`${questionUrl}/${data.id}`);
    },
    {
      onSuccess: (data) => {
        toast.success("Savol muvaffaqiyatli o'chirildi");
        queryClient.invalidateQueries();
      },
      onError: () => {
        toast.error('Xatolik yuz berdi');
      },
    }
  );

  const { data, isLoading, refetch } = useQuery([questionName], async () => {
    return await axiosinstance.get(apiUrl, { params });
  });

  const handleGoToRoute = (id: number) => {
    router.push(`${pathname}/question?id=${id}`);
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

  return (
    <>
      {isLoading ? (
        <div className='w-full h-full flex flex-col justify-start items-center overflow-x-auto p-5 gap-y-5'>
          <Loader />
        </div>
      ) : (
        <div className='min-w-[280px] w-full max-w-full 2xl:container h-full flex flex-col md:flex-row lg:flex-row flex-nowrap justify-start items-start py-12 px-5 md:px-10 lg:px-10 gap-5 scrollbar-none box-border overflow-y-scroll overflow-x-hidden scroll-smooth'>
          <div className='w-full h-full flex flex-col justify-start items-start gap-4 rounded-lg overflow-y-scroll scrollbar-none'>
            {data?.data?.data?.length > 0 ? (
              <>
                {data?.data?.data?.map((item: TObject, index: number) => {
                  return (
                    <button
                      key={index}
                      onClick={() => handleGoToRoute(item?.id)}
                      className={classNames(
                        'w-full h-fit min-h-min max-w-[1000px] flex flex-col md:flex-row lg:flex-row justify-start items-start rounded-lg bg-white cursor-pointer py-4 md:px-5 lg:px-5  overflow-hidden box-border '
                      )}>
                      <div className='w-full h-full flex flex-row justify-start items-start gap-5 text-sm md:text-md lg:text-lg box-border scale-90 md:scale-100 lg:scale-100'>
                        <div className='flex flex-row justify-center items-start w-fit'>
                          {item?.user?.imageUrl ? (
                            <Image
                              quality={100}
                              width={64}
                              height={64}
                              loading='eager'
                              src={`${process.env.NEXT_PUBLIC_URL}/${item?.user?.imageUrl}`}
                              className='w-12 h-12 md:w-14 lg:w-14 md:h-14 lg:h-14 rounded-full object-cover flex whitespace-nowrap box-border min-w-[44px] min-h-[44px]'
                              alt='forumUserImage'
                              blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                              placeholder='blur'
                            />
                          ) : (
                            <span className='w-12 h-12 md:w-14 lg:w-14 md:h-14 lg:h-14 box-border p-5 rounded-full flex whitespace-nowrap flex-1 min-w-[44px] min-h-[44px] justify-center items-center uppercase bg-blue-light text-blue'>
                              {(
                                item?.user?.firstName ||
                                item?.user?.lastName ||
                                item?.user?.email
                              )?.slice(0, 1)}
                            </span>
                          )}
                        </div>
                        <div className='w-max md:w-max lg:w-max flex flex-col flex-wrap justify-start items-start gap-2 break-words text-left box-border'>
                          <h1 className='w-full flex flex-wrap text-sm md:text-base lg:text-lg font-semibold text-left break-words'>
                            {item?.title}
                          </h1>
                          <div className='w-full h-max flex flex-row flex-wrap justify-start items-center gap-2 break-words whitespace-normal'>
                            <Link
                              href={`/dg-contest/users/user?id=${item?.user?.id}&tab=1`}
                              onClick={(e) => e.stopPropagation()}
                              className='text-purple underline font-semibold'>
                              {item?.user?.firstName ||
                                item?.user?.lastName ||
                                item?.user?.email}
                            </Link>
                            <p>{'·'}</p>
                            <p className=' text-sm md:text-md lg:text-md font-normal break-words text-gray-500 text-left'>
                              {compareDateAndGetLastSeen(item?.createdDate)}
                            </p>
                          </div>
                          <div className='w-full h-max flex flex-row flex-wrap justify-start items-start gap-2'>
                            {item?.tags?.map(
                              (tag: Record<string, any>, index: number) => {
                                return (
                                  <span
                                    className='py-2 px-3 bg-[#3d66adae] text-white rounded-lg text-sm md:text-base lg:text-lg whitespace-nowrap'
                                    key={index}>
                                    {tag?.name}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                        <div className='ml-auto flex flex-col justify-between gap-1 items-end font-semibold'>
                          <span className='flex flex-row justify-center items-center gap-2'>
                            <TrashIcon
                              width={20}
                              strokeWidth={2.5}
                              onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                                deleteMutation.mutate({ id: item?.id });
                              }}
                            />
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}

                <div className='w-full max-w-[1000px] flex justify-center items-center box-border'>
                  <Pagination
                    onChangePage={handleChangePage}
                    perPage={5}
                    totalCount={data?.data?.['length'] || 0}
                  />
                </div>
              </>
            ) : (
              <div className='w-full h-full flex justify-center items-center'>
                <h1 className='text-base md:text-base lg:text-lg'>
                  Mulohaza yo{"'"}q
                </h1>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
