'use client';

import React, { useEffect, useState, useCallback } from 'react';
import PaginatedTable from '@/components/table/paginated-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Headers } from '@/components/table/headers';
import axiosinstance from '@/utility/axiosinstance';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ObjectToFormData, classNames } from '@/helper';
import { TObject } from '@/types';
import useAuth from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

export default function ProblemSetsTable({
  id,
  problemId,
}: {
  id: string;
  problemId: string;
}) {
  const queryName = `problemSets-${problemId}-table`;
  const apiUrl = `/api/contests/${id}/problemsets/${problemId}`;
  const { register, handleSubmit, watch } = useForm();
  const { contestProblemsetSubCol } = Headers();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const [parameters, setParameters] = useState({
    PageIndex: page || 1,
    PageSize: 10,
  });
  const file = watch('CodeFile');

  const { data, isFetching, refetch } = useQuery([queryName], async () => {
    return await axiosinstance.get(apiUrl, { params: parameters });
  });

  // const {
  //   data: problems,
  //   isFetching: isFetchingProblem,
  //   refetch,
  // } = useQuery([`problemset-id`, problemId], async () => {
  //   if (problemId)
  //     return await axiosinstance.get(
  //       `/api/submissions/${problemId}/${user?.id}`,
  //       { params: parameters }
  //     );
  // });

  const { data: problems, isFetching: isFetchingProblem } = useQuery(
    [`contest-problemset-id`, problemId],
    () => {
      return axiosinstance.get(`/api/contests/${id}/submissions/${user?.id}`, {
        params: parameters,
      });
    }
  );

  const mutation = useMutation(
    (data: TObject) => {
      return axiosinstance.post(
        `/api/contests/submissions`,
        ObjectToFormData(data)
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast.success('Muvaffaqiyatli jo`natildi');
      },
      onError: (error: Error | any) => {
        toast.error(error?.response?.data?.Message || 'Xatolik yuz berdi');
      },
    }
  );

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

  const onSubmit = (formData: Record<string, any>) => {
    mutation.mutate({
      CodeFile: formData.CodeFile[0],
      LanguageType: formData.LanguageType,
      ProblemSetId: problemId,
      ContestId: id,
    });
  };

  useEffect(() => {
    refetch();
  }, [parameters]);

  return (
    <>
      {isFetching ? (
        <p>Bir oz kuting...</p>
      ) : (
        <div className='min-w-fit w-full h-max flex flex-col justify-start items-center gap-y-5 box-border break-words overflow-y-scroll scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-600 bg-white rounded-lg p-8'>
          <h1 className='text-lg md:text-xl lg:text-xl font-bold w-full flex flex-row justify-center items-center text-center p-3 bg-gray-100 rounded-md border border-purple-500'>
            {data?.data?.name}
          </h1>
          <h1 className='text-base font-semibold'>
            Muallif:{' '}
            <span className='text-lg font-bold'>
              {data?.data?.authorName || 'N/A'}
            </span>
          </h1>
          <div className='w-full h-max flex flex-row justify-start items-center flex-wrap gap-3'>
            <span
              className={classNames(
                'p-1 rounded-md',
                data?.data?.difficulty >= 55
                  ? 'text-red-700 bg-red-300'
                  : data?.data?.difficulty >= 15
                  ? 'text-yellow-700 bg-yellow-300'
                  : 'text-green-700 bg-green-300'
              )}>
              Qiyinlik darajasi: {data?.data?.difficulty || 0}
            </span>
            <span
              className={classNames(
                'p-1 rounded-md',
                data?.data?.difficulty >= 55
                  ? 'text-red-700 bg-red-300'
                  : data?.data?.difficulty >= 15
                  ? 'text-yellow-700 bg-yellow-300'
                  : 'text-green-700 bg-green-300'
              )}>
              Qiyinlik turi: {data?.data?.type || ''}
            </span>
            <span className='p-1 rounded-md text-blue-700 bg-blue-300'>
              Xotiradagi o{"'"}rni: {data?.data?.memoryLimit || 0}Kb
            </span>
            <span className='p-1 rounded-md text-purple-700 bg-purple-300'>
              Vaqt chegarasi: {data?.data?.timeLimit || 0}Ms
            </span>
          </div>
          <div className='w-full flex flex-col justify-start items-start gap-3'>
            <h1 className='text-base md:text-lg lg:text-xl font-bold'>
              Batafil
            </h1>
            <p
              className='!text-md'
              dangerouslySetInnerHTML={{
                __html: data?.data?.definition,
              }}
            />
          </div>
          <div className='w-full flex flex-col justify-start items-start gap-3'>
            <section>
              <h1 className='text-base md:text-lg lg:text-xl font-bold'>
                Kirish ma{"'"}lumotlari
              </h1>
              <p
                className='text-md'
                dangerouslySetInnerHTML={{
                  __html: data?.data?.inputDefinition,
                }}
              />
            </section>
            <section>
              <h1 className='text-base md:text-lg lg:text-xl font-bold'>
                Chiqish ma{"'"}lumotlari
              </h1>
              <p
                className='text-md'
                dangerouslySetInnerHTML={{
                  __html: data?.data?.outputDefinition,
                }}
              />
            </section>
          </div>
          <div className='w-full h-max flex flex-col flex-nowrap justify-center items-start gap-y-2'>
            <section className='w-full h-max flex flex-row flex-nowrap justify-start items-center gap-x-5'>
              <h1 className='w-full text-base md:text-lg lg:text-xl font-bold'>
                Input
              </h1>
              <h1 className='w-full text-base md:text-lg lg:text-xl font-bold'>
                Output
              </h1>
            </section>
            {data?.data?.tests?.map(
              (test: Record<string, any>, index: number) => {
                return (
                  <section
                    key={index}
                    className='w-full h-max flex flex-row justify-center items-start gap-4 px-4 border-b rounded-md border border-purple-500'>
                    <p className='text-base md:text-bas lg:text-base py-4 w-min flex'>
                      {index + 1}
                    </p>
                    <p
                      className='text-base md:text-bas lg:text-base w-full border-x border-purple-500 py-4 px-4 flex flex-col justify-start items-start break-words'
                      dangerouslySetInnerHTML={{
                        __html: test?.input,
                      }}
                    />
                    <p
                      className='text-base md:text-bas lg:text-base w-full flex flex-col justify-start items-start py-4 break-words'
                      dangerouslySetInnerHTML={{
                        __html: test?.output,
                      }}
                    />
                  </section>
                );
              }
            )}
          </div>
          {isAuthenticated ? (
            <>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='w-full h-max flex flex-col justify-center items-start'>
                <h1 className='w-full text-base md:text-lg lg:text-xl font-bold'>
                  Yechim yuborish
                </h1>
                <section className='w-full flex flex-col flex-nowrap md:flex-row lg:flex-row justify-center items-center gap-4'>
                  <select
                    {...register('LanguageType', { required: true })}
                    className='w-full border border-purple-500 flex px-3 py-2 rounded-md bg-white list-none decoration-none outline-none'
                    style={{
                      WebkitAppearance: 'caret',
                    }}>
                    <option value='cpp'>C++</option>
                    <option value='c'>C</option>
                    <option value='java'>Java</option>
                    <option value='py3'>Python</option>
                  </select>
                  <label
                    htmlFor='CodeFile'
                    className='w-full border border-purple-500 h-max rounded-md flex flex-row justify-between items-center'>
                    <span
                      className={classNames(
                        'px-4 text-base md:text-lg lg:text-lg',
                        file?.[0]?.name ? 'text-green-500' : 'text-gray-500'
                      )}>
                      {file?.[0]?.name || 'Fayl tanlang'}
                    </span>
                    <span className='h-full bg-purple-500 text-white px-3 py-2 text-center rounded-r-md'>
                      Yuklash
                    </span>
                  </label>
                  <input
                    id='CodeFile'
                    type='file'
                    className='hidden'
                    accept='.cpp,.c,.java,.py3'
                    {...register('CodeFile', { required: true })}
                  />
                  <button
                    type='submit'
                    disabled={!file?.[0]}
                    className='w-full p-2 rounded-md bg-purple-500 text-white disabled:opacity-20 disabled:cursor-not-allowed'>
                    {mutation?.isLoading ? (
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
                </section>
              </form>

              <PaginatedTable
                isPaginated={problems?.data?.length > 5}
                columns={contestProblemsetSubCol}
                data={problems?.data?.data || []}
                loading={isFetchingProblem}
                onChangePage={handleChangePage}
                perPage={5}
                totalCount={problems?.data?.length}
                // url={`${pathname}/contest`}
              />
            </>
          ) : (
            <div>
              <h1 className='text-base'>
                Yechim yuborish uchun ro{'`'}yxatdan o{'`'}tishingiz yoki
                tizimga kirishingiz kerak
              </h1>
            </div>
          )}
        </div>
      )}
    </>
  );
}
