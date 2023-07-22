'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import Modal from '@/components/modal/modal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Select from '@/components/form/select/select';
import Input from '@/components/form/input/input';
import File from '@/components/form/input/file-input';
import { useForm } from 'react-hook-form';
import {
  CalendarDaysIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { PencilIcon, UserIcon, TagIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import { convertDate } from '@/helper';
import 'react-datepicker/dist/react-datepicker.css';

function UpdateContest(props: Record<string, any>) {
  const apiUrl = '/api/contests';
  const modal = useModal();
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const { register, handleSubmit, watch, reset } = useForm();
  const router = useRouter();
  const file = watch('image');

  const mutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance(`${apiUrl}/${props?.id}`, {
        data,
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    {
      onSuccess: () => {
        toast.success("Kontest o'zgartirildi");
        modal.hide();
        queryClient.invalidateQueries();
        router.push('/admin/dg-contest');
      },
      onError: () => {
        toast.error('Xatolik');
      },
    }
  );

  const onSubmit = (data: Record<string, any>) => {
    mutation.mutate({
      name: data?.name,
      description: data?.description,
      startdate: convertDate(startDate as Date),
      enddate: convertDate(endDate as Date),
      formfile: file?.[0],
    });
  };

  useEffect(() => {
    reset({ ...props });
  }, [props]);

  useEffect(() => {
    if (props?.startdate) {
      const start = props?.startdate.split(/[.: ]/);
      const [day, month, year, hour, minutes] = start;
      const isoDateString = `${year}-${month}-${day}T${hour}:${minutes}`;
      const date = new Date(isoDateString);
      setStartDate(date);
    }
    if (props?.enddate) {
      const end = props?.startdate.split(/[.: ]/);
      const [day, month, year, hour, minutes] = end;
      const isoDateString = `${year}-${month}-${day}T${hour}:${minutes}`;
      const date = new Date(isoDateString);
      setEndDate(date);
    }
  }, [props]);

  return (
    <Modal modal={modal}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full h-full flex flex-col justify-start items-start gap-3 px-5 py-10'>
        <div className='w-full  flex flex-col justify-start items-start gap-3'>
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
            label='Rasm'
            register={register('image')}
          />
          <button
            type='submit'
            className='text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
            O{"'"}zgartirish
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default NiceModal.create(UpdateContest);
