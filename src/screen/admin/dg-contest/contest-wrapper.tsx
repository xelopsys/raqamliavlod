'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import { classNames } from '@/helper';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const tabs = [
  {
    tab: 1,
    name: 'Kontestlar',
    value: '',
  },
  {
    tab: 2,
    name: 'Masalalar',
    value: '/problemsets',
  },
  // {
  //   tab: 3,
  //   name: '🎮 Masalalar',
  //   value: '/problemsets',
  // },
  // {
  //   tab: 4,
  //   name: '📃 Katalog',
  // },
  // {
  //   tab: 4,
  //   name: '👥 Reyting',
  //   value: '/users',
  // },
];

export default function CoursesWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  return (
    <div
      className={`w-full h-full flex flex-col box-border justify-start items-start gap-y-6 md:p-5 lg:p-5 overflow-hidden`}>
      <h1 className='w-max h-max text-base md:text-lg lg:text-xl font-semibold'>
        DG Contest
      </h1>
      {
        <div className='flex w-full overflow-y-scroll scrollbar-none gap-3'>
          {tabs.map((t, index) => (
            <Link
              key={index}
              href={`/admin/dg-contest${t.value}`}
              aria-label='Go to page'
              className={classNames(
                'text-lg flex items-center justify-between px-6 py-2 text-left transition-all duration-100 ease-in hover:text-primary rounded-md border text-gray-500',
                t.value !== '' && path.startsWith(`/admin/dg-contest${t.value}`)
                  ? 'bg-green text-white'
                  : t.value === '' && path === '/admin/dg-contest'
                  ? 'bg-green text-white'
                  : ''
              )}>
              <div className='flex gap-3 whitespace-nowrap'>{t.name}</div>
            </Link>
          ))}
          <Link
            href={`${path}/create`}
            aria-label='Go to page'
            className={classNames(
              'text-lg flex items-center justify-between px-6 py-2 text-left transition-all duration-100 ease-in hover:text-primary rounded-md border text-gray-500',
              path.endsWith(`create`) ? 'bg-green text-white' : ''
            )}>
            <div className='flex gap-3 whitespace-nowrap'>
              <PlusIcon width={20} />
            </div>
          </Link>
        </div>
      }
      {children}
    </div>
  );
}
