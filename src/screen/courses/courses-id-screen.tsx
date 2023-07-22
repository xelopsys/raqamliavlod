'use client';

import React, { useEffect, useState, useRef } from 'react';
import useAuth from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import { toast } from 'react-hot-toast';
import {
  PlayCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  InformationCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import VideoComponent from './video-screen';
import { classNames, compareDateAndGetLastSeen } from '@/helper';
import { AxiosError } from 'axios';

export default function CoursesScreen({
  id,
  lesson,
}: {
  id: string;
  lesson: string;
}) {
  const apiUrl = `/api/courses/${id}`;
  const finishCourseUrl = `/api/courses/finish/${id}`;
  const postcommentUrl = `/api/courses/${id}/comments`;
  const getcommentUrl = `/api/courses/${id}/comments`;
  const queryName = 'course';
  const commentName = 'comments';
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { isAuthenticated, isCollapsed } = useAuth();
  const { handleSubmit, reset, register } = useForm();
  const videoRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<Record<string, any>[]>([]);
  const [tab, setTab] = useState<string>('about');
  const [isMessage, setIsMessage] = useState(false);
  const [width, setWidth] = useState<number>(0);

  const { data, isFetching } = useQuery([queryName, id], async () => {
    return await axiosinstance.get(apiUrl);
  });

  const { data: comments, isFetching: isFetchComments } = useQuery(
    [commentName, id],
    async () => {
      return await axiosinstance.get(getcommentUrl);
    }
  );

  const commentMutation = useMutation(
    (data: string) => {
      return axiosinstance(postcommentUrl, {
        data,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      });
    },
    {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries({ queryKey: [commentName] });
        toast.success('Fikr muvaffaqiyatli qoldirildi');
      },
      onError: () => {
        toast.error('error');
      },
    }
  );

  const finishMutation = useMutation(
    () => {
      return axiosinstance.post(finishCourseUrl);
    },
    {
      onSuccess: () => {
        toast.success('Siz kursni muvaffaqiyatli tugatdingiz');
        router.push(`${pathname}/success?id=${id}`);
      },
      onError: (error: AxiosError) => {
        if (error?.response?.status === 400)
          toast.error('Iltimos kursni oxirgacham tugating');
      },
    }
  );

  const handleVideo = (index: number) => {
    window.scrollTo(0, 1);
    router.replace(`${pathname}?id=${id}&lesson=${index}`);
  };

  const handleEndCourse = () => {
    finishMutation.mutate();
  };

  const onSubmit = (form: Record<string, any>) => {
    commentMutation.mutate(form?.text);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }, [pathname, id, lesson]);

  useEffect(() => {
    setVideos(() => {
      return data?.data?.data;
    });
  }, [data?.data]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
    });
    reset();
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  return (
    <>
      {data?.data?.data?.length > 0 ? (
        <div
          className={classNames(
            'w-full h-full flex flex-col md:flex-row lg:flex-row justify-start md:justify-center lg:justify-center items-start md:items-start lg:items-start  overflow-hidden box-border md:overflow-y-hidden lg:overflow-y-hidden scrollbar-none relative',
            isCollapsed ? 'w-max' : 'w-full md:min-w-2/3 lg:min-w-2/3'
          )}>
          <div
            className={classNames(
              'h-[30%] md:h-full lg:h-full flex flex-col justify-start items-start gap-4 order-2 md:order-1 lg:order-1 overflow-y-scroll md:overflow-y-scroll lg:overflow-y-scroll scrollbar-thin scrollbar-thumb-blue box-border bg-white relative',
              isCollapsed ? 'w-24' : 'w-full md:w-[320px] lg:w-[320px]'
            )}>
            <button
              onClick={() => router.back()}
              className={classNames(
                'w-full flex flex-row items-center sticky -top-0 bg-white text-left gap-7 py-4 text-gray-600 border-2 border-white',
                isCollapsed ? 'justify-center' : 'justify-start px-10'
              )}>
              <ArrowLeftIcon width={20} />
              {!isCollapsed && (
                <p className='text-sm md:text-base lg:text-lg'>
                  Orqaga qaytish
                </p>
              )}
            </button>
            {isCollapsed ? (
              <span className='w-full text-center flex justify-center items-center'>
                <ListBulletIcon width={20} />
              </span>
            ) : (
              <h1 className='w-full text-sm md:text-lg lg:text-lg font-semibold px-10'>
                Kurs dasturi
              </h1>
            )}
            {data?.data?.data?.map(
              (video: Record<string, any>, index: number) => {
                return (
                  <button
                    key={index}
                    onClick={() => handleVideo(index + 1)}
                    className={classNames(
                      'w-full flex flex-row items-center gap-2 py-6 whitespace-nowrap truncate border-l-4 border-transparent hover:text-purple',
                      Number(lesson) === index + 1
                        ? 'bg-purple-light text-purple border-l-4 !border-purple'
                        : 'text-gray-500',
                      isCollapsed ? 'justify-center' : 'justify-start px-7'
                    )}>
                    {/* <p>{index + 1}.</p> */}
                    <PlayCircleIcon
                      width={20}
                      strokeWidth={2.5}
                    />
                    {isCollapsed ? (
                      <p className='text-sm md:text-base lg:text-md truncate font-semibold'>
                        {index + 1}.
                      </p>
                    ) : (
                      <p className='text-sm md:text-base lg:text-md truncate w-full font-semibold'>
                        {video?.title}...
                      </p>
                    )}
                  </button>
                );
              }
            )}
          </div>
          <div
            ref={videoRef}
            className='w-full h-[70%] md:h-full lg:h-full order-1 md:order-2 lg:order-2 flex flex-col justify-start items-center p-3 md:p-10 lg:p-20 overflow-y-scroll scrollbar-none gap-5 overflow-x-hidden'>
            <div className='w-full h-max flex flex-col md:flex-row lg:flex-row justify-between items-end md:items-center lg:items-center gap-2'>
              <h1 className='w-full md:w-max lg:w-max text-sm md:text-lg lg:text-xl font-semibold'>
                {videos?.[Number(lesson) - 1]?.title}
              </h1>
              {Number(lesson) === videos?.length ? (
                <button
                  disabled={!isAuthenticated}
                  type='button'
                  onClick={handleEndCourse}
                  className={classNames(
                    'py-1 px-3 rounded-lg border disabled:opacity-20 disabled:cursor-not-allowed bg-green text-white hover:bg-green-light hover:text-white text-sm md:text-base lg:text-lg flex gap-1 whitespace-nowrap justify-center items-center'
                  )}>
                  <CheckIcon
                    width={15}
                    strokeWidth={2.5}
                  />
                  Tugatish
                </button>
              ) : (
                <button
                  type='button'
                  onClick={() => handleVideo(Number(lesson) + 1)}
                  className={classNames(
                    'py-1 px-3 rounded-lg border disabled:opacity-20 disabled:cursor-not-allowed bg-blue text-white hover:bg-blue hover:text-white text-sm md:text-base lg:text-lg flex gap-1 whitespace-nowrap justify-center items-center'
                  )}>
                  keyingisi
                  <ArrowRightIcon
                    width={15}
                    strokeWidth={2.5}
                  />
                </button>
              )}
            </div>
            <VideoComponent video={videos?.[Number(lesson) - 1]} />
            <div className='w-full h-max rounded-2xl flex flex-row justify-start items-start bg-white oveflow-hidden scrollbar-none'>
              <div className='w-full h-full flex flex-row flex-nowrap justify-start items-start overflow-x-scroll scrollbar-thin p-2 md:p-5 lg:p-5 box-border gap-2'>
                <button
                  type='button'
                  className={classNames(
                    'py-2 md:py-2 lg:py-2.5 px-3 rounded-xl flex flex-row justify-center items-center gap-2 whitespace-nowrap',
                    tab === 'about'
                      ? 'bg-purple-light text-purple hover:bg-purple-light hover:text-purple'
                      : ''
                  )}
                  onClick={() => setTab('about')}>
                  <InformationCircleIcon width={20} />
                  <h1 className='text-sm md:text-md lg:text-md font-semibold'>
                    Dars haqida
                  </h1>
                </button>
                <button
                  type='button'
                  className={classNames(
                    'py-2 md:py-2 lg:py-2.5 px-3 rounded-xl flex flex-row justify-center items-center gap-2 whitespace-nowrap',
                    tab === 'comments'
                      ? 'bg-purple-light text-purple hover:bg-purple-light hover:text-purple'
                      : ''
                  )}
                  onClick={() => setTab('comments')}>
                  <ChatBubbleLeftEllipsisIcon width={20} />
                  <h1 className='text-sm md:text-md lg:text-md font-semibold'>
                    Izohlar
                  </h1>
                </button>
              </div>
            </div>
            {tab === 'comments' && (
              <button
                type='button'
                disabled={!isAuthenticated}
                onClick={() => setIsMessage(!isMessage)}
                className='border ml-auto py-2 px-3 bg-blue text-white rounded-lg flex flex-row justify-center items-center gap-2 whitespace-nowrap disabled:opacity-20 disabled:cursor-not-allowed'>
                {isMessage ? (
                  <>
                    <BarsArrowDownIcon
                      width={15}
                      strokeWidth={2.5}
                    />
                    <p className='text-sm lg:text-lg'>Bekor qilish</p>
                  </>
                ) : (
                  <>
                    <BarsArrowUpIcon
                      width={15}
                      strokeWidth={2.5}
                    />
                    <p className='text-sm lg:text-lg'>Fikr qoldirish</p>
                  </>
                )}
              </button>
            )}
            {isMessage && tab === 'comments' && (
              <div className='w-full'>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='w-full h-max'>
                  <textarea
                    {...register('text')}
                    className='w-full h-20 rounded-lg p-3 text-sm md:text-md lg:text-lg'
                    placeholder='Fikr qoldirish'
                  />
                  <button
                    type='submit'
                    className='border mr-auto py-2 px-3 bg-green text-white rounded-lg flex flex-row justify-center items-center gap-2 whitespace-nowrap'>
                    <BarsArrowUpIcon
                      width={15}
                      strokeWidth={2.5}
                    />
                    <p className='text-sm lg:text-lg'>Fikr qoldirish</p>
                  </button>
                </form>
              </div>
            )}
            <div className='w-full flex flex-row justify-center items-center p-5 rounded-2xl bg-white'>
              {tab === 'about' ? (
                <div className='w-full flex flex-col justify-start items-start gap-2'>
                  <h1 className='text-base md:text-lg lg:text-xl font-semibold'>
                    {videos?.[Number(lesson) - 1]?.title}
                  </h1>
                  <p className='text-sm md:text-md lg:text-md text-gray-600 whitespace-wrap break-words break-all'>
                    {videos?.[Number(lesson) - 1]?.description}
                  </p>
                </div>
              ) : tab === 'comments' ? (
                <>
                  {isFetchComments ? (
                    <div className='w-full flex flex-col justify-start items-start gap-2'></div>
                  ) : comments?.data?.['length'] > 0 ? (
                    <div className='w-full flex flex-col justify-start items-start gap-4'>
                      {comments?.data?.data?.map(
                        (comment: Record<string, any>, index: number) => (
                          <>
                            <section className='w-full md:py-2 lg:py-2 md:px-3 lg:px-3'>
                              <p className='text-sm md:text-md lg:text-lg'>
                                {comment?.text}
                              </p>
                              <span className='flex flex-row justify-start items-end gap-2'>
                                <h1 className='text-base md:text-lg lg:text-xl font-semibold underline'>
                                  {comment?.userName}
                                </h1>
                                <p className='text-sm text-gray-500'>
                                  {compareDateAndGetLastSeen(
                                    comment?.createdDate
                                  )}
                                </p>
                              </span>
                            </section>
                            {comments?.data?.['length'] > 1 && (
                              <hr className='w-2/3 mr-auto' />
                            )}
                          </>
                        )
                      )}
                    </div>
                  ) : (
                    <div className='w-full flex flex-col justify-start items-start gap-2'>
                      <p className='text-sm md:text-md lg:text-lg'>
                        Hozircha fikrlar mavjud emas
                      </p>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : data?.data?.data?.length === 0 ? (
        <div className='w-full h-full flex flex-col justify-center items-center overflow-x-auto p-5 gap-y-5'>
          Hech qanday kurs topilmadi
        </div>
      ) : (
        <div className='w-full h-full flex flex-col justify-center items-center overflow-x-auto p-5 gap-y-5'>
          Bir oz kutib turing....
        </div>
      )}
    </>
  );
}
