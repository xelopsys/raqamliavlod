'use client';

import React, { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import { useRouter, usePathname } from 'next/navigation';
import { TObject } from '@/types';
import Image from 'next/image';
import {
  EyeIcon,
  CheckIcon,
  ArrowUpCircleIcon,
  ChatBubbleBottomCenterTextIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { classNames, compareDateAndGetLastSeen } from '@/helper';
import useAuth from '@/hooks/use-auth';
import Loader from '@/components/loader/loading';
import useDrag from '@/hooks/use-drag';

export default function HomeScreen() {
  const apiUrl = '/api/home';
  const questionRateUrl = '/api/questionrates';
  const mostProblemUrl = '/api/problemsets/most/submissions';
  const newsUrl = '/api/news';
  const courseUrl = '/api/courses/recent';
  const newsName = 'news';
  const queryName = 'home-screen';
  const recentCoursesName = 'courses-new';
  const problemName = 'most-problem';
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const newSliderRef = useRef<HTMLDivElement>(null);
  const probSliderRef = useRef<HTMLDivElement>(null);
  const userSliderRef = useRef<HTMLDivElement>(null);
  const { handleDrag, handleDragStart, handleDragEnd } = useDrag({ sliderRef });
  const {
    handleDrag: handleDragNew,
    handleDragStart: handleDragStartNew,
    handleDragEnd: handleDragEndNew,
  } = useDrag({ sliderRef: newSliderRef });
  const {
    handleDrag: handleDragProb,
    handleDragStart: handleDragStartProb,
    handleDragEnd: handleDragEndProb,
  } = useDrag({ sliderRef: probSliderRef });

  const {
    handleDrag: handleDragUser,
    handleDragStart: handleDragStartUser,
    handleDragEnd: handleDragEndUser,
  } = useDrag({ sliderRef: userSliderRef });

  const { data, isLoading, refetch } = useQuery(
    [queryName],
    async () => {
      return await axiosinstance.get(apiUrl);
    },
    {
      keepPreviousData: true,
      staleTime: 10000,
    }
  );
  const { data: courses, isFetching } = useQuery(
    [recentCoursesName],
    async () => {
      return await axiosinstance.get(courseUrl, { params: { PageSize: 5 } });
    }
  );

  const questionRateMutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.post(questionRateUrl, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast.success('Ovoz berildi');
      },
      onError: (error: Error | any) => {
        toast.error(
          error?.response?.data?.error?.Message ||
            error?.message ||
            'Xatolik yuz berdi'
        );
      },
    }
  );

  const {
    data: news,
    isFetching: isFetchingNews,
    refetch: refetchNews,
  } = useQuery([newsName], async () => {
    return await axiosinstance.get(newsUrl, {
      params: { PageSize: 5, PageIndex: 1 },
    });
  });

  const viewMutation = useMutation((id: number) => {
    return axiosinstance.post(`/api/questions/${id}/views`);
  });

  const handleRateQues = (id: number, isLiked: boolean) => {
    questionRateMutation.mutate({
      questionId: id,
      isLiked: isLiked,
    });
  };

  const handleGoToRoute = (id: number) => {
    viewMutation.mutate(id);
    router.push(`${pathname}/questions/question?id=${id}`);
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className='w-full h-full flex flex-col justify-center items-center overflow-x-auto'>
          <Loader />
        </div>
      ) : (
        <>
          <div className='w-full min-h-max flex flex-col justify-start items-start gap-5'>
            <h1 className='text-lg md:text-xl lg:text-2xl font-semibold'>
              Dolzarb yangiliklar
            </h1>
            <div
              ref={newSliderRef}
              onMouseDown={handleDragStartNew}
              onMouseUp={handleDragEndNew}
              onMouseMove={handleDragNew}
              className='w-full h-max flex flex-row justify-start items-start gap-3 overflow-x-scroll scrollbar-none'>
              <div className='w-full h-max flex flex-row justify-start items-start gap-5 scrollbar-none box-border overflow-x-auto'>
                {news?.data?.map((item: Record<string, any>, index: number) => {
                  return (
                    <a
                      key={index}
                      href={item?.link}
                      className='min-w-[524px] w-[524px] min-h-[248px]  max-h-20 flex flex-row justify-end items-end gap-2 rounded-3xl cursor-pointer relative box-border overflow-hidden'>
                      <Image
                        width={600}
                        height={200}
                        alt='banner'
                        placeholder='blur'
                        blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                        quality={100}
                        className='w-full h-full object-cover brightness-50'
                        src={`${process.env.NEXT_PUBLIC_URL}/${item?.banner?.path}`}
                      />
                      <span className='w-full flex flex-col z-20 text-white absolute p-5'>
                        {/* <h1 className='text-lg md:text-xl lg:text-xl'>
                          {item?.title}
                        </h1> */}
                        <p className='text-base lg:text-lg xl:text-xl break-words w-full font-semibold truncate'>
                          {item?.title || item?.description}
                        </p>
                        <span className='w-full flex flex-row justify-start items-center gap-2 text-gray-400'>
                          <CalendarDaysIcon width={18} />
                          <p className='text-base lg:text-lg'>{`${new Date(
                            item?.banner?.createdDate
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}`}</p>
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          <div className='w-full flex flex-col justify-start items-start gap-5 '>
            <div className='w-full flex flex-row justify-start items-center'>
              <h1 className='text-lg md:text-xl lg:text-2xl font-semibold'>
                Yangi kurslar
              </h1>
            </div>
            <div
              ref={sliderRef}
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onMouseMove={handleDrag}
              className='w-full h-max flex flex-row justify-start items-start gap-3 overflow-x-scroll scrollbar-none'>
              <div className='w-full h-max flex flex-row justify-start items-start gap-5 scrollbar-none box-border overflow-x-auto'>
                {courses?.data?.map(
                  (item: Record<string, any>, index: number) => (
                    <div
                      key={index}
                      className='w-full min-w-[344px] md:w-[344px] lg:w-[344px] h-[320px] rounded-xl bg-white flex flex-col justify-start items-center p-5 gap-2 box-border'>
                      <Image
                        quality={100}
                        width={320}
                        height={200}
                        loading='eager'
                        alt='course Image'
                        blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                        placeholder='blur'
                        className='w-full h-48 object-cover rounded-lg'
                        src={`${process.env.NEXT_PUBLIC_URL}/${item?.imageUrl}`}
                      />
                      <section className='w-full flex flex-col justify-start items-start flex-wrap '>
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
                        href={`/courses/course?id=${item?.id}&lesson=1`}
                        className={classNames(
                          'text-white py-2 px-3 text-center w-full rounded-lg flex justify-center items-center bg-blue mt-4',
                          item?.progress === 'NotStarted'
                            ? 'bg-blue'
                            : item?.progress === 'Started'
                            ? 'bg-green'
                            : item?.progress === 'Finished'
                            ? 'bg-purple'
                            : 'bg-blue'
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
                          "O'rganishni boshlash"
                        )}
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className='w-full flex flex-row justify-end items-center'>
              <Link href={`/courses`}>
                <button className='min-w-[160px] rounded-md bg-white  p-3 text-center flex flex-row justify-center items-center  whitespace-nowrap gap-2'>
                  <h1 className='text-sm md:text-md lg:text-lg font-semibold flex'>
                    Barchasini ko{"'"}rish
                  </h1>
                  <ArrowRightIcon width={15} />
                </button>
              </Link>
            </div>
          </div>
          {/* <div className='w-full h-max flex flex-col justify-start items-start gap-5'>
            <div className='w-full h-max flex flex-col justify-start items-start gap-3 p-6 bg-white rounded-lg'>
              <h1 className='w-full text-lg md:text-xl lg:text-2xl font-semibold flex'>
                So{"'"}ngi tadbirlar
              </h1>
              <div className='w-full h-max flex flex-col justify-start items-start gap-5'>
                <div className='w-full h-max md:h-36 lg:h-40 flex flex-row justify-start items-center'>
                  <Image
                    quality={100}
                    width={286}
                    height={120}
                    src={`${process.env.NEXT_PUBLIC_URL}${data?.data?.data?.mainImageUrl}`}
                    className='w-full h-full object-cover content-center rounded-lg'
                    alt='home image'
                  />
                </div>
                <div className='w-full h-full break-words flex flex-col justify-start md:justify-start lg:justify-start items-center'>
                  <h1 className='text-base md:text-lg lg:text-xl font-normal'>
                    {data?.data?.data?.description}
                  </h1>
                </div>
                <div className='w-full flex flex-row justify-center items-center'>
                  <button className='w-full rounded-md border border-purple-300 text-purple py-1 px-3 text-center flex justify-center items-center hover:bg-purple hover:text-white'>
                    <Link href={`/contests`}>
                      <h1 className='text-sm md:text-md lg:text-lg font-semibold flex'>
                        Ro{"'"}yxatdan o{"'"}tish
                      </h1>
                    </Link>
                  </button>
                </div>
              </div>
            </div>
            <div className='w-full h-max flex flex-col justify-start items-start gap-5 p-6 bg-white rounded-lg'>
              <h1 className='text-lg md:text-xl lg:text-2xl font-semibold'>
                Oxirgi berilgan savollar
              </h1>
              {data?.data?.lastCreatedQuestion?.map(
                (item: TObject, index: number) => (
                  <Link
                    key={index}
                    href={`/forum/question?id=${item?.id}`}
                    className='w-full h-max flex flex-row justify-between items-center gap-x-3 p-2 hover:bg-blue-light hover:cursor-pointer'>
                    <div className='w-full flex flex-row justify-start items-start gap-2'>
                      <div className='break-words flex flex-col justify-start items-start '>
                        <h1 className='text-sm md:text-md lg:text-lg font-normal flex'>
                          {item?.title}
                        </h1>
                        <p className='w-full text-xs md:text-sm lg:text-md font-normal flex flex-wrap text-gray-500 break-words'>
                          {compareDateAndGetLastSeen(item?.createdDate)}
                        </p>
                      </div>
                    </div>
                    <h1 className='text-sm md:text-md lg:text-md font-semibold'>
                      <span className='w-max flex flex-col justify-center items-center gap-x-1 text-blue'>
                        <HandThumbUpIcon
                          width={25}
                          className='cursor-pointer'
                          title='Ko`rish soni'
                        />
                        {item?.likes}
                      </span>
                    </h1>
                  </Link>
                )
              )}
              <div className='w-full flex flex-row justify-center items-center'>
                <button className='w-full rounded-md border border-blue-300 text-blue py-1 px-3 text-center flex justify-center items-center bg-blue-light hover:bg-blue hover:text-white'>
                  <Link href={`/forum`}>
                    <h1 className='text-sm md:text-md lg:text-lg font-semibold flex'>
                      Batafsil ko{"'"}rish
                    </h1>
                  </Link>
                </button>
              </div>
            </div>
          </div> */}
          <div className='w-full h-max flex flex-col justify-start items-start gap-5'>
            {data?.data?.mostProblemAcceptedUsers?.length > 0 && (
              <>
                <div className='w-full flex flex-row justify-start items-center'>
                  <h1 className='text-lg md:text-xl lg:text-2xl font-semibold'>
                    Eng ko{"'"}p yechilgan masalalar
                  </h1>
                </div>
                <div
                  ref={probSliderRef}
                  onMouseDown={handleDragStartProb}
                  onMouseUp={handleDragEndProb}
                  onMouseMove={handleDragProb}
                  className='w-full h-max flex flex-row justify-start items-start gap-3 overflow-x-scroll scrollbar-none'>
                  <div className='w-full h-max flex flex-row justify-start items-start gap-5 scrollbar-none box-border overflow-x-auto'>
                    {data?.data?.mostSubmitedProblem?.data?.map(
                      (item: TObject, index: number) => (
                        <Link
                          key={index}
                          href={`/dg-contest/problemsets/problemset?id=${item?.problemSet?.id}`}
                          className='w-[286px] min-w-[286px] h-full flex flex-row justify-start items-start gap-x-4 px-3 py-3 hover:bg-purple-light hover:cursor-pointer bg-white rounded-xl'>
                          <div className='w-max h-full flex justify-center items-center'>
                            <span className='w-10 h-10 flex justify-center items-center rounded-full text-purple bg-purple-light'>
                              {index + 1}
                            </span>
                          </div>
                          <div className='w-fit h-full flex flex-col justify-evenly items-start'>
                            <h1 className='text-sm md:text-md lg:text-lg font-semibold flex'>
                              {item?.problemSet?.name}
                            </h1>
                            <p className='text-gray-400 text-sm lg:text-base'>
                              {new Date(
                                item?.problemSet?.createdDate
                              ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                            <h1 className='text-sm md:text-md lg:text-md font-semibold flex gap-1 text-purple'>
                              {item?.numberOfSubmissions}
                              <p className='!font-normal'>topshirishlar</p>
                            </h1>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                </div>
                <div className='w-full flex flex-row justify-end items-center'>
                  <Link href={`/dg-contest/problemsets`}>
                    <button className='min-w-[160px] rounded-md bg-white  p-3 text-center flex flex-row justify-center items-center  whitespace-nowrap gap-2'>
                      <h1 className='text-sm md:text-md lg:text-lg font-semibold flex'>
                        Barchasini ko{"'"}rish
                      </h1>
                      <ArrowRightIcon width={15} />
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className='w-full h-max flex flex-col justify-start items-start gap-4 rounded-lg'>
            {data?.data?.lastCreatedQuestion?.length > 0 && (
              <>
                <div className='w-full flex flex-row justify-start items-center'>
                  <h1 className='text-lg md:text-xl lg:text-2xl font-semibold'>
                    Oxirgi savollar
                  </h1>
                </div>
                {data?.data?.lastCreatedQuestion?.map(
                  (item: TObject, index: number) => {
                    return (
                      <Link
                        href={`/forum/question?id=${item?.id}`}
                        key={index}
                        onClick={() => handleGoToRoute(item?.id)}
                        className={classNames(
                          'w-full max-w-[1296px] h-max flex flex-col md:flex-row lg:flex-row justify-start items-start rounded-lg bg-white cursor-pointer py-4 px-0 md:px-5 lg:px-5 whitespace-nowrap overflow-hidden'
                        )}>
                        <div className='w-full h-full flex flex-row justify-start items-start gap-5 text-sm md:text-md lg:text-lg whitespace-nowrap box-border scale-90 md:scale-100 lg:scale-100'>
                          <div className='flex flex-row justify-center items-start w-fit'>
                            {item?.user?.imageUrl ? (
                              <Image
                                quality={100}
                                width={64}
                                height={64}
                                loading='eager'
                                placeholder='blur'
                                blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                                src={`${process.env.NEXT_PUBLIC_URL}/${item?.user?.imageUrl}`}
                                className='w-12 h-12 md:w-14 lg:w-14 md:h-14 lg:h-14 rounded-full object-cover flex whitespace-nowrap flex-1 box-border min-w-[44px] min-h-[44px]'
                                alt='forumUserImage'
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
                          <div className='w-full md:w-max lg:w-max flex flex-col flex-wrap justify-start items-start gap-2 break-words text-left box-border'>
                            <h1 className='w-max text-sm md:text-base lg:text-lg font-semibold'>
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
                            <button
                              disabled={!isAuthenticated}
                              onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                                handleRateQues(item?.id, true);
                              }}
                              className='flex flex-row justify-center items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed text-purple'>
                              {Number(item?.likes) - Number(item?.disLikes)}
                              {/* <ArrowUpCircleIcon
                                width={20}
                                strokeWidth={2.5}
                              /> */}
                              <span>🙂</span>
                            </button>
                            <span className='flex flex-row justify-center items-center gap-2'>
                              {item?.numberOfAnswers}
                              <ChatBubbleBottomCenterTextIcon
                                width={20}
                                strokeWidth={2.5}
                              />
                            </span>
                            <span className='flex flex-row justify-center items-center gap-2'>
                              {item?.viewCount}
                              <EyeIcon
                                width={20}
                                strokeWidth={2.5}
                              />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                )}
                <div className='w-full flex flex-row justify-end items-center'>
                  <Link href={`/forum`}>
                    <button className='min-w-[160px] rounded-md bg-white  p-3 text-center flex flex-row justify-center items-center  whitespace-nowrap gap-2'>
                      <h1 className='text-sm md:text-md lg:text-lg font-semibold flex'>
                        Barchasini ko{"'"}rish
                      </h1>
                      <ArrowRightIcon width={15} />
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className='w-full h-max flex flex-col justify-start items-start gap-5'>
            {data?.data?.mostProblemAcceptedUsers?.length > 0 && (
              <>
                <div className='w-full flex flex-row justify-start items-center'>
                  <h1 className='text-lg md:text-xl lg:text-2xl font-semibold'>
                    Ko{"'"}p to{"'"}g{"'"}ri masala yechganlar
                  </h1>
                </div>
                <div
                  ref={userSliderRef}
                  onMouseDown={handleDragStartUser}
                  onMouseUp={handleDragEndUser}
                  onMouseMove={handleDragUser}
                  className='w-full h-max flex flex-row justify-start items-start gap-5 scrollbar-none box-border overflow-x-scroll scroll-smooth'>
                  <div className='w-full h-max flex flex-row justify-start items-start gap-5 scrollbar-none box-border overflow-x-auto'>
                    {data?.data?.mostProblemAcceptedUsers?.data?.map(
                      (item: TObject, index: number) => (
                        <Link
                          key={index}
                          href={`/dg-contest/users/user?id=${item?.user?.id}&tab=1`}
                          className='min-w-[220px] h-max flex flex-col justify-center items-center gap-4 hover:bg-green-light hover:cursor-pointer bg-white rounded-xl py-5'>
                          <div className='flex flex-row justify-center items-start w-fit'>
                            {item?.user?.imageUrl ? (
                              <Image
                                quality={100}
                                width={64}
                                height={64}
                                loading='eager'
                                placeholder='blur'
                                blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                                src={`${process.env.NEXT_PUBLIC_URL}/${item?.user?.imageUrl}`}
                                className='min-w-[120px] min-h-[120px] rounded-full object-cover flex whitespace-nowrap flex-1 box-border]'
                                alt='forumUserImage'
                              />
                            ) : (
                              <span className='min-w-[120px] min-h-[120px]  box-border p-5 rounded-full flex whitespace-nowrap flex-1 justify-center items-center uppercase bg-green-light text-green text-2xl'>
                                {(
                                  item?.user?.firstName ||
                                  item?.user?.lastName ||
                                  item?.user?.email
                                )?.slice(0, 1)}
                              </span>
                            )}
                          </div>
                          <div className='w-fit flex flex-col justify-center items-center'>
                            <h1 className='text-sm md:text-md lg:text-lg font-semibold flex'>
                              {item?.user?.firstName ||
                                item?.user?.lastName ||
                                item?.user?.email}
                            </h1>
                            <p className='text-gray-400 text-base'>
                              {item?.user?.username || ''}
                            </p>
                            <h1 className='text-sm md:text-md lg:text-md font-semibold flex gap-1 text-purple'>
                              {item?.acceptance}
                              <p className='!font-normal'>topshirishlar</p>
                            </h1>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                </div>
                <div className='w-full flex flex-row justify-end items-center'>
                  <Link href={`/dg-contest/users`}>
                    <button className='min-w-[160px] rounded-md bg-white  p-3 text-center flex flex-row justify-center items-center  whitespace-nowrap gap-2'>
                      <h1 className='text-sm md:text-md lg:text-lg font-semibold flex'>
                        Leaderboardni ko{"'"}rish
                      </h1>
                      <ArrowRightIcon width={15} />
                    </button>
                  </Link>
                </div>
              </>
            )}

            {/* <div className='w-full flex flex-row justify-center items-center'>
              <button className='w-full rounded-md border border-green-300 text-green py-1 px-3 text-center flex justify-center items-center bg-green-light hover:bg-green hover:text-white'>
                <Link href={`/contests/users`}>
                  <h1 className='text-sm md:text-md lg:text-lg font-semibold flex'>
                    Leaderboardni ko{"'"}rish
                  </h1>
                </Link>
              </button>
            </div> */}
          </div>
        </>
      )}
    </>
  );
}
