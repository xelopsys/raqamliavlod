'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import Select from '@/components/form/select/select';
import Input from '@/components/form/input/input';
import File from '@/components/form/input/file-input';
import { useForm } from 'react-hook-form';
import useAuth from '@/hooks/use-auth';
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
import { Listbox } from '@headlessui/react';

const people = [
  { id: 1, name: 'Oson', unavailable: false },
  { id: 2, name: "O'rta", unavailable: false },
  { id: 3, name: 'Qiyin', unavailable: false },
  { id: 4, name: 'Murakkab', unavailable: false },
];

export default function CreateContest() {
  const courseUrl = '/api/problemsets';
  const { register, handleSubmit, watch } = useForm();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selected, setselected] = useState<Record<string, any>>();
  const [selectedcontest, setselectedcontest] = useState<Record<string, any>>();

  const mutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.post(courseUrl, data);
    },
    {
      onSuccess: () => {
        toast.success('Masala yaratildi');
        queryClient.invalidateQueries();
        router.push('/admin/dg-contest/problemsets');
      },
      onError: () => {
        toast.error('Masala yaratilmadi');
      },
    }
  );

  const { data, isFetching } = useQuery(['contests-problem'], () => {
    return axiosinstance.get('/api/contests');
  });

  const onSubmit = (data: Record<string, any>) => {
    mutation.mutate({
      ...data,
      type: selected?.name,
      contestid: selectedcontest?.id,
      userid: user?.id,
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
              htmlFor='definition'>
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
                id='definition'
                className='w-full h-auto text-sm md:text-md lg:text-lg bg-transparent min-h-[48px] px-3 py-3 rounded-xl focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-600 text-gray-900'
                {...register('definition')}
              />
            </span>
          </section>
        </div>
        <Listbox
          value={selected}
          onChange={setselected}
          as='div'
          className='w-full h-auto min-h-[48px] relative z-50'>
          <label
            htmlFor=''
            className='text-sm md:text-base lg:text-lg font-semibold'>
            Qiyinlik turi
          </label>
          <Listbox.Button className='w-full  text-left bg-gray-200 h-auto text-base min-h-[48px] px-3 py-3 rounded-xl focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-600 text-gray-900'>
            {selected?.name || 'Qiyinlik turi'}
          </Listbox.Button>
          <div className='w-full h-max absolute z-50 '>
            <Listbox.Options className='w-full flex flex-col justify-start items-start px-2 py-2 rounded-xl bg-gray-100 border !list-none gap-3 text-base'>
              {people.map((item) => (
                <Listbox.Option
                  key={item.id}
                  value={item}
                  className='hover:bg-gray-200 w-full flex flex-row justify-start items-center gap-3 px-3 py-2 rounded-xl text-base'
                  disabled={item.unavailable}>
                  {item.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
        <section className='w-full flex flex-col justify-start items-start gap-1'>
          <label
            className='w-full text-sm md:text-md lg:text-lg flex flex-row justify-start items-center text-black font-semibold'
            htmlFor='inputdefinition'>
            Kiruvchi ma{"'"}lumotlari
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
              id='inputdefinition'
              className='w-full h-auto text-sm md:text-md lg:text-lg bg-transparent min-h-[48px] px-3 py-3 rounded-xl focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-600 text-gray-900'
              {...register('inputdefinition')}
            />
          </span>
        </section>
        <section className='w-full flex flex-col justify-start items-start gap-1'>
          <label
            className='w-full text-sm md:text-md lg:text-lg flex flex-row justify-start items-center text-black font-semibold'
            htmlFor='outputdefinition'>
            Chiquvchi ma{"'"}lumotlari
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
              id='outputdefinition'
              className='w-full h-auto text-sm md:text-md lg:text-lg bg-transparent min-h-[48px] px-3 py-3 rounded-xl focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-600 text-gray-900'
              {...register('outputdefinition')}
            />
          </span>
        </section>
        <div className='w-full flex gap-3'>
          <Input
            type='text'
            id='difficulty'
            placeholder='Qiyinlik darajasi'
            required
            Icon={PencilIcon}
            label='Qiyinlik darajasi'
            register={register('difficulty', { required: true })}
          />
          <Input
            type='text'
            id='memorylimit'
            placeholder='Xotira joyi'
            required
            Icon={PencilIcon}
            label='Xotira joyi'
            register={register('memorylimit', { required: true })}
          />
        </div>
        <div className='w-full flex gap-3'>
          <Input
            type='text'
            id='timelimit'
            placeholder='Vaqt chegarasi'
            required
            Icon={PencilIcon}
            label='Vaqt chegarasi'
            register={register('timelimit', { required: true })}
          />
          <Listbox
            value={selectedcontest}
            onChange={setselectedcontest as any}
            as='div'
            className='w-full h-auto min-h-[48px] relative z-50'>
            <label
              htmlFor=''
              className='text-sm md:text-base lg:text-lg font-semibold'>
              Kontest
            </label>
            <Listbox.Button className='w-full  text-left bg-gray-200 h-auto text-base min-h-[48px] px-3 py-3 rounded-xl focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-600 text-gray-900'>
              {selectedcontest?.name || 'Kontest'}
            </Listbox.Button>
            <div className='w-full absolute min-h-[100px] h-full max-h-[250px] z-50 overflow-hidden'>
              <Listbox.Options className='w-full h-full flex flex-col justify-start items-start px-2 py-2 rounded-xl bg-gray-100 border !list-none gap-3 text-base overflow-y-scroll scrollbar-none'>
                {data?.data?.data.map((item: Record<string, any>) => (
                  <Listbox.Option
                    key={item.id}
                    value={item}
                    className='hover:bg-gray-200 w-full flex flex-row justify-start items-center gap-3 px-3 py-2 rounded-xl text-base'>
                    {item?.name || 'Kontest'}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
        <button
          type='submit'
          className='text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
          Yaratish
        </button>
      </div>
    </form>
  );
}
