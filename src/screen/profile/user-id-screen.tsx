'use client';

import React, { useEffect, useState, useCallback } from 'react';
import PaginatedTable from '@/components/table/paginated-table';
import {
  TrophyIcon,
  StarIcon,
  PresentationChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { Headers } from '@/components/table/headers';
import axiosinstance from '@/utility/axiosinstance';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { TObject } from '@/types';
import Link from 'next/link';
import useAuth from '@/hooks/use-auth';
import { classNames, calculatePercent } from '@/helper';
import Image from 'next/image';
import Loader from '@/components/loader/profile-loading';

export default function UserIdScreen({ id }: { id: string }) {
  const apiUrl = '/api/problemsets';
  const userUrl = `/api/users/info/${id}`;
  const queryName = 'problemsets';
  const userName = 'users';
  const router = useRouter();

  const { data: user, isFetching } = useQuery(
    [userName, id],
    async () => {
      return await axiosinstance.get(userUrl);
    },
    {
      keepPreviousData: true,
      staleTime: 10000,
    }
  );

  const { data, isFetching: isFetchingProblem } = useQuery(
    [queryName, id],
    async () => {
      return await axiosinstance.get(apiUrl);
    },
    {
      keepPreviousData: true,
      staleTime: 10000,
    }
  );

  return (
    <>
      {isFetching ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <div className='w-full min-h-fit h-max flex flex-col md:flex-row lg:flex-row justify-start items-start gap-5 scrollbar-none'>
            <div className='w-full md:w-80 lg:w-80 h-max flex flex-row flex-wrap justify-center items-center bg-white rounded-lg gap-4 p-5'>
              <div className='w-full h-max flex flex-col justify-start items-center gap-4'>
                {user?.data?.image ? (
                  <Image
                    width={200}
                    height={200}
                    quality={100}
                    loading='eager'
                    alt='profile'
                    className='w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-full'
                    src={
                      `${process.env.NEXT_PUBLIC_URL}${user?.data?.image}` || ''
                    }
                  />
                ) : (
                  <div className='w-24 h-24 lg:w-32 lg:h-32 flex bg-gray-100 justify-center items-center uppercase rounded-full'>
                    {user?.data?.firstName?.[0] || ''}
                    {user?.data?.lastName?.[0] || ''}
                  </div>
                )}
                <h1 className='text-xl font-semibold text-center'>
                  {user?.data?.firstName || ''}{' '}
                  {user?.data?.lastName || user?.data?.email || ''}
                </h1>
                <p className='text-base font-normal text-center'>
                  {user?.data?.username}
                </p>
              </div>
              <div className='w-max h-max flex flex-row  justify-start items-start gap-4 px-4 pb-4'>
                <section className='flex flex-col justify-center items-center gap-3 text-center text-gray-500 text-sm md:text-base lg:text-lg'>
                  <h1 className='text-sm md:text-base lg:text-lg font-bold text-green'>
                    {user?.data?.rightSubmissions}
                  </h1>
                  To{"'"}g{"'"}ri yechilganlar
                </section>
                <section className='flex flex-col justify-center items-center gap-3 text-center text-gray-500 text-sm md:text-base lg:text-lg'>
                  <h1 className='text-sm md:text-base lg:text-lg font-bold text-red-600'>
                    {user?.data?.wrongSubmissions}
                  </h1>
                  Noto{"'"}g{"'"}ri yechilganlar
                </section>
              </div>
              <div className='w-max h-max flex flex-row  justify-start items-start gap-4 px-4 pb-4'>
                <section className='flex flex-col justify-center items-center gap-3 text-center text-gray-500 text-sm md:text-base lg:text-lg'>
                  <h1 className='text-sm md:text-base lg:text-lg font-bold text-blue-600'>
                    {user?.data?.problemSetCoins}
                  </h1>
                  Masala ballari
                </section>
              </div>
            </div>
            <div className='w-full md:w-1/3 lg:w-96 h-max flex flex-col justify-center items-start gap-5 bg-white rounded-lg'>
              <div className='w-full h-full flex flex-col justify-start items-start py-4 gap-4'>
                <section className='w-full h-max flex flex-row justify-center items-center text-sm md:text-base lg:text-lg gap-2'>
                  O{"'"}rni
                  <span className='flex flex-row justify-center items-center gap-x-3 text-yellow-500'>
                    {user?.data?.rank}
                  </span>
                </section>
                <section className='w-full h-max flex flex-row justify-center items-center text-sm md:text-base lg:text-lg gap-2'>
                  Ijobiy baholanishlari
                  <span className='flex flex-row justify-center items-center gap-x-3 text-yellow-500'>
                    {user?.data?.likes}
                  </span>
                </section>
                <section className='w-full h-max flex flex-row justify-center items-center text-md text-sm md:text-base lg:text-lg gap-2'>
                  Salbiy baholanishlari
                  <span className='flex flex-row justify-center items-center gap-x-3 text-yellow-500'>
                    {user?.data?.disLikes}
                  </span>
                </section>
              </div>
              <div className='w-full h-full flex flex-row flex-wrap justify-evenly items-center gap-4 p-5'>
                <h1 className='w-full text-left flex flex-row justify-between items-center text-sm md:text-base lg:text-lg'>
                  Umumiy masalalar <p>{user?.data?.totalSubmissions}</p>
                </h1>
                <h1 className='w-full text-left flex flex-row justify-between items-center text-sm md:text-base lg:text-lg'>
                  To{"'"}g{"'"}ri yechimlar{' '}
                  <p>{user?.data?.rightSubmissions}</p>
                </h1>
                <section className='w-full h-3 bg-purple-light flex flex-col justify-start items-start text-md md:text-lg lg:text-lg rounded-lg'>
                  <span
                    className='flex w-full h-3 rounded-lg bg-purple flex-row justify-center items-center gap-x-3'
                    style={{
                      width: `${calculatePercent(
                        user?.data?.totalSubmissions as number,
                        user?.data?.rightSubmissions as number
                      )}%`,
                    }}
                  />
                </section>
              </div>
            </div>
          </div>
          <div className='w-full h-max flex flex-col md:flex-row lg:flex-row justify-center items-start gap-8'>
            {user?.data?.questions?.data?.length > 0 && (
              <div className='w-full h-fit flex flex-col flex-wrap justify-start items-start gap-3 bg-white rounded-lg p-3'>
                <h1 className='w-full text-base md:text-lg lg:text-lg font-bold'>
                  Yuborilgan Savollar
                </h1>
                {user?.data?.questions?.data
                  ?.slice(0, 5)
                  ?.map((question: Record<string, any>, index: number) => {
                    return (
                      <Link
                        key={index}
                        href={`/forum/question?id=${question?.id}`}
                        className={classNames(
                          ' w-full flex flex-row justify-between items-center'
                        )}>
                        <div className='flex flex-row justify-center items-center gap-2'>
                          <span
                            className={classNames(
                              'py-1 px-3 rounded-md text-white text-base',
                              question?.hasFoundAnswer
                                ? 'bg-green-500'
                                : 'bg-gray-500'
                            )}>
                            {question?.id}
                          </span>
                          <h1 className='text-base md:text-md lg:text-lg'>
                            {question?.title}
                          </h1>
                        </div>
                        <p className='text-base lg:text-lg'>
                          {new Date(question?.createdDate)?.toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </p>
                      </Link>
                    );
                  })}
              </div>
            )}
            {user?.data?.questions?.data?.length > 0 && (
              <div className='w-full h-fit flex flex-col flex-wrap justify-start items-start gap-3 bg-white rounded-lg p-3'>
                <h1 className='w-full text-base md:text-lg lg:text-lg font-bold'>
                  Yuborilgan Javoblar
                </h1>
                {user?.data?.answers?.data
                  ?.slice(0, 5)
                  ?.map((question: Record<string, any>, index: number) => {
                    return (
                      <Link
                        key={index}
                        href={`/forum/question?id=${question?.id}`}
                        className={classNames(
                          ' w-full flex flex-row justify-between items-center'
                        )}>
                        <div className='flex flex-row justify-center items-center gap-2'>
                          <span
                            className={classNames(
                              'py-1 px-3 rounded-md text-white text-base bg-green-500'
                            )}>
                            {question?.id}
                          </span>
                          <h1 className='text-base md:text-md lg:text-lg'>
                            {question?.text?.slice(0, 40)}...
                          </h1>
                        </div>
                        <p className='text-base lg:text-lg'>
                          {new Date(question?.createdDate)?.toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </p>
                      </Link>
                    );
                  })}
                {/* <div className="w-full flex flex-row flex-wrap justify-start items-center gap-x-10">
					<section className="flex flex-row justify-start items-center gap-x-2">
						<span className="bg-gray-500 rounded-xl w-6 h-2 "></span>
						Yuborilmagan yoki noto{"`"}g{"`"}ri
					</section>
					<section className="flex flex-row justify-start items-center gap-x-2">
						<span className="bg-green-500 rounded-xl w-6 h-2 "></span>
						Yuborilgan va to{"'"}g{"'"}ri
					</section>
				</div> */}
              </div>
            )}
          </div>

          <div className='w-full h-fit flex flex-row flex-wrap justify-start items-start gap-2 p-3 bg-white rounded-lg'>
            <h1 className='w-full text-base md:text-lg lg:text-lg font-bold'>
              Masalalar
            </h1>
            {user?.data?.submissions?.map(
              (submission: Record<string, any>, index: number) => {
                let problem = data?.data?.data?.find((problem_: TObject) => {
                  return problem_?.id === submission?.problemSetId;
                });
                return (
                  <Link
                    key={index}
                    href={`/contests/problemsets/problemset?id=${submission?.problemSetId}`}
                    className={classNames(
                      'py-1 px-3 text-white rounded-md text-sm md:text-base lg:text-base',
                      submission?.isApproved ? 'bg-green-500' : 'bg-gray-500'
                    )}>
                    {problem?.name?.length > 10
                      ? `${problem?.name.slice(0, 10)}...`
                      : problem?.name || submission?.problemSetId}
                  </Link>
                );
              }
            )}
            <div className='w-full flex flex-row flex-wrap justify-start items-center gap-x-10'>
              <section className='flex flex-row justify-start items-center gap-x-2 text-sm md:text-base lg:text-lg'>
                <span className='bg-gray-500 rounded-xl w-6 h-2 '></span>
                Yuborilmagan yoki noto{'`'}g{'`'}ri
              </section>
              <section className='flex flex-row justify-start items-center gap-x-2 text-sm md:text-base lg:text-lg'>
                <span className='bg-green-500 rounded-xl w-6 h-2 '></span>
                Yuborilgan va to{"'"}g{"'"}ri
              </section>
            </div>
          </div>
        </>
      )}
    </>
  );
}
