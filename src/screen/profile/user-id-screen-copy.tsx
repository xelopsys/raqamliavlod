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
import Image from 'next/image';
import Loader from '@/components/loader/profile-loading';
import { classNames, calculatePercent, translateWeekDays } from '@/helper';
import * as d3 from 'd3';

const tabs = [
  {
    tab: 1,
    name: '🚀 Bio',
    value: '',
  },
  // {
  //   tab: 2,
  //   name: '🏆 Musobaqalar',
  // },
  {
    tab: 2,
    name: '🎮 Masalalar',
  },
  // {
  //   tab: 3,
  //   name: '🎓 Tugallangan kurslar',
  // },
  // {
  //   tab: 4,
  //   name: '📃 Maqolalar',
  // },
  {
    tab: 3,
    name: '❓️ Savollar',
  },
  {
    tab: 4,
    name: '🧩 Sertifikatlar',
  },
];

export default function UserIdScreen({ tab, id }: { tab: string; id: string }) {
  const apiUrl = '/api/problemsets';
  const userUrl = '/api/users/info';
  const problemsetDayUrl = '/api/problemsets/submissions/days';
  const allAndRightUrl = '/api/problemsets/submissions/allandright';
  const rightYearUrl = '/api/problemsets/submissions/rightyear';
  const rightMonthUrl = '/api/problemsets/submissions/rightmonth';
  const maxEveryDayUrl = '/api/problemsets/submissions/maxeveryday';
  const maxEveryDayYearUrl = '/api/problemsets/submissions/maxeverydayyear';
  const maxEveryDayMonthUrl = '/api/problemsets/submissions/maxeverydaymonth';
  const userQuestionUrl = '/api/questions/user';
  const certificateUrl = '/api/courses/certificates';
  const certificateName = 'user-certificate';
  const userQuestionName = 'user-questions';
  const queryName = 'problemsets';
  const allAndRightName = 'all-and-right';
  const rightYearName = 'right-year';
  const rightMonthName = 'right-month';
  const maxEveryDayName = 'max-every-day';
  const maxEveryDayYearName = 'max-every-day-year';
  const maxEveryDayMonthName = 'max-every-day-month';
  const problemDayName = 'problemsets-day';
  const userName = 'profile';
  // const userName = 'users';
  const router = useRouter();
  const path = usePathname();
  const { user, isAuthenticated, login } = useAuth();

  const { data, isFetching } = useQuery(
    [queryName, id],
    async () => {
      return await axiosinstance.get(apiUrl);
    },
    {
      keepPreviousData: true,
      staleTime: 10000,
    }
  );

  const { data: problemDay } = useQuery([problemDayName, id], async () => {
    return await axiosinstance.get(`${problemsetDayUrl}/${id}`);
  });

  const { data: allAndRight } = useQuery([allAndRightName, id], async () => {
    return await axiosinstance.get(`${allAndRightUrl}/${id}`);
  });

  const { data: rightYear } = useQuery([rightYearName, id], async () => {
    return await axiosinstance.get(`${rightYearUrl}/${id}`);
  });

  const { data: rightMonth } = useQuery([rightMonthName, id], async () => {
    return await axiosinstance.get(`${rightMonthUrl}/${id}`);
  });

  const { data: maxEveryDay } = useQuery([maxEveryDayName, id], async () => {
    return await axiosinstance.get(`${maxEveryDayUrl}/${id}`);
  });

  const { data: maxEveryDayYear } = useQuery(
    [maxEveryDayYearName, id],
    async () => {
      return await axiosinstance.get(`${maxEveryDayYearUrl}/${id}`);
    }
  );

  const { data: maxEveryDayMonth } = useQuery(
    [maxEveryDayMonthName, id],
    async () => {
      return await axiosinstance.get(`${maxEveryDayMonthUrl}/${id}`);
    }
  );

  const { data: userQuestions } = useQuery([userQuestionName, id], async () => {
    return await axiosinstance.get(`${userQuestionUrl}/${id}`, {
      params: { PageSize: 5 },
    });
  });

  const { data: certificates } = useQuery([certificateName, id], async () => {
    return await axiosinstance.get(`${certificateUrl}/${id}`);
  });

  const {
    data: profile,
    isFetching: isFethingProfile,
    refetch,
  } = useQuery(
    [userName, id],
    async () => {
      return await axiosinstance.get(`${userUrl}/${id}`);
    },
    {
      keepPreviousData: true,
      staleTime: 10000,
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      {isFetching ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <div className='min-w-max w-full md:w-max lg:w-max min-h-fit h-max flex flex-col justify-start items-center gap-5'>
            <div className='w-full min-w-max flex flex-row flex-wrap justify-center items-center rounded-lg gap-4'>
              <div className='w-full h-max flex flex-col justify-start items-start gap-3'>
                <div className='w-full h-max flex flex-row md:flex-col lg:flex-col md:justify-start lg:justify-start md:items-start lg:items-start gap-3 justify-start items-start'>
                  {profile?.data?.image ? (
                    <Image
                      width={700}
                      height={700}
                      quality={100}
                      loading='eager'
                      placeholder='blur'
                      alt='profile'
                      blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                      className='w-[80px] h-[80px] md:w-80 md:h-80 lg:min-w-[320px] lg:min-h-[320px] object-cover rounded-full'
                      src={`${process.env.NEXT_PUBLIC_URL}${profile?.data?.image}`}
                    />
                  ) : (
                    <div className='w-[80px] h-[80px] md:w-80 md:h-80 lg:min-w-[320px] lg:min-h-[320px] flex bg-gray-200 justify-center items-center uppercase rounded-full border-2 text-3xl whitespace-nowrap'>
                      {profile?.data?.firstName?.slice(0, 1) || ''}
                      {profile?.data?.lastName?.slice(0, 1) || ''}
                    </div>
                  )}
                  <div className='w-2/3 h-full flex flex-col justify-start items-start gap-1 md:gap-2 lg:gap-3'>
                    <h1 className='text-xl font-semibold text-left w-full'>
                      {profile?.data?.firstName || ''}{' '}
                      {profile?.data?.lastName || profile?.data?.email || ''}
                    </h1>

                    <p className='text-lg font-normal text-left w-full'>
                      {profile?.data?.status}
                    </p>
                    <p className='text-base font-normal text-left w-full'>
                      {profile?.data?.username}
                    </p>
                  </div>
                </div>

                <hr className='w-full ' />

                {profile?.data?.country && (
                  <p className='text-gray-600 text-base whitespace-nowrap flex'>
                    📌 {profile?.data?.country}
                  </p>
                )}
                <p className='text-gray-600 text-base whitespace-nowrap flex'>
                  📨 {profile?.data?.email}
                </p>
                {profile?.data?.username && (
                  <p className='text-gray-600 text-base whitespace-nowrap flex gap-1'>
                    <Image
                      src='/telegram.svg'
                      alt='telegram'
                      width={15}
                      height={15}
                      quality={100}
                    />
                    @{profile?.data?.telegram}
                  </p>
                )}
              </div>
              {/* <div className='w-max h-max flex flex-row  justify-start items-start gap-4 px-4 pb-4'>
                <section className='flex flex-col justify-center items-center gap-3 text-center text-gray-500 text-sm md:text-base lg:text-lg'>
                  <h1 className='text-lg font-bold text-green'>
                    {profile?.data?.rightSubmissions}
                  </h1>
                  To{"'"}g{"'"}ri yechilganlar
                </section>
                <section className='flex flex-col justify-center items-center gap-3 text-center text-gray-500 text-sm md:text-base lg:text-lg'>
                  <h1 className='text-lg font-bold text-red-600'>
                    {profile?.data?.wrongSubmissions}
                  </h1>
                  Noto{"'"}g{"'"}ri yechilganlar
                </section>
              </div> */}
              {/* <div className='w-max h-max flex flex-row  justify-start items-start gap-4 px-4 pb-4'>
                <section className='flex flex-col justify-center items-center gap-3 text-center text-gray-500 text-sm md:text-base lg:text-lg'>
                  <h1 className=' text-lg font-bold text-blue-600'>
                    {profile?.data?.problemSetCoins}
                  </h1>
                  Masala ballari
                </section>
              </div> */}
            </div>
            {/* <div className='w-full md:w-1/3 lg:w-96 h-max flex flex-col justify-center items-start gap-5 bg-white rounded-lg p-5'>
              <div className='w-full h-full flex flex-col justify-start items-start py-4 gap-4'>
                <section className='w-full h-max flex flex-row justify-center items-center text-sm md:text-base lg:text-lg gap-2'>
                  O{"'"}rni
                  <span className='flex flex-row justify-center items-center gap-x-3 text-yellow-500'>
                    {profile?.data?.rank}
                  </span>
                </section>
                <section className='w-full h-max flex flex-row justify-center items-center text-sm md:text-base lg:text-lg gap-2'>
                  Ijobiy baholanishlari
                  <span className='flex flex-row justify-center items-center gap-x-3 text-yellow-500'>
                    {profile?.data?.likes}
                  </span>
                </section>
                <section className='w-full h-max flex flex-row justify-center items-center text-sm md:text-base lg:text-lg gap-2'>
                  Salbiy baholanishlari
                  <span className='flex flex-row justify-center items-center gap-x-3 text-yellow-500'>
                    {profile?.data?.disLikes}
                  </span>
                </section>
              </div>
              <div className='w-full h-full flex flex-row flex-wrap justify-evenly items-center gap-4 p-5'>
                <h1 className='w-full text-left flex flex-row justify-between items-center text-sm md:text-base lg:text-lg'>
                  Umumiy masalalar <p>{profile?.data?.totalSubmissions}</p>
                </h1>
                <h1 className='w-full text-left flex flex-row justify-between items-center text-sm md:text-base lg:text-lg'>
                  To{"'"}g{"'"}ri yechimlar{' '}
                  <p>{profile?.data?.rightSubmissions}</p>
                </h1>
                <section className='w-full h-3 bg-purple-light flex flex-col justify-start items-start text-md md:text-lg lg:text-lg rounded-lg'>
                  <span
                    className='flex w-full h-3 rounded-lg bg-purple flex-row justify-center items-center gap-x-3'
                    style={{
                      width: `${calculatePercent(
                        profile?.data.totalSubmissions as number,
                        profile?.data.rightSubmissions as number
                      )}%`,
                    }}
                  />
                </section>
              </div>
            </div> */}
          </div>

          <div className='w-full max-w-[895px] h-max flex flex-col justify-start items-start gap-8 overflow-hidden box-border'>
            <div className='w-full max-w-full h-max'>
              <div className='flex w-full max-w-full h-max overflow-x-scroll scrollbar-none gap-3 py-2'>
                {tabs.map((t, index) => (
                  <button
                    key={index}
                    aria-label='Go to page'
                    onClick={() =>
                      router.replace(`${path}?tab=${t.tab}&id=${id}`)
                    }
                    className={classNames(
                      'text-lg flex items-center justify-between px-6 py-2 text-left transition-all duration-100 ease-in hover:text-primary rounded-md border text-gray-500',
                      t.tab === Number(tab) ? 'bg-green text-white' : ''
                    )}>
                    <div className='flex gap-3 whitespace-nowrap'>{t.name}</div>
                  </button>
                ))}
              </div>
            </div>
            {tab === '1' && (
              <div className='min-w-[280px] w-full h-max flex flex-row flex-wrap justify-start items-start gap-5 scrollbar-none box-border overflow-y-scroll'>
                <div className='w-full h-fit flex flex-col flex-wrap justify-start items-start gap-3 bg-white rounded-lg p-3'>
                  <div className='w-full flex flex-row justify-between items-center'>
                    <h1 className='w-full text-base md:text-lg lg:text-lg font-bold'>
                      Bio
                    </h1>
                    <span className='w-max flex flex-row flex-nowrap justify-center items-center gap-4'>
                      <p>
                        {profile?.data?.rank === 1
                          ? '🥇'
                          : profile?.data?.rank === 2
                          ? '🥈'
                          : profile?.data?.rank === 3
                          ? '🥉'
                          : `#${profile?.data?.rank}`}
                      </p>
                      <p className='flex flex-row w-max'>
                        🔥 {allAndRight?.data?.allSubmissions}
                      </p>
                    </span>
                  </div>
                  <p>{profile?.data?.bio}</p>
                </div>
                <div className='w-full h-max min-h-max flex flex-col justify-start items-start gap-5 bg-white rounded-lg p-3'>
                  <div className='w-full h-max flex flex-row flex-wrap justify-between items-start px-5 gap-10'>
                    <section className='break-words whitespace-pre-wrap flex flex-col justify-start items-start w-1/5'>
                      <p className='text-base md:text-lg lg:text-xl font-semibold'>
                        🔥 {allAndRight?.data?.correctSubmissions || 0} masala
                      </p>
                      <p className='text-xs md:text-base lg:text-lg text-gray-400'>
                        har doim yechilgan
                      </p>
                    </section>
                    <section className='break-words whitespace-pre-wrap flex flex-col justify-start items-start w-1/5'>
                      <p className='text-base md:text-lg lg:text-xl font-semibold'>
                        🚀 {rightYear?.data || 0} masala
                      </p>
                      <p className='text-xs md:text-base lg:text-lg text-gray-400'>
                        oxirgi yilda yechilgan
                      </p>
                    </section>
                    <section className='break-words whitespace-pre-wrap flex flex-col justify-start items-start w-1/5'>
                      <p className='text-base md:text-lg lg:text-xl font-semibold'>
                        ⚡️ {rightMonth?.data || 0} masala
                      </p>
                      <p className='text-xs md:text-base lg:text-lg text-gray-400'>
                        oxirgi oyda yechilgan
                      </p>
                    </section>
                  </div>
                  <div className='w-full h-max flex flex-row flex-wrap justify-between items-start px-5 gap-10'>
                    <section className='break-words whitespace-pre-wrap flex flex-col justify-start items-start w-1/5'>
                      <p className='text-base md:text-lg lg:text-xl font-semibold'>
                        🏃🏻 {maxEveryDay?.data || 0} kun
                      </p>
                      <p className='text-xs md:text-base lg:text-lg text-gray-400'>
                        ketma-ket ishlangan
                      </p>
                    </section>
                    <section className='break-words whitespace-pre-wrap flex flex-col justify-start items-start w-1/5'>
                      <p className='text-base md:text-lg lg:text-xl font-semibold'>
                        📅 {maxEveryDayYear?.data || 0} kun
                      </p>
                      <p className='text-xs md:text-base lg:text-lg text-gray-400'>
                        oxirgi yilda ketma-ket
                      </p>
                    </section>
                    <section className='break-words whitespace-pre-wrap flex flex-col justify-start items-start w-1/5'>
                      <p className='text-base md:text-lg lg:text-xl font-semibold'>
                        🏆 {maxEveryDayMonth?.data || 0} kun
                      </p>
                      <p className='text-xs md:text-base lg:text-lg text-gray-400'>
                        oxirgi oyda ketma-ket
                      </p>
                    </section>
                  </div>
                </div>

                <div className='w-full h-max min-w-full flex flex-wrap  bg-white rounded-lg gap-2 overflow-hidden'>
                  <div className=' w-full h-full flex flex-wrap justify-start items-start rounded-lg p-3 gap-2 overflow-x-scroll scrollbar-thin'>
                    <div className='min-w-[840px] w-full flex flex-row justify-between items-center px-10'>
                      <h1 className='text-base'>
                        {`${new Date(
                          problemDay?.data?.[0]?.day
                        )?.toLocaleDateString('en-US', {
                          month: 'short',
                        })}`}
                      </h1>
                      <h1 className='text-base'>
                        {`${new Date(
                          problemDay?.data?.[
                            Math.ceil(problemDay?.data?.length / 2)
                          ]?.day
                        )?.toLocaleDateString('en-US', {
                          month: 'short',
                        })}`}
                      </h1>
                      <h1 className='text-base'>
                        {`${new Date(
                          problemDay?.data?.[problemDay?.data?.length - 1]?.day
                        )?.toLocaleDateString('en-US', {
                          month: 'short',
                        })}`}
                      </h1>
                    </div>
                    <div className='min-w-[840px] w-full flex flex-nowrap justify-start items-start gap-1'>
                      <div className='w-max h-full flex flex-col justify-between items-center gap-2'>
                        <h1 className='text-base'>
                          {`${translateWeekDays(
                            new Date(
                              problemDay?.data?.[0]?.day
                            )?.toLocaleDateString('en-US', {
                              weekday: 'long',
                            })
                          )?.slice(0, 4)}`}
                        </h1>
                        <h1 className='text-base'>
                          {`${translateWeekDays(
                            new Date(
                              problemDay?.data?.[
                                Math.ceil(problemDay?.data?.length / 2)
                              ]?.day
                            )?.toLocaleDateString('en-US', {
                              weekday: 'long',
                            })
                          )?.slice(0, 4)}`}
                        </h1>
                        <h1 className='text-base'>
                          {`${translateWeekDays(
                            new Date(
                              problemDay?.data?.[
                                problemDay?.data?.length - 1
                              ]?.day
                            )?.toLocaleDateString('en-US', {
                              weekday: 'long',
                            })
                          )?.slice(0, 4)}`}
                        </h1>
                      </div>
                      <div className='w-full flex flex-wrap justify-start items-start gap-1'>
                        {problemDay?.data?.map(
                          (problem: Record<string, any>, index: number) => {
                            return (
                              <>
                                <p
                                  title={`${new Date(
                                    problem?.day
                                  ).toLocaleDateString('en-US', {
                                    year: '2-digit',
                                    month: '2-digit',
                                    day: '2-digit',
                                  })}   ${problem?.submissions}ta`}
                                  className={classNames(
                                    'w-7 h-7 rounded-md cursor-context-menu',
                                    problem?.submissions > 0 &&
                                      problem?.submissions < 5
                                      ? 'bg-green-100'
                                      : problem?.submissions > 5 &&
                                        problem?.submissions < 10
                                      ? 'bg-green-200'
                                      : problem?.submissions > 10 &&
                                        problem?.submissions < 15
                                      ? 'bg-green-300'
                                      : problem?.submissions > 15 &&
                                        problem?.submissions < 20
                                      ? 'bg-green-400'
                                      : problem?.submissions > 25 &&
                                        problem?.submissions < 30
                                      ? 'bg-green-500'
                                      : problem?.submissions > 30 &&
                                        problem?.submissions < 35
                                      ? 'bg-green-600'
                                      : problem?.submissions > 35 &&
                                        problem?.submissions < 40
                                      ? 'bg-green-700'
                                      : problem?.submissions > 40 &&
                                        problem?.submissions < 45
                                      ? 'bg-green-800'
                                      : problem?.submissions > 45 &&
                                        problem?.submissions < 50
                                      ? 'bg-green-900'
                                      : 'bg-gray-200'
                                  )}
                                />
                              </>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {tab === '2' && (
              <div className='min-w-[280px] w-full h-max flex flex-row flex-wrap justify-start items-start gap-5 scrollbar-none box-border overflow-y-scroll'>
                <div className='w-full h-fit flex flex-row flex-wrap justify-start items-start gap-2 p-3 bg-white rounded-lg'>
                  <h1 className='w-full text-base md:text-lg lg:text-lg font-bold'>
                    Masalalar
                  </h1>
                  {user?.submissions?.map(
                    (submission: Record<string, any>, index: number) => {
                      let problem = data?.data?.data?.find(
                        (problem_: TObject) => {
                          return problem_?.id === submission?.problemSetId;
                        }
                      );
                      return (
                        <Link
                          key={index}
                          href={`/contests/problemsets/problemset?id=${submission?.problemSetId}`}
                          className={classNames(
                            'py-1 px-3 text-white rounded-md text-sm md:text-base lg:text-base',
                            submission?.isApproved
                              ? 'bg-green-500'
                              : 'bg-gray-500'
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
              </div>
            )}

            {tab === '3' &&
              (userQuestions?.data?.length > 0 ? (
                <div className='min-w-[280px] w-full h-max flex flex-row flex-wrap justify-start items-start gap-5 scrollbar-none box-border overflow-y-scroll'>
                  <div className='w-full h-fit flex flex-col flex-wrap justify-start items-start gap-3 bg-white rounded-lg p-3'>
                    <h1 className='w-full text-base md:text-lg lg:text-lg font-bold'>
                      Yuborilgan Savollar
                    </h1>
                    {userQuestions?.data?.data?.map(
                      (question: Record<string, any>, index: number) => {
                        return (
                          <Link
                            key={index}
                            href={`/forum/question?id=${question?.id}`}
                            className={classNames(
                              ' w-full flex flex-row justify-between items-center'
                            )}>
                            <div className='flex flex-row justify-center items-center gap-2 w-full box-border max-w-full overflow-hidden'>
                              <span
                                className={classNames(
                                  'py-1 px-3 rounded-md text-white text-base bg-gray-500'
                                )}>
                                {question?.id}
                              </span>
                              <h1 className='text-base md:text-md lg:text-lg truncate w-full max-w-[90%] break-words'>
                                {question?.title}
                              </h1>
                            </div>
                            <p className='text-sm lg:text-lg whitespace-nowrap'>
                              {new Date(
                                question?.createdDate
                              )?.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </Link>
                        );
                      }
                    )}
                  </div>
                </div>
              ) : (
                'Foydalanuvchi hali savol bermagan'
              ))}

            {tab === '4' &&
              (certificates?.data?.length > 0 ? (
                <div className='min-w-[280px] w-full h-max flex flex-row flex-wrap justify-start items-start gap-5 scrollbar-none box-border overflow-y-scroll'>
                  {certificates?.data?.map(
                    (certificate: Record<string, any>, index: number) => {
                      return (
                        <Image
                          key={index}
                          src={`${process.env.NEXT_PUBLIC_URL}/${certificate?.attachment?.path}`}
                          alt='certificate'
                          width='400'
                          height='200'
                          className='w-full h-max object-contain'
                          loading='eager'
                          quality={100}
                        />
                      );
                    }
                  )}
                </div>
              ) : (
                'Sertifikatlar mavjud emas'
              ))}
          </div>
        </>
      )}
    </>
  );
}
