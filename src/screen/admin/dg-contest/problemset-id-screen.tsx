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
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import NiceModal from '@ebay/nice-modal-react';
import CreateProblemTest from '@/form/create-problemset-modal';
import UpdateProblemsetInput from '@/form/update-problemset-modal';

export default function ProblemSetsTable({ problemId }: { problemId: string }) {
  const queryName = `problemsets-${problemId}`;
  const apiUrl = `/api/problemsets/${problemId}`;
  const testsUrl = '/api/problemsets/tests';
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery([queryName], async () => {
    return await axiosinstance.get(apiUrl);
  });

  const deletmutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.delete(`${testsUrl}/${data?.id}`);
    },
    {
      onSuccess: () => {
        toast.success("Test o'chirildi");
        queryClient.invalidateQueries();
      },
      onError: () => {
        toast.error("Test o'chirilmadi");
      },
    }
  );

  const updateProblem = {
    show: ({
      id,
      input,
      output,
    }: {
      id: string;
      input: string;
      output: string;
    }) =>
      NiceModal.show(UpdateProblemsetInput, {
        id: data?.data?.id,
        testid: id,
        input,
        output,
      }),
  };

  const createProblem = {
    show: () =>
      NiceModal.show(CreateProblemTest, {
        id: data?.data?.id,
      }),
  };

  return (
    <>
      {isFetching ? (
        <p>Bir oz kuting...</p>
      ) : (
        <div className='min-w-fit w-full h-max flex flex-col justify-start items-center gap-y-5 box-border overflow-x-hidden break-words scrollbar-none bg-white rounded-lg p-8'>
          <h1 className='text-sm md:text-lg lg:text-xl font-bold w-full flex flex-row justify-center items-center text-center p-3 bg-gray-100 rounded-md border border-purple-500 '>
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
            <h1 className='text-sm md:text-lg lg:text-xl font-bold'>Batafil</h1>
            <p
              className='!text-md'
              dangerouslySetInnerHTML={{
                __html: data?.data?.definition,
              }}
            />
          </div>
          <div className='w-full flex flex-col justify-start items-start gap-3'>
            <section>
              <h1 className='text-sm md:text-lg lg:text-xl font-bold'>
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
              <h1 className='text-sm md:text-lg lg:text-xl font-bold'>
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
            <section className='w-full h-max flex flex-row flex-nowrap justify-start items-center gap-x-5 relative'>
              <h1 className='w-full text-sm md:text-lg lg:text-xl font-bold'>
                Input
              </h1>
              <h1 className='w-full text-sm md:text-lg lg:text-xl font-bold'>
                Output
              </h1>
              <span className='border rounded-lg p-3'>
                <PlusIcon
                  width={20}
                  onClick={createProblem.show}
                />
              </span>
            </section>
            {data?.data?.tests?.map(
              (test: Record<string, any>, index: number) => {
                return (
                  <section
                    key={index}
                    className='w-full h-max flex flex-row justify-center items-start gap-4 px-4 border-b rounded-md border border-purple-500'>
                    <p className='text-sm md:text-bas lg:text-base py-4 w-min flex'>
                      {index + 1}
                    </p>
                    <p
                      className='text-sm md:text-bas lg:text-base w-full  border-x border-purple-500 py-4 px-4 flex flex-col justify-start items-start break-words h-full'
                      dangerouslySetInnerHTML={{
                        __html: test?.input,
                      }}
                    />
                    <p
                      className='text-sm md:text-bas lg:text-base w-full flex flex-col justify-start items-start py-4 break-words'
                      dangerouslySetInnerHTML={{
                        __html: test?.output,
                      }}
                    />
                    <span className='w-max flex flex-col justify-center h-full items-center gap-2 '>
                      <PencilIcon
                        width={20}
                        className='text-purple-500 cursor-pointer'
                        onClick={() =>
                          updateProblem.show({
                            id: test?.id,
                            input: test?.input,
                            output: test?.output,
                          })
                        }
                      />
                      <TrashIcon
                        width={20}
                        onClick={() => deletmutation.mutate({ id: test?.id })}
                      />
                    </span>
                  </section>
                );
              }
            )}
          </div>
        </div>
      )}
    </>
  );
}
