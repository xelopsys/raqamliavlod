'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { classNames } from '@/helper';
import { routes } from '@/routes/routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuth from '@/hooks/use-auth';

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [width, setWidth] = useState(0);
  const [activePath, setActivePath] = useState<string>('');
  const pathname = usePathname();
  const { isCollapsed } = useAuth();

  useEffect(() => {
    const mobile = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
    window.addEventListener('DOMContentLoaded', () => {
      const mobile = /Mobi|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
    });

    window.addEventListener('resize', () => {
      const mobile = /Mobi|Android/i.test(navigator.userAgent);
      setWidth(window.innerWidth);
      setIsMobile(mobile || window.innerWidth <= 768);
    });

    return () => {
      window.removeEventListener('resize', () => {
        const mobile = /Mobi|Android/i.test(navigator.userAgent);
        setWidth(window.innerWidth);
        setIsMobile(mobile || window.innerWidth <= 768);
      });
    };
  }, []);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  if (pathname.endsWith('course') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div
      className={classNames(
        'flex h-max md:h-full lg:h-full flex-col justify-start items-start bg-white min-w-fit sticky left-0 bottom-0 md:top-0 lg:top-0 z-50 box-border order-2 md:order-1 lg:order-1 xl:order-1 2xl-order-1',
        isCollapsed && !isMobile ? 'w-max' : ' w-full md:w-[320px] lg:w-[320px]'
      )}>
      <div
        className={classNames(
          'flex flex-row md:flex-col lg:flex-col justify-start items-center h-max md:h-full lg:h-full overflow-y-auto scroll-smooth relative',
          isCollapsed && !isMobile ? 'w-max' : 'w-full'
        )}>
        <nav
          aria-label='Main Nav'
          className={classNames(
            'space-1 h-max md:h-full lg:h-full flex flex-row flex-nowrap justify-evenly items-start md:justify-start md:items-start lg:justify-start lg:items-start md:flex-col lg:flex-col py-3 md:px-2 lg:px-2 box-border md:gap-2 lg:gap-3 transition-all duration-500 linear px-2',
            isCollapsed && !isMobile ? 'w-max' : 'w-full'
          )}>
          {routes.map((route, index) => {
            return (
              <>
                {route.exact && <hr className='w-full my-5' />}

                <Link
                  key={index}
                  href={route.path}
                  className={classNames(
                    'flex gap-[5px] text-gray-500 hover:bg-purple-light hover:text-purple rounded-lg font-normal transition-all duration-100 ease-in',
                    pathname === '/' && route.home
                      ? 'bg-purple-light text-purple font-semibold '
                      : pathname === activePath &&
                        activePath !== '/' &&
                        !route.home &&
                        activePath.startsWith(route.path)
                      ? 'bg-purple-light text-purple font-semibold '
                      : '',
                    route.name?.length <= 7 && isMobile ? 'px-4 py-2' : 'p-2',
                    width < 290 ? 'p-2' : '',
                    isCollapsed && !isMobile
                      ? 'w-28 flex-col justify-start items-center'
                      : 'w-full md:w-full lg:w-full flex-col md:flex-row lg:flex-row justify-center md:justify-start lg:justify-start items-center md:gap-4 lg:gap-5 md:px-5 lg:px-8 md:py-[15px] lg:py-4'
                  )}>
                  <route.Icon
                    width={21}
                    className='stroke-2 stroke-current lg:w-8 lg:h-8 md:w-7 md:h-7'
                  />
                  <span
                    className={classNames(
                      'md:text-base lg:text-md w-max whitespace-nowrap',
                      isCollapsed && !isMobile
                        ? 'text-center'
                        : 'text-center md:text-left lg:text-left',
                      width < 290 ? 'text-[7.5px]' : 'text-xs'
                    )}>
                    {route.name}
                  </span>
                </Link>
              </>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
