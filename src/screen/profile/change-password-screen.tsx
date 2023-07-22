'use client';

import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import {
  LockOpenIcon,
  LockClosedIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import useAuth from '@/hooks/use-auth';
import Image from 'next/image';
import Input from '@/components/form/input/input';
import Link from 'next/link';

export default function ChangePasswordScreen() {
  const apiUrl = '/api/users/password';
  const { user } = useAuth();
  const router = useRouter();
  const { handleSubmit, register } = useForm();

  const mutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.patch(`${apiUrl}/${user?.id}`, data);
    },
    {
      onSuccess: () => {
        toast.success("Parol o'zgartirildi");
        router.push('/profile');
      },
      onError: () => {
        toast.error('Xatolik yuz berdi');
      },
    }
  );

  const onSubmit = (form: Record<string, any>) => {
    mutation.mutate(form);
    console.log(form);
  };

  return (
    <div className='w-full h-full flex flex-col justify-center items-center md:p-10 lg:p-14 overflow-scroll scrollbar-none gap-4'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full h-max md:w-1/3 lg:w-1/4 min-w-fit flex flex-col justify-center items-start rounded-lg bg-white p-5 md:p-6 lg:p-8 gap-3'>
        <h1 className='w-full text-base md:text-lg lg:text-2xl font-semibold text-left '>
          Parolni o{"'"}zgartirish
        </h1>
        {/* <p className='w-full text-left text-base text-gray-600'>
          Raqamli Avlod dasturiga xush kelibsiz!
        </p> */}
        <span className='rounded-md border-2 border-blue px-3 py-2'>
          <LockClosedIcon
            width={20}
            className='w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-blue'
            strokeWidth={2.5}
          />
        </span>
        <Input
          disabled={mutation.isLoading}
          label='Eski parol'
          type='password'
          id='oldpassword'
          required
          placeholder='Parol'
          register={register('oldpassword', { required: true })}
          Icon={LockClosedIcon}
        />
        <Input
          disabled={mutation.isLoading}
          label='Yangi parol'
          type='password'
          id='newpassword'
          required
          placeholder='Parol'
          register={register('newpassword', { required: true })}
          Icon={LockClosedIcon}
        />
        {/* <section>
          <Image
            width={100}
            height={100}
            className="w-26 md:w-full lg:w-full h-26 md:h-full lg:h-full"
            alt="profile"
            src="/profile.png"
          />
        </section> */}
        {/* <section className="w-full h-max flex flex-col md:flex-row lg:flex-row flex-nowrap justify-center items-center gap-x-4">
          <label
            htmlFor="email"
            className="break-words w-full text-left md:text-right lg:text-right"
          >
            Email or Username
          </label>
          <input
            id="email"
            {...register("email", { required: true })}
            placeholder="email"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue w-full"
          />
        </section> */}
        {/* <section className="w-full h-max flex flex-col md:flex-row lg:flex-row justify-center items-center gap-x-4">
          <label
            htmlFor="password"
            className="break-words w-full text-left md:text-right lg:text-right"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: true })}
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue"
          />
        </section> */}
        <button
          disabled={mutation.isLoading}
          type='submit'
          className='w-max rounded-lg py-2 px-5 bg-blue text-sm md:text-md lg:text-lg text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white hover:text-blue hover:ring-2 hover:ring-blue'>
          {mutation.isLoading ? (
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
              Bir oz kuting...
            </>
          ) : (
            <span className='flex flex-row justify-center items-center gap-3'>
              <LockOpenIcon
                width={20}
                strokeWidth={2.5}
                className='w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7'
              />
              O{"'"}zgartirish
            </span>
          )}
        </button>
        {/* <hr className='mx-auto w-2/3 my-3' /> */}
        {/* <p className='text-sm md:text-base lg:text-lg font-normal text-gray-600'>
          Yoki,{' '}
          <Link
            href='/settings'
            className='text-blue underline hover:text-blue-500 transition-all'>
            parolingizni unutdingizmi?
          </Link>
        </p> */}
      </form>
      {/* <section className='w-full flex flex-row justify-center items-center gap-2'>
        <span className='text-gray-600'>
          <p className='text-sm md:text-base lg:text-lg'>
            Hisobingiz yo{"'"}qmi?
          </p>
        </span>
        <Link
          href='/signup'
          className='text-blue hover:text-blue-500 transition-all underline'>
          <p className='text-sm md:text-base lg:text-lg'>
            Ro{"'"}yxatdan o{"'"}ting
          </p>
        </Link>
      </section> */}
    </div>
  );
}
