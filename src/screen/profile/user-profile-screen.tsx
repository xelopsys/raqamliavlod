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
  LinkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Headers } from '@/components/table/headers';
import axiosinstance from '@/utility/axiosinstance';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { TObject } from '@/types';
import Link from 'next/link';
import useAuth from '@/hooks/use-auth';
import Image from 'next/image';
import Loader from '@/components/loader/profile-loading';
import {
  classNames,
  calculatePercent,
  translateWeekDays,
  handleCopy,
} from '@/helper';
import { DefineDifficultyType } from '../contest/problemset/problemset-screen';
import toast from 'react-hot-toast';
import { BookmarkIcon } from '@heroicons/react/24/solid';

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
  {
    tab: 3,
    name: '🎓 Tugallangan kurslar',
  },
  {
    tab: 4,
    name: '📃 Maqolalar',
  },
  {
    tab: 5,
    name: '❓️ Savollar',
  },
  {
    tab: 6,
    name: '🧩 Sertifikatlar',
  },
];

export default function UserIdScreen({ tab }: { tab: string }) {
  const apiUrl = '/api/problemsets';
  const userUrl = '/api/users/info/self';
  const finishedUrl = `/api/courses/user/finished`;
  const problemsetDayUrl = '/api/problemsets/submissions/days/self';
  const allAndRightUrl = '/api/problemsets/submissions/allandright/self';
  const rightYearUrl = '/api/problemsets/submissions/rightyear/self';
  const rightMonthUrl = '/api/problemsets/submissions/rightmonth/self';
  const maxEveryDayUrl = '/api/problemsets/submissions/maxeveryday';
  const maxEveryDayYearUrl = '/api/problemsets/submissions/maxeverydayyear';
  const maxEveryDayMonthUrl = '/api/problemsets/submissions/maxeverydaymonth';
  const userQuestionUrl = '/api/questions/user';
  const pinnedDocumentsUrl = '/api/pinneddocumentation';
  const pinnedContestsUrl = '/api/pinnedcontest';
  const pinnedProblemsetsUrl = '/api/pinnedproblemset';
  const certificateUrl = '/api/courses/certificates';
  const certificateName = 'user-certificate';
  const pinnedDocumentsName = 'user-pinned-documents';
  const pinnedContestsName = 'user-pinned-contests';
  const pinnedProblemsetsName = 'user-pinned-contests';
  const userQuestionName = 'user-questions';
  const queryName = 'problemsets';
  const finishedCourseName = 'finished-course';
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
  const queryClient = useQueryClient();
  const { user, isAuthenticated, login } = useAuth();

  const { data, isFetching } = useQuery(
    [queryName, user?.id],
    async () => {
      return await axiosinstance.get(apiUrl);
    },
    {
      keepPreviousData: true,
      staleTime: 10000,
    }
  );

  const { data: problemDay } = useQuery(
    [problemDayName, user?.id],
    async () => {
      return await axiosinstance.get(problemsetDayUrl);
    }
  );

  const { data: allAndRight } = useQuery([allAndRightName], async () => {
    return await axiosinstance.get(allAndRightUrl);
  });

  const { data: rightYear } = useQuery([rightYearName], async () => {
    return await axiosinstance.get(rightYearUrl);
  });

  const { data: rightMonth } = useQuery([rightMonthName], async () => {
    return await axiosinstance.get(rightMonthUrl);
  });

  const { data: maxEveryDay } = useQuery(
    [maxEveryDayName, user?.id],
    async () => {
      return await axiosinstance.get(`${maxEveryDayUrl}/${user?.id}`);
    }
  );

  const { data: maxEveryDayYear } = useQuery(
    [maxEveryDayYearName, user?.id],
    async () => {
      return await axiosinstance.get(`${maxEveryDayYearUrl}/${user?.id}`);
    }
  );

  const { data: maxEveryDayMonth } = useQuery(
    [maxEveryDayMonthName, user?.id],
    async () => {
      return await axiosinstance.get(`${maxEveryDayMonthUrl}/${user?.id}`);
    }
  );

  const { data: userQuestions } = useQuery(
    [userQuestionName, user?.id],
    async () => {
      return await axiosinstance.get(`${userQuestionUrl}/${user?.id}`, {
        params: { PageSize: 5 },
      });
    }
  );

  const { data: pinnedDocs } = useQuery(
    [pinnedDocumentsName, user?.id],
    async () => {
      return await axiosinstance.get(pinnedDocumentsUrl);
    }
  );

  const { data: pinnedProblems } = useQuery(
    [pinnedProblemsetsName, user?.id],
    async () => {
      return await axiosinstance.get(pinnedProblemsetsUrl);
    }
  );

  const { data: certificates } = useQuery(
    [certificateName, user?.id],
    async () => {
      return await axiosinstance.get(`${certificateUrl}/${user?.id}`);
    }
  );

  const { data: finishedCourse, isFetching: isFetchingFinished } = useQuery(
    [finishedCourseName, user?.id],
    async () => {
      return await axiosinstance.get(`${finishedUrl}/${user?.id}`);
    }
  );

  const {
    data: profile,
    isFetching: isFethingProfile,
    refetch,
  } = useQuery(
    [userName],
    async () => {
      return await axiosinstance.get(userUrl);
    },
    {
      keepPreviousData: true,
      staleTime: 10000,
    }
  );

  const deleteProblemSetMutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.delete(`${pinnedProblemsetsUrl}/${data?.id}`);
    },
    {
      onSuccess: () => {
        toast.success("Masala o'chirildi");
        queryClient.invalidateQueries();
      },
      onError: (error: Record<string, any>) => {
        if (error?.response?.status === 400) {
          toast.error('Xatolik yuz berdi');
        }
      },
    }
  );

  const deleteDocMutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.delete(`${pinnedDocumentsUrl}/${data?.id}`);
    },
    {
      onSuccess: () => {
        toast.success("Post o'chirildi");
        queryClient.invalidateQueries();
      },
      onError: (error: Record<string, any>) => {
        if (error?.response?.status === 400) {
          toast.error('Xatolik yuz berdi');
        }
      },
    }
  );

  const handleRemoveProblem = (id: number) => {
    deleteProblemSetMutation.mutate({ id });
  };

  const handleRemoveDoc = (id: number) => {
    deleteDocMutation.mutate({ id });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated]);

  useEffect(() => {}, [profile]);

  useEffect(() => {
    refetch();
    login({ ...profile?.data });
  }, []);
  return (
    <>
      {isFetching ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <div className='min-w-max w-full md:w-max lg:w-max h-max flex flex-col justify-start items-center gap-5'>
            <div className='w-full min-w-max flex flex-row flex-wrap justify-center items-center rounded-lg gap-4'>
              <div className='w-full h-max flex flex-col justify-start items-start gap-3'>
                <div className='w-full h-max flex flex-col md:flex-col lg:flex-col md:justify-start lg:justify-start md:items-start lg:items-start gap-3 justify-start items-start'>
                  <div className='w-full h-max flex flex-row md:flex-col lg:flex-col md:justify-start lg:justify-start md:items-start lg:items-start gap-3 justify-start items-start'>
                    {profile?.data?.image || user?.image ? (
                      <Image
                        width={700}
                        height={700}
                        quality={100}
                        loading='eager'
                        alt='profile'
                        placeholder='blur'
                        blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                        className='w-[80px] h-[80px] md:w-80 md:h-80 lg:min-w-[320px] lg:min-h-[320px] object-cover rounded-full border-2'
                        // src={`${process.env.NEXT_PUBLIC_URL}/${profile?.data?.image}`}
                        src={`${process.env.NEXT_PUBLIC_URL}${
                          profile?.data?.image || user?.image
                        }`}
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
                  <Link
                    href='/profile/edit'
                    className='w-full py-1 md:py-2 lg:py-2 px-3 rounded-lg border-2 border-purple bg-purple-light text-purple text-center'>
                    Profilni o{"'"}zgartirish
                  </Link>
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
            </div>
          </div>

          <div className='w-full max-w-[895px] h-full flex flex-col justify-start items-start gap-8 overflow-hidden  box-border'>
            <div className='w-full max-w-full h-max'>
              <div className='flex w-full max-w-full h-max overflow-x-scroll scrollbar-none gap-3 py-2'>
                {tabs.map((t, index) => (
                  <button
                    key={index}
                    aria-label='Go to page'
                    onClick={() => router.replace(`${path}?tab=${t.tab}`)}
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
                  <p className='text-base lg:text-lg'>{profile?.data?.bio}</p>
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
                                  key={index}
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
            {/* {tab === '2' && (
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
            )} */}

            {tab === '5' &&
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

            {tab === '2' &&
              (pinnedProblems?.data?.length > 0 ? (
                <div className='min-w-[280px] w-full h-max flex flex-row flex-wrap justify-start items-start gap-5 scrollbar-none box-border overflow-y-scroll'>
                  {pinnedProblems?.data?.map(
                    (item: Record<string, any>, index: number) => (
                      <Link
                        key={index}
                        href={`dg-contest/problemsets/problemset?id=${item?.id}`}
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
                              handleRemoveProblem(item?.id);
                            }}
                            className='flex flex-row justify-center items-center gap-1 disabled:opacity-20 disabled:cursor-not-allowed'>
                            <BookmarkIcon width={18} />
                          </button>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              ) : (
                'Hali masala saqlanmagan'
              ))}

            {tab === '3' && (
              <div className='min-w-[280px] w-full h-max flex flex-row flex-wrap justify-start items-start gap-5 scrollbar-none box-border overflow-y-scroll'>
                {finishedCourse?.data?.['length'] > 0
                  ? finishedCourse?.data?.data?.map(
                      (item: Record<string, any>, index: number) => {
                        return (
                          <div
                            key={index}
                            className='w-full sm:w-[344px] md:w-[344px] lg:w-[344px] h-[320px] rounded-xl bg-white flex flex-col justify-start items-center p-5 gap-2 box-border'>
                            <Image
                              quality={100}
                              width={320}
                              height={180}
                              loading='eager'
                              alt='course Image'
                              placeholder='blur'
                              blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                              className='w-[320px] h-[180px] object-cover rounded-lg'
                              src={`${process.env.NEXT_PUBLIC_URL}/${item?.imageUrl}`}
                            />
                            <section className='w-full flex flex-col justify-start items-start flex-wrap'>
                              <h1 className='text-base md:text-lg lg:text-xl font-semibold'>
                                {item?.title}
                              </h1>

                              <p className='text-base font-normal text-blue'>
                                {item?.author}
                              </p>
                            </section>
                            <p className='w-full text-left text-sm lg:text-base text-gray-400'>
                              {new Date(item?.createdDate)?.toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )}
                            </p>
                            <Link
                              href={`courses/course?id=${item?.id}&lesson=1`}
                              className={classNames(
                                'text-white py-2 px-3 text-center w-full rounded-lg flex justify-center items-center gap-2',
                                item?.progress === 'NotStarted'
                                  ? 'bg-blue hover:text-blue hover:border hover:border-blue'
                                  : item?.progress === 'Started'
                                  ? 'bg-green hover:text-green hover:border hover:border-green'
                                  : item?.progress === 'Finished'
                                  ? 'bg-purple'
                                  : ''
                              )}>
                              {item?.progress === 'NotStarted' ? (
                                "O'rganishni boshlash"
                              ) : item?.progress === 'Started' ? (
                                'Davom ettirish'
                              ) : item?.progress === 'Finished' ? (
                                <>
                                  <CheckIcon width={15} />
                                  Siz kursni yakunladingiz
                                </>
                              ) : (
                                ''
                              )}
                            </Link>
                          </div>
                        );
                      }
                    )
                  : 'Kurs mavjud emas'}
              </div>
            )}
            {tab === '4' &&
              (pinnedDocs?.data?.length > 0 ? (
                <div className='min-w-[280px] w-full h-max flex flex-row flex-wrap justify-start items-start gap-5 scrollbar-none box-border overflow-y-scroll'>
                  {pinnedDocs?.data?.map(
                    (item: Record<string, any>, index: number) => (
                      <Link
                        key={index}
                        href={`blog/post?id=${item?.id}`}
                        className={classNames(
                          'w-full rounded-md flex flex-col justify-start items-start bg-white break-words box-border',
                          item?.attachment?.path
                            ? 'min-h-max justify-start'
                            : 'min-h-[120px] justify-center'
                        )}>
                        <div
                          className={classNames(
                            'w-full px-7 py-6 flex flex-col justify-start items-start gap-y-3 break-words ',
                            item?.attachment?.path
                              ? 'min-h-max justify-start'
                              : 'min-h-[120px] justify-center'
                          )}>
                          <h1 className='text-lg md:text-2xl lg:text-[28px] font-semibold'>
                            {item.title}
                          </h1>
                          <p className='text-md md:text-lg lg:text-xl text-gray-500'>
                            {item.shortDescription || item?.text?.slice(0, 50)}
                            ...
                          </p>
                          <section className='mt-3 flex flex-row justify-between items-center gap-x-4 w-full text-gray-400'>
                            {/* <div className='flex items-center'>
                              <svg
                                aria-hidden='true'
                                className='w-5 h-5 text-yellow-400'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                                xmlns='http://www.w3.org/2000/svg'>
                                <title>Rating star</title>
                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                              </svg>
                              <p className='ml-2 text-sm font-bold text-gray-900'>
                                {item?.totalRating?.toFixed(1)}
                              </p>
                              <span className='w-1 h-1 mx-1.5 bg-gray-500 rounded-full'></span>
                              <a
                                href='#'
                                className='text-sm font-medium text-gray-400 whitespace-nowrap'>
                                {item?.numberOfRates} ta baholanish
                              </a>
                            </div> */}

                            {/* <span className='w-max flex flex-row justify-center items-center gap-x-1 group text-gray-400 hover:text-blue-500'>
                              <EyeIcon
                                width={20}
                                className='text-gray-300 group-hover:text-blue-500 cursor-pointer'
                                onClick={() => handleCopy(item?.id)}
                                title='Ko`rish soni'
                              />
                              {item?.views}
                            </span> */}
                            <section className='w-max flex flex-row justify-center items-center gap-3'>
                              <LinkIcon
                                width={20}
                                className='cursor-copy hover:text-gray-900'
                                onClick={(event) => {
                                  event.stopPropagation();
                                  event.preventDefault();
                                  handleCopy(item?.id);
                                }}
                                title='Nusxa olish'
                              />
                              <button
                                disabled={!isAuthenticated}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  event.preventDefault();
                                  handleRemoveDoc(item?.id);
                                }}
                                className='flex flex-row justify-center items-center gap-1 disabled:opacity-20 disabled:cursor-not-allowed'>
                                <BookmarkIcon width={18} />
                              </button>
                            </section>
                            {/* <p>{compareDateAndGetLastSeen(item?.createdDate)}</p> */}
                          </section>
                        </div>
                        {/* {item?.attachment && (
                          <div className='w-full h-64 flex justify-center items-center rounded-b-md'>
                            <Image
                              loading='eager'
                              src={`${process.env.NEXT_PUBLIC_URL}/${item?.attachment?.path}`}
                              className='w-full h-full object-cover rounded-b-md'
                              alt='post image'
                              width={800}
                              height={200}
                              quality={100}
                            />
                          </div>
                        )} */}
                      </Link>
                    )
                  )}
                </div>
              ) : (
                'Hali post saqlanmagan'
              ))}
            {tab === '6' &&
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
                          blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
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
