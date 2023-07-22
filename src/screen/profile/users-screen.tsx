'use client';

import React, { useEffect, useState, useCallback } from 'react';
import PaginatedTable from '@/components/table/paginated-table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Headers } from '@/components/table/headers';
import axiosinstance from '@/utility/axiosinstance';
import {
  ShareIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { TObject } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import useAuth from '@/hooks/use-auth';
import Pagination from '@/components/pagination/pagination';

export default function ContestScreen() {
  const { usersRowCol } = Headers();
  const router = useRouter();
  const apiUrl = '/api/users/info';
  const searchUserUrl = `/api/users/search`;
  const queryName = 'users-table';
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const [searchData, setSearchData] = useState<Record<string, any>[]>([]);
  const [parameters, setParameters] = useState({
    PageIndex: page || 1,
    PageSize: 5,
  });

  const searchMutation = useMutation(
    () => {
      return axiosinstance.get(`${searchUserUrl}/${user?.search}`, {
        params: parameters,
      });
    },
    {
      onSuccess: (data) => {
        setSearchData(data?.data?.data);
      },
    }
  );

  const { data, isFetching, refetch } = useQuery([queryName], async () => {
    return await axiosinstance.get(apiUrl, {
      params: parameters,
    });
  });
  // const { data: users } = useQuery([queryName, "all"], async () => {
  // 	return await axiosinstance.get(apiUrl, {
  // 		// params: parameters,
  // 	});
  // });

  const handleSetParameters = (filterFormData: TObject) => {
    setParameters((previous) => {
      return { ...previous, ...filterFormData };
    });
  };

  const handleChangePage = useCallback(
    (index: number) => {
      handleSetParameters({
        ...parameters,
        PageIndex: index + 1,
      });
    },
    [parameters]
  );

  // useEffect(() => {
  //   router.replace(`${pathname}?page=${parameters?.PageIndex}`);
  // }, [parameters.PageIndex, pathname]);

  useEffect(() => {
    refetch();
  }, [parameters]);

  useEffect(() => {
    if (user?.search) searchMutation.mutate();
  }, [user?.search]);

  return (
    <>
      <div className='w-full h-fit flex flex-col justify-start items-start rounded-xl gap-4 overflow-y-scroll scrollbar-none'>
        {/* <h1 className="my-3 text-xl font-semibold">Foydalanuvchilar</h1> */}
        {/* <PaginatedTable
          isPaginated={true}
          columns={usersRowCol}
          data={data?.data?.data || []}
          loading={isFetching}
          onChangePage={handleChangePage}
          perPage={30}
          pageNum={Number(page) || 1}
          url={`${pathname}/user`}
          activeColor='bg-gray-100'
          totalCount={data?.data?.['length']}
        /> */}
        {user?.search
          ? searchData?.length > 0
            ? searchData?.map((item: Record<string, any>, index: number) => {
                return (
                  <Link
                    key={index}
                    href={`${pathname}/user?id=${item?.id}&tab=1`}
                    className='py-6 px-7 bg-white rounded-xl max-w-full w-full flex flex-row justify-between items-center break-words'>
                    <section className='w-max flex flex-row justify-center items-center gap-3 md:gap-4 lg:gap-6'>
                      {item?.imageUrl ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_URL}/${item?.image}`}
                          alt='image'
                          width={100}
                          height={100}
                          quality={100}
                          loading='eager'
                          blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                          className='min-w-[40px] min-h-[40px] md:min-w-[56px] md:min-h-[56px] lg:min-w-[64px] lg:min-h-[64px] rounded-full object-cover'
                        />
                      ) : (
                        <span className=' min-w-[40px] min-h-[40px] md:min-w-[56px] md:min-h-[56px] lg:min-w-[64px] lg:min-h-[64px] bg-gray-100 rounded-full flex justify-center items-center text-xl'>
                          {(item?.firstName || item?.lastName)?.slice(0, 1)}
                        </span>
                      )}
                      <p>
                        {item?.rank === 1
                          ? '🥇'
                          : item?.rank === 2
                          ? '🥈'
                          : item?.rank === 3
                          ? '🥉'
                          : `#${item?.rank || 0}`}
                      </p>
                      <h1 className='text-base md:text-lg lg:text-xl font-semibold break-words w-full text-left'>
                        {item?.fullName}
                      </h1>
                    </section>
                    <section className='w-max flex flex-col md:flex-row lg:flex-row justify-center items-center gap-4 text-center'>
                      <p className='text-center w-max flex'>
                        🔥
                        {Number(item?.contestScore) +
                          Number(item?.problemSetScore)}
                      </p>
                      <ArrowTopRightOnSquareIcon
                        width={20}
                        strokeWidth={2}
                      />
                    </section>
                  </Link>
                );
              })
            : 'Foydalanuvchi topilmadi'
          : data?.data?.data?.map(
              (item: Record<string, any>, index: number) => {
                return (
                  <Link
                    key={index}
                    href={`${pathname}/user?id=${item?.id}&tab=1`}
                    className='py-6 px-7 bg-white rounded-xl max-w-full w-full flex flex-row justify-between items-center break-words'>
                    <section className='w-max flex flex-row justify-center items-center gap-3 md:gap-4 lg:gap-6'>
                      {item?.image ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_URL}/${item?.image}`}
                          alt='image'
                          width={100}
                          height={100}
                          quality={100}
                          loading='eager'
                          blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                          className='min-w-[40px] min-h-[40px] md:min-w-[56px] md:min-h-[56px] lg:min-w-[64px] lg:min-h-[64px] rounded-full object-cover'
                        />
                      ) : (
                        <span className=' min-w-[40px] min-h-[40px] md:min-w-[56px] md:min-h-[56px] lg:min-w-[64px] lg:min-h-[64px] bg-gray-100 rounded-full flex justify-center items-center text-xl'>
                          {item?.fullName?.slice(0, 1)}
                        </span>
                      )}
                      <p>
                        {item?.rank === 1
                          ? '🥇'
                          : item?.rank === 2
                          ? '🥈'
                          : item?.rank === 3
                          ? '🥉'
                          : `#${item?.rank}`}
                      </p>
                      <h1 className='text-base md:text-lg lg:text-xl font-semibold break-words w-full text-left'>
                        {item?.fullName}
                      </h1>
                    </section>
                    <section className='w-max flex flex-col md:flex-row lg:flex-row justify-center items-center gap-4 text-center'>
                      <p className='text-center w-max flex'>
                        🔥
                        {Number(item?.contestScore) +
                          Number(item?.problemSetScore)}
                      </p>
                      <ArrowTopRightOnSquareIcon
                        width={20}
                        strokeWidth={2}
                      />
                    </section>
                  </Link>
                );
              }
            )}
      </div>
      {isAuthenticated && (
        <div className='w-full h-fit flex flex-col justify-start items-start rounded-xl gap-4  py-5'>
          <h1 className='text-lg md:text-xl lg:text-2xl font-semibold'>
            Sizning o{"'"}rningiz
          </h1>
          <Link
            href={`${pathname}/user?id=${data?.data?.rankOfUser?.id}&tab=1`}
            className='py-6 px-7 bg-white rounded-xl max-w-full w-full flex flex-row justify-between items-center break-words'>
            <section className='w-max flex flex-row justify-center items-center gap-3 md:gap-4 lg:gap-6'>
              {data?.data?.rankOfUser?.image ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_URL}/${data?.data?.rankOfUser?.image}`}
                  alt='image'
                  width={100}
                  height={100}
                  quality={100}
                  loading='eager'
                  placeholder='blur'
                  blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                  className='min-w-[40px] min-h-[40px] md:min-w-[56px] md:min-h-[56px] lg:min-w-[64px] lg:min-h-[64px] rounded-full object-cover'
                />
              ) : (
                <span className=' min-w-[40px] min-h-[40px] md:min-w-[56px] md:min-h-[56px] lg:min-w-[64px] lg:min-h-[64px] bg-gray-100 rounded-full flex justify-center items-center text-xl'>
                  {data?.data?.rankOfUser?.fullName?.slice(0, 1)}
                </span>
              )}
              <p>
                {data?.data?.rankOfUser?.rank === 1
                  ? '🥇'
                  : data?.data?.rankOfUser?.rank === 2
                  ? '🥈'
                  : data?.data?.rankOfUser?.rank === 3
                  ? '🥉'
                  : `#${data?.data?.rankOfUser?.rank || 0}`}
              </p>
              <h1 className='text-base md:text-lg lg:text-xl font-semibold break-words w-full text-left'>
                {data?.data?.rankOfUser?.fullName}
              </h1>
            </section>
            <section className='w-max flex flex-col md:flex-row lg:flex-row justify-center items-center gap-4 text-center'>
              <p className='text-center w-max flex'>
                🔥
                {Number(data?.data?.rankOfUser?.contestScore) +
                  Number(data?.data?.rankOfUser?.problemSetScore)}
              </p>
              <ArrowTopRightOnSquareIcon
                width={20}
                strokeWidth={2}
              />
            </section>
          </Link>
        </div>
      )}
      <div className='w-full flex justify-center items-center box-border'>
        <Pagination
          onChangePage={handleChangePage}
          perPage={5}
          totalCount={
            (user?.search ? searchData?.length : data?.data?.['length']) || 0
          }
        />
      </div>
    </>
  );
}
