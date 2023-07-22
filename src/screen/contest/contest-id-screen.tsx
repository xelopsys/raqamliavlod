'use client';

import React, { useEffect, useState, useCallback } from 'react';
import PaginatedTable from '@/components/table/paginated-table';
import { useQuery } from '@tanstack/react-query';
import { Headers } from '@/components/table/headers';
import axiosinstance from '@/utility/axiosinstance';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { TObject } from '@/types';
import { classNames } from '@/helper';
import ParticipantsTable from './participants/participants-table';
import ProblemSetsTable from './contest-problemset/contest-problemsets-table';
import SubmissionsTable from './submissions/submissions-table';
import StandingsTable from './standings/standings-table';
import ContestTable from './contest-table';

const tabs = [
  {
    tab: 1,
    name: 'Olimpiada haqida',
  },
  {
    tab: 2,
    name: 'Masalalar',
  },
  {
    tab: 3,
    name: 'Urinishlar',
  },
  {
    tab: 4,
    name: 'Qatnashuvchilar',
  },
  {
    tab: 5,
    name: 'Turnir jadvali',
  },
];

export default function ContestScreen({ id }: { id: string | number }) {
  const { contestRowCol } = Headers();
  const router = useRouter();
  const apiUrl = '/api/contests';
  const queryName = 'contest-table';
  const pathname = usePathname();
  const [parameters, setParameters] = useState({});
  const searchParams = useSearchParams()!;
  const tab = searchParams.get('tab');
  const { data, isFetching } = useQuery([queryName], async () => {
    return await axiosinstance.get(apiUrl);
  });

  const handleSetParameters = (filterFormData: TObject) => {
    setParameters((previous) => {
      return { ...previous, ...filterFormData };
    });
  };

  const handleChangePage = useCallback(
    (index: number) => {
      handleSetParameters({
        ...parameters,
        page: index + 1,
      });
    },
    [parameters]
  );

  useEffect(() => {
    if (!tab) {
      router.replace(`${pathname}?tab=1&id=${id}`);
    }
  }, [tab, pathname, id]);

  const handleGotoRoute = (index: any) => {
    router.replace(`${pathname}?tab=${index}&id=${id}`);
  };

  return (
    <>
      {/* // <div className='w-full h-full flex flex-col justify-start items-start gap-4 overflow-x-hidden box-border'> */}
      <div className='flex flex-row justify-start items-start w-full h-fit'>
        <div className='flex flex-row w-full justify-start items-start h-full overflow-x-scroll scrollbar-none gap-3 scroll-smooth p-2'>
          {tabs.map((t, index) => (
            <button
              key={index}
              onClick={() => handleGotoRoute(index + 1)}
              type='button'
              aria-label='Go to page'
              className={classNames(
                'medium-16 flex items-center justify-between rounded-md px-6 py-2 text-left border text-gray-500 transition-all duration-100 ease-in hover:text-primary',
                index + 1 === Number(tab) ? 'bg-green text-white' : ''
              )}>
              <div className='flex gap-3 whitespace-nowrap'>{t.name}</div>
            </button>
          ))}
        </div>
      </div>
      <div className='w-full h-max flex flex-row justify-start items-start bg-white p-5 rounded-xl box-border overflow-hidden'>
        {(tab === '1' && <ContestTable id={id} />) ||
          (tab === '2' && <ProblemSetsTable id={id} />) ||
          (tab === '3' && <SubmissionsTable id={id} />) ||
          (tab === '4' && <ParticipantsTable id={id} />) ||
          (tab === '5' && <StandingsTable id={id} />)}
        {/* <PaginatedTable
					isPaginated={false}
					columns={contestRowCol}
					data={
						data?.data?.filter((item: any) => item.status === "Finished") || []
					}
					loading={isFetching}
					onChangePage={handleChangePage}
					perPage={5}
					totalCount={data?.data?.length}
				/> */}
      </div>
      {/* // </div> */}
    </>
  );
}
