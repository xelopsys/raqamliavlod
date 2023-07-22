'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import useAuth from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
  CameraIcon,
  ChevronUpDownIcon,
  ChatBubbleBottomCenterIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '@/helper';
import { ObjectToFormData } from '@/helper';
import { TObject } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import TextArea from '@/components/textarea/textarea';

export default function ForumIDScreen({ forumId }: { forumId: string }) {
  const apiUrl = `/api/questions/${forumId}`;
  const tagsUrl = '/api/questiontags/';
  const answerRateUrl = '/api/answerrates';
  const questionRateUrl = '/api/questionrates';
  const foundAnswerUrl = `/api/questions/answer/found/${forumId}`;
  const tagName = 'tags';
  const queryName = 'forum-screen';
  //   const replyAnswer = `/api/questions/{id}/answers`;
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const { handleSubmit, register, watch, reset } = useForm();
  const [image, setImage] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [active, setActive] = useState<number>();
  const [text, setText] = useState<string>('');
  const [activeTags, setActiveTagsData] = useState<Record<string, any>[]>([]);
  const [questions, setQuestions] = useState<Record<string, any>[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>[]>([]);
  const [answerId, setAnswerId] = useState<number>();

  const { data, isFetching, refetch } = useQuery([queryName, forumId], () => {
    return axiosinstance.get(apiUrl);
  });

  const {
    data: tags,
    isFetching: isFetchingTags,
    refetch: refetchTag,
  } = useQuery([tagName], async () => {
    if (data?.data?.tags)
      return await axiosinstance.get(`${tagsUrl}${data?.data?.tags}`);
  });

  const replyMutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.post(`/api/questions/${forumId}/answers`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
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

  const foundAnswerMutation = useMutation(
    () => {
      return axiosinstance.patch(foundAnswerUrl);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast.success('Javob topganingizdan xursandmiz!');
        router.push('/forum');
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

  const answerRateMutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.post(answerRateUrl, data);
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

  const handleFoundAnswer = () => {
    foundAnswerMutation.mutate();
  };

  const handleShowTags = () => {
    setShowMore(!showMore);
  };

  const handleTags = (tag: Record<string, any>) => {
    if (activeTags?.find((item) => item?.id === tag?.id)) {
      setActiveTagsData(activeTags?.filter((item) => item?.id !== tag?.id));
    } else {
      setActiveTagsData([...activeTags, tag]);
    }
  };

  const handleSubmitText = (text: string) => {
    setText(text);
  };

  const onSubmit = (data: Record<string, any>) => {
    replyMutation.mutate({
      text: JSON.stringify(text),
    });
  };

  const handleRate = (id: number, isLiked: boolean) => {
    answerRateMutation.mutate({
      answerId: id,
      isLiked: isLiked,
    });
  };
  const handleRateQues = (id: number, isLiked: boolean) => {
    questionRateMutation.mutate({
      questionId: id,
      isLiked: isLiked,
    });
  };

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    setAnswers(() => {
      if (data?.data?.answers?.length === 0) {
        return data?.data?.answers;
      }
      return data?.data?.answers?.reverse();
    });
    refetchTag();
  }, [data]);

  return (
    <>
      <section className='w-full flex flex-row justify-between items-center flex-nowrap'>
        <h1 className='w-max h-max text-base md:text-lg lg:text-xl font-semibold'>
          Froum {forumId}
        </h1>
        {data?.data?.user?.id === user?.id && !data?.data?.hasFoundAnswer && (
          <button
            className={classNames(
              'text-sm w-max  flex flex-nowrap flex-row justify-center items-center md:text-base lg:text-lg py-1 px-3 border border-blue rounded-md hover:bg-blue hover:text-white'
            )}
            onClick={handleFoundAnswer}>
            <p>Javob topdim</p>
          </button>
        )}
      </section>
      <div className='w-full h-full flex flex-col justify-start items-center py-10 overflow-y-scroll scrollbar-none rounded-lg bg-white p-5 box-border overflow-x-hidden'>
        <div className='flex flex-col justify-start items-start break-words w-full gap-2 box-border'>
          <div className='flex flex-row justify-center items-start gap-4 w-full'>
            <Link
              href={`/dg-contest/users/user?id=${data?.data?.user?.id}&tab=1`}
              className='w-full max-w-max h-full'>
              {data?.data?.user?.imageUrl ? (
                <Image
                  quality={100}
                  width={100}
                  height={100}
                  loading='eager'
                  placeholder='blur'
                  blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                  src={`${process.env.NEXT_PUBLIC_URL}/${data?.data?.user?.imageUrl}`}
                  className='w-14 h-14 rounded-full object-cover'
                  alt='forumUserImage'
                />
              ) : (
                <span className='w-14 h-14 box-border p-5 rounded-full flex flex-row justify-center items-center uppercase bg-blue-light text-blue'>
                  {(
                    data?.data?.user?.firstName ||
                    data?.data?.user?.lastName ||
                    data?.data?.user?.email
                  )?.slice(0, 1)}
                </span>
              )}
            </Link>
            <div className='w-full h-max flex flex-col justify-start items-start gap-1 box-border'>
              <section className='w-full flex flex-row justify-start items-center gap-x-2 text-gray-500'>
                <h1 className='text-sm md:text-lg lg:text-xl font-normal'>
                  {data?.data?.user?.firstName ||
                    data?.data?.user?.lastName ||
                    data?.data?.user?.email}
                </h1>
                <p className='text-sm'>muallif</p>
                <p className='text-sm'>
                  {new Date(data?.data?.createdDate).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    }
                  )}
                </p>
              </section>
              <h1 className='text-lg md:text-xl lg:text-2xl w-full list-style font-semibold'>
                {data?.data?.title}
              </h1>
            </div>
            <div className='ml-auto flex flex-row justify-between items-center gap-4'>
              <div className='w-max flex flex-row justify-center items-center gap-3'>
                <button
                  disabled={!isAuthenticated}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    handleRateQues(Number(forumId), true);
                  }}
                  className='flex flex-row justify-center items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed'>
                  <span>🙂</span>
                </button>
                <button
                  disabled={!isAuthenticated}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    handleRateQues(Number(forumId), false);
                  }}
                  className='flex flex-row justify-center items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed'>
                  <span>🙁</span>
                </button>
              </div>
            </div>
          </div>
          <div>
            <div
              className='text-base md:text-lg lg:text-xl !w-full list-style box-border'
              dangerouslySetInnerHTML={{
                __html: JSON.parse(data?.data?.description || '"<p> </p>"'),
              }}
            />
            {tags?.data && (
              <div className='w-full flex flex-row justify-start items-center gap-2 h-max flex-wrap mt-2'>
                {tags?.data?.map((tag: Record<string, any>, index: number) => {
                  return (
                    <span
                      key={index}
                      className='w-max flex text-sm lg:text-lg py-1 px-2 rounded-md bg-blue-light text-blue'>
                      <p className='w-full'>{tag?.name}</p>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className='w-full h-max bg-gray-100 py-2 px-3 flex justify-start items-center gap-2 text-gray-600 my-6 text-sm'>
          <ChatBubbleBottomCenterIcon width={20} />
          <p>Fikrlar: {data?.data?.answers?.length}</p>
        </div>
        {data?.data?.hasFoundAnswer ? (
          <div className='w-full py-2 px-3 text-center'>
            <h1 className='text-sm md:text-lg lg:text-xl text-gray-400'>
              Savol o{`'`}z javobini topdi
            </h1>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='w-full bg-white border mb-6 flex flex-col justify-end items-end pb-3 pr-3 relative'>
            {!isAuthenticated && (
              <p className='absolute text-sm top-1/2 w-full text-center left-0'>
                Iltimos fikr qoldirish uchun ro{"'"}yxatdan o{"'"}ting
              </p>
            )}
            <TextArea handleSubmitText={handleSubmitText} />
            <button
              className='w-1/3 py-2 text-sm md:text-base lg:text-lg text-blue bg-blue-light hover:bg-blue hover:text-white disabled:opacity-20 disabled:cursor-not-allowed z-20'
              disabled={!text || !isAuthenticated}>
              {replyMutation.isLoading ? (
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
                  Jo{"'"}natilyapti...
                </>
              ) : (
                `Jo'natish`
              )}
            </button>
          </form>
        )}
        {data?.data?.answers?.length > 0 ? (
          <div className='w-full'>
            {data?.data?.answers?.map(
              (answer: Record<string, any>, index: number) => {
                return (
                  <div
                    key={index}
                    className='w-full h-max flex flex-row justify-between'>
                    <div className='flex flex-col justify-start items-start  break-words w-full gap-2 p-3'>
                      <div className=' flex flex-row justiyf-center items-start gap-4 w-full'>
                        <Link
                          href={`/dg-contest/users/user?id=${data?.data?.user?.id}&tab=1`}
                          className='w-full max-w-max h-full'>
                          {answer?.user?.imageUrl ? (
                            <Image
                              quality={100}
                              width={100}
                              height={100}
                              loading='eager'
                              placeholder='blur'
                              blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                              src={`${process.env.NEXT_PUBLIC_URL}/${answer?.user?.imageUrl}`}
                              className='w-14 h-14 rounded-full object-cover'
                              alt='forumUserImage'
                            />
                          ) : (
                            <span className='w-14 h-14 box-border p-5 rounded-full flex flex-row justify-center items-center uppercase bg-blue-light text-blue'>
                              {(
                                data?.data?.user?.firstName ||
                                data?.data?.user?.lastName ||
                                data?.data?.user?.email
                              )?.slice(0, 1)}
                            </span>
                          )}
                        </Link>
                        <div className='w-full h-full flex flex-row justify-center items-center gap-3 box-border'>
                          <section className='w-full flex flex-row justify-start items-center gap-x-2 text-gray-500'>
                            <h1 className='text-base md:text-lg lg:text-xl font-normal'>
                              {answer?.user?.firstName ||
                                answer?.user?.lastName ||
                                answer?.user?.email}
                            </h1>
                            <p className='text-sm'>
                              {new Date(answer?.createdDate).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: '2-digit',
                                }
                              )}
                            </p>
                          </section>
                          <div className='w-max flex flex-row justify-center items-center gap-3'>
                            <button
                              disabled={!isAuthenticated}
                              onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                                handleRate(Number(answer?.id), true);
                              }}
                              className='flex flex-row justify-center items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed'>
                              <span>🙂</span>
                            </button>
                            <button
                              disabled={!isAuthenticated}
                              onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                                handleRate(Number(answer?.id), false);
                              }}
                              className='flex flex-row justify-center items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed'>
                              <span>🙁</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        className='text-base md:text-lg lg:text-xl font-normal !w-full box-border !list-decimal !list-inside '
                        dangerouslySetInnerHTML={{
                          __html: JSON.parse(answer?.text),
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : isFetching ? (
          <div className='w-full h-full flex flex-col justify-center items-center overflow-x-auto p-5 gap-y-5'>
            Yuklanyapti...
          </div>
        ) : (
          <p className='text-sm md:text-base lg:text-lg w-full text-center text-gray-400'>
            Hali fikr mavjud emas
          </p>
        )}
      </div>
    </>
  );
}
