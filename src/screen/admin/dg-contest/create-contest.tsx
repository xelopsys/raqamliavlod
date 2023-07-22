'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import Select from '@/components/form/select/select';
import Input from '@/components/form/input/input';
import File from '@/components/form/input/file-input';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  PencilIcon,
  UserIcon,
  TagIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { convertDate } from '@/helper';

export default function CreateContest() {
  const courseUrl = '/api/contests';
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const { register, handleSubmit, watch } = useForm();
  const router = useRouter();
  const file = watch('image');

  const mutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.post(courseUrl, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    {
      onSuccess: () => {
        toast.success('Kontest yaratildi');
        router.push('/admin/dg-contest');
      },
      onError: () => {
        toast.error('Kontest yaratilmadi');
      },
    }
  );

  const onSubmit = (data: Record<string, any>) => {
    if (!startDate || !endDate) return toast.error('Sana kiritilmadi');
    mutation.mutate({
      name: data?.name,
      description: data?.description,
      formfile: file?.[0],
      startdate: convertDate(startDate as Date),
      enddate: convertDate(endDate as Date),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full h-full flex flex-col justify-start items-start gap-3'>
      <div className='w-full h-auto min-h-max md:w-2/3 lg:w-1/2 flex flex-col justify-start items-start gap-3'>
        <div className='w-full flex gap-3'>
          <Input
            type='text'
            id='name'
            placeholder='Nomi'
            required
            Icon={PencilIcon}
            label='Nomi'
            register={register('name', { required: true })}
          />
          <section className='w-full flex flex-col justify-start items-start gap-1'>
            <label
              className='w-full text-sm md:text-md lg:text-lg flex flex-row justify-start items-center text-black font-semibold'
              htmlFor='description'>
              Batafsil
            </label>
            <span
              className='w-full  px-3 flex flex-row justify-start items-center rounded-xl gap-1'
              style={{
                background: 'rgba(61, 103, 173, 0.1)',
              }}>
              <DocumentTextIcon
                width={20}
                className='text-blue'
                style={{
                  strokeWidth: 2.5,
                }}
              />
              <textarea
                id='description'
                className='w-full h-auto text-sm md:text-md lg:text-lg bg-transparent min-h-[48px] px-3 py-3 rounded-xl focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-600 text-gray-900'
                {...register('description')}
              />
            </span>
          </section>
        </div>
        <div className='w-full flex gap-3 flex-nowrap overflow-hidden box-border'>
          <label
            htmlFor='startDate'
            className='rounded-xl w-full max-w-full bg-gray-100 border-2 flex flex-row justify-start items-center gap-2 px-2'>
            <CalendarDaysIcon
              width={20}
              strokeWidth={2}
              className='text-blue'
            />
            <DatePicker
              selected={startDate}
              id='startDate'
              placeholderText='Boshlanishi'
              onChange={(date) => setStartDate(date as Date)}
              selectsStart
              startDate={startDate}
              dateFormat='MMM dd yyyy hh:mm'
              showTimeSelect
              endDate={endDate}
              className='rounded-xl p-2 bg-transparent w-full outline-none text-sm md:text-base lg:text-lg'
            />
          </label>
          <label
            htmlFor='endDate'
            className='rounded-xl w-full max-w-full bg-gray-100 border-2 flex flex-row justify-start items-center gap-2 px-2'>
            <CalendarDaysIcon
              width={20}
              strokeWidth={2}
              className='text-blue'
            />
            <DatePicker
              selected={endDate}
              id='endDate'
              placeholderText='Tugashi'
              onChange={(date) => setEndDate(date as Date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat='MMM dd yyyy hh:mm'
              showTimeSelect
              className='rounded-xl p-2 bg-transparent w-full outline-none text-sm md:text-base lg:text-lg'
            />
          </label>
        </div>
        <File
          id='image'
          file={file?.[0]}
          placeholder='Rasm'
          required
          label='Rasm'
          register={register('image', { required: true })}
        />

        <button
          type='submit'
          className='text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
          Yaratish
        </button>
      </div>
    </form>
  );
}
