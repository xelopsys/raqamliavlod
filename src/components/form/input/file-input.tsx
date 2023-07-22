'use client';

import React, { InputHTMLAttributes, RefAttributes, SVGProps } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { UserIcon } from '@heroicons/react/24/outline';

interface IInput
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'name' | 'onBlur' | 'onChange'
  > {
  file?: File;
  label: string;
  register: UseFormRegisterReturn;
}

export default function Input({ label, register, file, ...props }: IInput) {
  const image = file ? URL.createObjectURL(file) : null;
  return (
    <section className='w-full h-max flex flex-col md:flex-row lg:flex-row flex-nowrap justify-center items-center gap-x-4'>
      <div className='flex items-center justify-center w-full'>
        <label
          htmlFor='file'
          className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  hover:bg-gray-50'>
          {file ? (
            image ? (
              <>
                <img
                  src={image as string}
                  width={40}
                  height={40}
                  className='w-full h-full object-cover rounded-md'
                  alt='avatar'
                />
              </>
            ) : (
              <span>
                {"'"}Yuklanyapti...{"'"}
              </span>
            )
          ) : (
            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
              <svg
                className='w-8 h-8 mb-4 text-gray-500'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 16'>
                <path
                  stroke='currentColor'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                />
              </svg>
              <p className='mb-2 text-sm text-gray-500'>
                <span className='font-semibold'>Yuklash uchun bosing</span>
              </p>
              <p className='text-xs text-gray-500 '>SVG, PNG, JPG yoki GIF</p>
            </div>
          )}
        </label>
      </div>
      <input
        {...register}
        {...props}
        id='file'
        type='file'
        className='hidden'
      />
    </section>
  );
}
