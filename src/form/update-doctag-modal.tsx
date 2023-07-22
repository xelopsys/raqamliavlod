'use client';

import { useEffect } from 'react';
import Modal from '@/components/modal/modal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import Select from '@/components/form/select/select';
import Input from '@/components/form/input/input';
import { PencilIcon, TagIcon, UserIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import File from '@/components/form/input/file-input';

function UpdateCourseVideo(props: Record<string, any>) {
  const coursesUrl = '/api/doctag';
  const modal = useModal();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const mutation = useMutation(
    (data: Record<string, any>) =>
      axiosinstance(coursesUrl, {
        data,
        method: 'PUT',
        params: { id: props?.id, ...data },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast.success('Tag yangilandi');
        modal.hide();
      },
      onError: () => {
        toast.error('Xatolik');
      },
    }
  );

  const onSubmit = (data: Record<string, any>) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    reset({
      ...props,
    });
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
              id='content'
              placeholder='Nomi'
              required
              Icon={PencilIcon}
              label='Nomi'
              register={register('content', { required: true })}
            />
            <Input
              type='text'
              id='description'
              placeholder='Qisqacha'
              required
              Icon={PencilIcon}
              label='Qisqacha'
              register={register('description', { required: true })}
            />
          </div>
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

export default NiceModal.create(UpdateCourseVideo);
