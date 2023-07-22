'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { classNames } from '@/helper';
import {
  Bars2Icon,
  MagnifyingGlassIcon,
  UserIcon,
  LockOpenIcon,
  BoltIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';
import useAuth from '@/hooks/use-auth';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

export default function Header() {
  const path = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isDropdown, setIsDropdown] = useState(false);
  const { handleSubmit, register, reset } = useForm();
  const { user, toggle, isAuthenticated, logout, handleSearch } = useAuth();
  const isSearchPath =
    path.startsWith('/courses') ||
    // path.startsWith('/dg-contest/contests') ||
    path.startsWith('/forum') ||
    path.startsWith('/dg-contest/users') ||
    path.startsWith('/dg-contest/problemsets');
  // const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsSearch(false);
  // };

  const onSubmit = (data: Record<string, any>) => {
    console.log(data);
    handleSearch(data.search);
  };

  const handleClear = () => {
    handleSearch('');
    reset();
    setIsSearch(false);
  };

  useEffect(() => {
    // window.addEventListener('DOMContentLoaded', () => {
    //   const mobile = /Mobi|Android/i.test(navigator.userAgent);
    //   setIsMobile(mobile || window.innerWidth < 768);
    // });
    const mobile = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);

    window.addEventListener('resize', () => {
      const mobile = /Mobi|Android/i.test(navigator.userAgent);
      setIsMobile(mobile || window.innerWidth < 768);
    });

    window.addEventListener('load', () => {
      const mobile = /Mobi|Android/i.test(navigator.userAgent);
      setIsMobile(mobile || window.innerWidth < 768);
    });

    return () => {
      window.removeEventListener('resize', () => {
        const mobile = /Mobi|Android/i.test(navigator.userAgent);
        setIsMobile(mobile || window.innerWidth <= 768);
      });

      window.removeEventListener('load', () => {
        const mobile = /Mobi|Android/i.test(navigator.userAgent);
        setIsMobile(mobile || window.innerWidth <= 768);
      });
    };
  }, []);

  useEffect(() => {
    reset({ search: user?.search });
  }, [user?.search]);

  useEffect(() => {
    handleClear();
  }, [path]);

  if (path.startsWith('/admin')) {
    return null;
  }

  return (
    <div className='w-full h-max py-2 flex flex-row justify-between items-center px-5 md:px-7 lg:px-[33px] relative'>
      <div
        className={classNames(
          'flex flex-row justify-center items-center transition-opacity duration-300 ease-out w-max gap-5',
          isSearch ? 'fade-out' : 'opacity-100'
        )}>
        <button
          type='button'
          onClick={toggle}
          className={classNames(
            'flex flex-row justify-center items-center',
            isMobile ? 'hidden' : 'block'
          )}>
          <Bars2Icon className='w-6 h-6 text-gray-600' />
        </button>
        <Link
          href='/'
          className='min-w-max h-full'>
          <Image
            width={80}
            height={80}
            src='/logo-word.svg'
            alt='logo'
            loading='eager'
            className=' object-contain text-black flex justify-center items-center md:w-20 lg:w-36'
          />
        </Link>
      </div>
      {isMobile ? (
        <>
          <div
            className={classNames(
              'flex flex-row justify-center items-center gap-2 transition-opacity duration-300 ease-out absolute top-0 left-0 w-full h-full bg-white px-5',
              isSearch ? 'fade-in z-50' : 'opacity-0 -z-10 pointer-events-none'
            )}>
            {isSearchPath && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-row justify-center items-center focus:border focus:border-purple border border-purple rounded-md gap-2 w-full'>
                <XMarkIcon
                  onClick={handleClear}
                  className='w-6 h-6 text-black ml-2 cursor-pointer'
                />
                <input
                  type='text'
                  {...register('search', { required: true })}
                  id='search'
                  placeholder='Qidirish'
                  className={classNames(
                    'w-full h-10 px-2 py-1 rounded-l-md placeholder-purple focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent'
                  )}
                />
                <span className='h-6 flex border-[1px] border-purple-light' />
                <button
                  type='submit'
                  className={classNames(
                    'flex justify-center items-center w-max h-10 px-2 py-1'
                  )}>
                  <MagnifyingGlassIcon className='w-6 h-6 text-purple' />
                </button>
              </form>
            )}
          </div>
          <div className='w-max flex flex-row justify-center items-center gap-2 transition-opacity duration-300 ease-out'>
            <button
              className={classNames(
                'w-full h-8 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent',
                isSearch ? 'fade-out' : 'opacity-100',
                isMobile ? 'block' : 'hidden'
              )}
              onClick={() => setIsSearch(true)}>
              <MagnifyingGlassIcon className='w-6 h-6 text-gray-600' />
            </button>
            {isAuthenticated ? (
              <div className='w-full'>
                <div
                  // href='/profile'
                  onClick={() => setIsDropdown(!isDropdown)}
                  className='flex items-center gap-2 bg-white hover:bg-gray-50 relative'>
                  {user?.image ? (
                    <Image
                      id='avatarButton'
                      role='button'
                      data-dropdown-toggle='userDropdown'
                      data-dropdown-placement='bottom-start'
                      alt='avatar'
                      width={80}
                      height={80}
                      loading='eager'
                      src={`${process.env.NEXT_PUBLIC_URL}${user?.image}`}
                      className='h-8 w-8 md:w-12 lg:w-14 md:h-12 lg:h-14 rounded-full object-cover'
                    />
                  ) : (
                    <div className='h-8 w-8 md:w-12 lg:w-14 md:h-12 lg:h-14 rounded-full flex flex-row justify-center items-center border border-purple-500 bg-gray-100'>
                      {user?.firstName?.[0] || ''}
                      {user?.lastName?.[0] || ''}
                    </div>
                  )}
                  {isDropdown && (
                    <div className='absolute top-12 md:top-14 lg:top-16 right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 '>
                      <div className='px-4 py-3 text-sm text-gray-900'>
                        <h1 className='text-sm md:text-base lg:text-lg'>
                          {user?.firstName} {user?.lastName}
                        </h1>
                        <div className='font-medium truncate'>
                          {user?.email}
                        </div>
                      </div>
                      <ul
                        className='py-2 text-sm text-gray-700 !list-none'
                        aria-labelledby='avatarButton'>
                        <li>
                          <Link
                            href='/profile?tab=1'
                            className='block px-4 py-2 hover:bg-gray-100 '>
                            Profil
                          </Link>
                        </li>
                        <li>
                          <a
                            href='#'
                            className='block px-4 py-2 hover:bg-gray-100'>
                            Sozlamalar
                          </a>
                        </li>
                      </ul>
                      <div className='py-1'>
                        <button
                          type='button'
                          onClick={logout}
                          className='block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left'>
                          Chiqish
                        </button>
                      </div>
                    </div>
                  )}
                  {/* {!isMobile && (
                    <div>
                      <p className='text-base'>
                        <strong className='block font-medium'>
                          {user?.firstName}
                        </strong>

                        <span> {user?.lastName}</span>
                      </p>
                    </div>
                  )} */}
                </div>
              </div>
            ) : (
              <>
                <Link
                  href='/profile'
                  className={classNames('w-full h-8 px-2 py-1 rounded-md')}>
                  <UserIcon className='w-6 h-6 text-gray-600' />
                </Link>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className='w-1/3 flex flex-row justify-center items-center'>
            {isSearchPath && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-row justify-center items-center focus:border focus:border-purple border border-opacity-30 border-purple rounded-md gap-2 w-full'>
                <button
                  type='submit'
                  className=' flex justify-center items-center w-max h-10 px-2 py-1'>
                  <MagnifyingGlassIcon className='w-6 h-6 text-purple cursor-pointer' />
                </button>
                <span className='h-6 flex border-[1px] border-purple-light' />
                <input
                  type='text'
                  id='search'
                  {...register('search', { required: true })}
                  placeholder='Qidirish'
                  className={classNames(
                    'w-full h-10 px-2 py-1 rounded-r-md placeholder-purple focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent font-thin'
                  )}
                />
                {user?.search && (
                  <XMarkIcon
                    onClick={handleClear}
                    className='w-6 h-6 text-black mr-2 cursor-pointer'
                  />
                )}
              </form>
            )}
          </div>
          <div className='w-fit h-max flex flex-row justify-center items-center gap-3'>
            {isAuthenticated ? (
              <div className='w-full'>
                <div
                  // href='/profile'
                  onClick={() => setIsDropdown(!isDropdown)}
                  className='flex items-center gap-2 bg-white hover:bg-gray-50 relative'>
                  {user?.image ? (
                    <Image
                      id='avatarButton'
                      role='button'
                      data-dropdown-toggle='userDropdown'
                      data-dropdown-placement='bottom-start'
                      alt='avatar'
                      width={80}
                      height={80}
                      loading='eager'
                      src={`${process.env.NEXT_PUBLIC_URL}${user?.image}`}
                      className='h-10 w-10 md:w-12 lg:w-14 md:h-12 lg:h-14 rounded-full object-cover'
                    />
                  ) : (
                    <div className='w-10 h-10 rounded-full flex flex-row justify-center items-center border border-purple-500 bg-gray-100'>
                      {user?.firstName?.[0] || ''}
                      {user?.lastName?.[0] || ''}
                    </div>
                  )}
                  {isDropdown && (
                    <div className='absolute top-16 right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 '>
                      <div className='px-4 py-3 text-sm text-gray-900'>
                        <h1 className='text-sm md:text-base lg:text-lg'>
                          {user?.firstName} {user?.lastName}
                        </h1>
                        <div className='font-medium truncate'>
                          {user?.email}
                        </div>
                      </div>
                      <ul
                        className='py-2 text-sm text-gray-700 !list-none'
                        aria-labelledby='avatarButton'>
                        <li>
                          <Link
                            href='/profile?tab=1'
                            className='block px-4 py-2 hover:bg-gray-100 '>
                            Profil
                          </Link>
                        </li>
                        <li>
                          <Link
                            href='/profile/edit'
                            className='block px-4 py-2 hover:bg-gray-100'>
                            Sozlamalar
                          </Link>
                        </li>
                      </ul>
                      <div className='py-1'>
                        <button
                          type='button'
                          onClick={logout}
                          className='block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left'>
                          Chiqish
                        </button>
                      </div>
                    </div>
                  )}
                  {/* {!isMobile && (
                    <div>
                      <p className='text-base'>
                        <strong className='block font-medium'>
                          {user?.firstName}
                        </strong>

                        <span> {user?.lastName}</span>
                      </p>
                    </div>
                  )} */}
                </div>
              </div>
            ) : (
              <>
                <Link
                  href='/signin'
                  className='w-max flex flex-row flex-nowrap justify-center items-center h-max px-2 rounded-md border border-purple text-purple gap-2 py-2 whitespace-nowarp'>
                  <LockOpenIcon
                    className='w-6 h-6'
                    strokeWidth={2.5}
                  />
                  <span className='h-6 border border-purple-light' />
                  <p className='w-full flex flex-row whitespace-nowrap'>
                    Tizimga kirish
                  </p>
                </Link>
                <Link
                  href='/signup'
                  className='w-max flex flex-row flex-nowrap justify-center items-center h-max px-2 rounded-md bg-purple text-white gap-2 py-2 whitespace-nowarp'>
                  <BoltIcon
                    className='w-6 h-6'
                    strokeWidth={2.5}
                  />
                  <span className='h-6 border border-white opacity-40' />
                  <p className='w-full flex flex-row whitespace-nowrap'>
                    Ro{"'"}yxatdan o{"'"}tish
                  </p>
                </Link>
              </>
            )}
          </div>
        </>
      )}
      {/* {isMobile ? (

      ) : (

      )} */}
    </div>
  );
}
