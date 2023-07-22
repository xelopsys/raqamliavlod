'use client';

import React, { useEffect, useState, useRef } from 'react';
import useAuth from '@/hooks/use-auth';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import { toast } from 'react-hot-toast';
import {
  PlayCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  InformationCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  QrCodeIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import VideoComponent from './video-screen';
import { classNames, downloadUrl } from '@/helper';
import { AxiosError } from 'axios';

export default function CoursesScreen({ id }: { id: string }) {
  const apiUrl = `/api/courses/user/finished`;
  const getcertificateUrl = `/api/courses/certificates`;
  const certificateUrl = `/api/courses/certificate/${id}`;
  const queryName = 'course-success';
  const router = useRouter();
  const pathname = usePathname();
  const videoRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  // const [video, setVideo] = useState<Record<string, any>>();
  const [tab, setTab] = useState<string>('');
  const [width, setWidth] = useState<number>(0);

  const { data, isFetching } = useQuery([queryName, id], async () => {
    return await axiosinstance.get(`${apiUrl}/${user?.id}/${id}`);
  });

  const certificateMutation = useMutation(
    () => {
      return axiosinstance.post(certificateUrl);
    },
    {
      onSuccess: (data) => {
        console.log(data?.data, 'data post');
        downloadUrl(
          `${process.env.NEXT_PUBLIC_URL}${data?.data}`,
          'certificate'
        );
      },
      onError: (error: AxiosError) => {
        if (error?.response?.status === 400) {
          getcertificateMutation.mutate();
        }
      },
    }
  );

  const getcertificateMutation = useMutation(
    () => {
      return axiosinstance.get(`${getcertificateUrl}/${user?.id}/${id}`);
    },
    {
      onSuccess: (data) => {
        console.log(data?.data, 'data, get');
        downloadUrl(
          `${process.env.NEXT_PUBLIC_URL}${data?.data?.[0]?.attachment?.path}`,
          'certificate'
        );
      },
      onError: () => {
        toast.error('Xatolik yuz berdi');
      },
    }
  );

  const handleTakeCertificate = () => {
    certificateMutation.mutate();
  };

  // const handleEndCourse = (id: number) => {
  //   toast.success('Siz kursni muvaffaqiyatli tugatdingiz');
  //   router.back();
  // };

  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current?.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start',
  //       inline: 'nearest',
  //     });
  //   }
  // }, [pathname, id, lesson]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  // useEffect(() => {
  //   setVideo(
  //     data?.data?.data?.find(
  //       (course: Record<string, any>) => course?.id === Number(id)
  //     )
  //   );
  // }, [data?.data, id]);
  return (
    <>
      <div className='h-full w-full flex flex-row justify-start items-start md:justify-center md:items-center lg:justify-center lg:items-center  overflow-hidden box-border overflow-y-scroll scrollbar-none'>
        {/* <Image /> */}
        <div className='w-full md:w-[90%] h-max lg:w-[67%] bg-white rounded-xl p-5 md:p-8 lg:p-10 flex flex-col md:flex-col lg:flex-row justify-start items-center gap-10 relative'>
          <img
            src='/tada.gif'
            className='absolute top-0 md:-top-[20%] lg:-top-[20%] -left-[7%] -rotate-[45deg] w-56'
          />
          <div className='w-full md:w-2/3 lg:w-2/3 h-max flex flex-col justify-start items-start gap-3'>
            <h1 className='text-base md:text-lg lg:text-3xl font-bold'>
              🎉 Tabriklaymiz! Siz kursni yakunladingiz!{' '}
            </h1>
            <p className='text-sm md:text-md lg:text-lg'>
              Statistika ma{"'"}lumotlariga qaraganda faqatgina 12.6% talabalar
              kurslarni oxirigacha o{"'"}rganishar ekan.
              <br />
              <br />
              Demak siz top 13% insonlardan birisiz!
              <br />
              <br />
              <strong>🚀 Yuksalishda davom eting!</strong>
            </p>
            <hr className='w-full mr-auto text-gray-300' />
            {/* <div className='flex flex-row justify-between items-center'>
              <button
                type='button'
               disabled={!id}
                onClick={handleTakeCertificate}
                className='bg-green text-white rounded-md px-4 py-2 hover:bg-green-600 transition-all duration-300 flex flex-row justify-center items-center gap-4 whitespace-nowrap text-sm md:text-base lg:text-lg disabled:opacity-20 disabled:cursor-not-allowed'>
                <QrCodeIcon width={20} />
                Sertifikat olish{' '}
              </button>
            </div> */}
          </div>
          <div className='max-w-[344px] w-full md:w-[344px] lg:w-[344px] h-full flex flex-col justify-start items-center border bg-white rounded-xl gap-3 shadow-lg p-4'>
            <Image
              src={`${process.env.NEXT_PUBLIC_URL}/${data?.data?.imageUrl}`}
              width={400}
              height={400}
              quality={100}
              loading='eager'
              placeholder='blur'
              blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
              className='rounded-xl w-full h-80 object-cover'
              alt='course'
            />
            <h1 className='text-base md:text-lg lg:text-xl w-full text-left'>
              <strong>{data?.data?.title}</strong>
            </h1>
            <button className='flex w-full flex-row justify-center items-center py-2 px-3 rounded-lg bg-purple-light text-purple gap-2 font-semibold text-sm md:text-base lg:text-lg'>
              <CheckIcon
                width={19}
                strokeWidth={2.5}
              />
              Siz kursni tugatdingiz!
            </button>
            <button
              onClick={router.back}
              className='flex w-full flex-row justify-center items-center py-2 px-3 rounded-lg bg-blue text-white gap-2 font-semibold text-sm md:text-base lg:text-lg'>
              <ArrowPathIcon
                width={19}
                strokeWidth={2.5}
              />
              Kursni qaytadan ko{"'"}rish
            </button>
          </div>
          <img
            src='/tada.gif'
            className='absolute md:-bottom-[20%] lg:-bottom-[20%] -right-[7%] -rotate-[225deg] w-56'
          />
        </div>
      </div>
    </>
  );
}
