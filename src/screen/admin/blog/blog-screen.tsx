'use client';

import React, { useEffect, useState, useCallback } from 'react';
import PaginatedTable from '@/components/table/paginated-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Headers } from '@/components/table/headers';
import axiosinstance from '@/utility/axiosinstance';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { TObject } from '@/types';
import {
  LinkIcon,
  BookmarkIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { classNames, handleCopy } from '@/helper';
import useAuth from '@/hooks/use-auth';
import Image from 'next/image';
import NiceModal from '@ebay/nice-modal-react';
import Loader from '@/components/loader/post-loading';
import Pagination from '@/components/pagination/pagination';
import CreateDoctagModal from '@/form/create-doctag-modal';
import UpdateTagModal from '@/form/update-doctag-modal';

export default function BlogScreen() {
  const apiUrl = '/api/documentation/admin';
  const deleteDocUrl = '/api/documentation';
  const approveDocUrl = '/api/documentation/approve';
  const tagsUrl = '/api/doctag';
  const pinnedDocUrl = '/api/pinneddocumentation/admin';
  const contestUrl = '/api/contests';
  const contestName = 'contests';
  const queryName = 'blogs-table';
  const tagName = 'tags-table';
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [showMore, setShowMore] = useState(false);
  const [contest, setContest] = useState<Record<string, any>>({});
  const [active, setActive] = useState<Record<string, any>>({
    id: 0,
    content: 'Barchasi',
  });
  const [params, setParams] = useState<Record<string, any>>({
    PageIndex: 1,
    PageSize: 5,
  });
  const [posts, setPosts] = useState<Record<string, any>[]>([]);
  const [tagsData, setTagsData] = useState<Record<string, any>[]>([]);

  const { data, isFetching, refetch } = useQuery([queryName], async () => {
    return await axiosinstance.get(apiUrl);
  });
  const { data: tags, refetch: refetchTag } = useQuery([tagName], async () => {
    return await axiosinstance.get(tagsUrl);
  });

  const deleteMutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.delete(`${tagsUrl}/${data?.id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast.success("Tag o'chirildi");
      },
      onError: (error: Record<string, any>) => {
        toast.error('Xatolik');
      },
    }
  );

  const deleteDocMutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.delete(`${deleteDocUrl}/${data?.id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast.success("Post o'chirildi");
      },
      onError: (error: Record<string, any>) => {
        toast.error('Xatolik');
      },
    }
  );

  const approveDocMutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.post(`${approveDocUrl}/${data?.id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast.success('Post tasdiqlandi');
      },
      onError: (error: Record<string, any>) => {
        toast.error('Xatolik');
      },
    }
  );

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
    setTagsData(showMore ? tags?.data : tags?.data?.slice(0, 3));
  }, [tags, showMore]);

  useEffect(() => {
    setPosts(data?.data?.data);
  }, [data]);

  useEffect(() => {
    if (active) {
      setPosts(
        data?.data?.data?.filter((item: Record<string, any>) =>
          item?.tags?.find((tag: TObject) => tag === active?.content)
        )
      );
    }
    if (active?.content === 'Barchasi') {
      setPosts(data?.data?.data);
    }
  }, [active]);

  useEffect(() => {
    refetch();
    refetchTag();
  }, []);

  const handleShowTags = () => {
    setShowMore(!showMore);
  };

  const handleAddTag = () => {
    NiceModal.show(CreateDoctagModal);
  };

  const handleUpdateTage = (item: Record<string, any>) => {
    NiceModal.show(UpdateTagModal, {
      id: item?.id,
      content: item?.content,
      description: item?.description,
    });
  };

  return (
    <>
      {isFetching ? (
        <div className='w-full h-full flex flex-col justify-start items-start overflow-x-auto p-5 gap-y-5 overflow-y-scroll scrollbar-none'>
          <div className='w-full md:w-2/3 lg:w-2/3 flex flex-row justify-start items-start flex-wrap gap-3'>
            <Loader />
            <Loader />
            <Loader />
          </div>
        </div>
      ) : (
        <div className='w-full 2xl:container h-full flex flex-col md:flex-row lg:flex-row justify-start items-start py-12 px-5 md:px-10 lg:px-10 gap-5 scrollbar-none box-border overflow-scroll scroll-smooth relative'>
          <div className='w-full  flex flex-col justify-start items-start gap-5'>
            <div className='w-full flex flex-row justify-between items-center '>
              <h1 className='w-max h-max text-base md:text-lg lg:text-xl font-semibold'>
                Maqolalar
              </h1>
            </div>
            <div className='w-full flex flex-row justify-center items-center'>
              <div className='w-full flex flex-row justify-start items-center flex-wrap gap-3'>
                <span
                  onClick={() => setActive({ id: 0, content: 'Barchasi' })}
                  className={classNames(
                    'py-2 px-6 rounded-md text-sm md:text-md lg:text-lg flex justify-center items-center cursor-pointer',
                    active?.content === 'Barchasi'
                      ? 'bg-green text-white'
                      : 'border bg-white hover:border-none hover:bg-green hover:text-white'
                  )}>
                  Barchasi
                </span>
                {tagsData?.map((tag: TObject, index: number) => {
                  return (
                    <span
                      key={index}
                      className={classNames(
                        'py-2 px-6 rounded-md text-sm md:text-md lg:text-lg flex justify-center items-center cursor-pointer gap-2',
                        active?.content === tag?.content
                          ? 'bg-green text-white'
                          : 'border bg-white hover:border-none hover:bg-green hover:text-white'
                      )}
                      onClick={() => setActive(tag)}>
                      {tag?.content}
                      <PencilIcon
                        width={12}
                        onClick={() => handleUpdateTage(tag)}
                      />
                      <TrashIcon
                        width={12}
                        onClick={() => deleteMutation.mutate({ id: tag?.id })}
                      />
                    </span>
                  );
                })}
                <button
                  type='button'
                  onClick={handleShowTags}
                  className='py-2 px-6 bg-white rounded-md border text-sm md:text-md lg:text-lg flex justify-center items-center hover:border-none hover:bg-green hover:text-white cursor-pointer'>
                  {showMore ? '-' : '+'}
                </button>
                <button
                  type='button'
                  onClick={handleAddTag}
                  className='py-2 px-6 bg-white rounded-md border text-sm md:text-md lg:text-lg flex justify-center items-center hover:border-none hover:bg-green hover:text-white cursor-pointer'>
                  Qo{"'"}shish
                </button>
              </div>
            </div>
            <div className='w-full min-w-full h-full flex flex-col justify-start items-center gap-y-5 overflow-y-scroll scrollbar-none'>
              <div className='w-full h-max flex flex-col flex-nowrap justify-start items-start gap-y-5 overflow-y-scroll scrollbar-none'>
                {posts?.map((item: TObject, index: number) => {
                  return (
                    <>
                      <Link
                        key={index}
                        href={`${pathname}/post?id=${item?.id}`}
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
                            <div className='flex items-center'>
                              <CheckIcon
                                width={20}
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  approveDocMutation.mutate({ id: item?.id });
                                }}
                              />
                            </div>
                            <section className='w-max flex flex-row justify-center items-center gap-3'>
                              <button className='flex flex-row justify-center items-center gap-1 disabled:opacity-20 disabled:cursor-not-allowed'>
                                <TrashIcon
                                  width={18}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    deleteDocMutation.mutate({ id: item?.id });
                                  }}
                                />
                              </button>
                            </section>
                          </section>
                        </div>
                        {item?.attachment && (
                          <div className='w-full h-64 flex justify-center items-center rounded-b-md'>
                            <Image
                              loading='eager'
                              src={`${process.env.NEXT_PUBLIC_URL}/${item?.attachment?.path}`}
                              className='w-full h-full object-cover rounded-b-md'
                              alt='post image'
                              blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                              placeholder='blur'
                              width={800}
                              height={200}
                              quality={100}
                            />
                          </div>
                        )}
                      </Link>
                    </>
                  );
                })}
                <div className='w-full flex justify-center items-center box-border'>
                  <Pagination
                    onChangePage={handleChangePage}
                    perPage={5}
                    totalCount={data?.data?.['length'] || 0}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* <div className='flex flex-row justify-center items-start w-full'>
            <div className='w-full md:w-2/3 lg:w-2/3 flex flex-row justify-between items-center flex-wrap gap-3'>
              <h1 className='text-lg md:text-xl lg:text-xl'>Maqola yaratish</h1>
              <button className='border border-purple-500 py-2 px-3 rounded-md group hover:bg-purple-500 hover:text-white'>
                <Link href={`${pathname}/create`}>Yaratish</Link>
              </button>
            </div>
          </div> */}
        </div>
      )}
    </>
  );
}
