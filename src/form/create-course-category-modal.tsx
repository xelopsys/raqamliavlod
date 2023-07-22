'use client';

import Modal from '@/components/modal/modal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import Select from '@/components/form/select/select';
import Input from '@/components/form/input/input';
import { PencilIcon, TagIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

function CreateCourseCategory() {
  const courseCategories = '/api/coursecategories';
  const modal = useModal();
  const queyrClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const mutation = useMutation(
    (data: Record<string, any>) => axiosinstance.post(courseCategories, data),
    {
      onSuccess: () => {
        queyrClient.invalidateQueries();
        toast.success('Kurs kategoriyasi yaratildi');
        modal.hide();
      },
      onError: () => {
        toast.error('Kurs kategoriyasi yaratilmadi');
      },
    }
  );

  const onSubmit = (data: Record<string, any>) => {
    mutation.mutate(data);
  };
  return (
    <Modal modal={modal}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full min-h-[120px] flex flex-col py-10 px-5 gap-3'>
        <div className='w-full flex flex-col justify-center items-center gap-3'>
          <Input
            type='text'
            id='content'
            placeholder='Nomi'
            required
            Icon={TagIcon}
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
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
          Yaratish
        </button>
      </form>
    </Modal>
  );
}

export default NiceModal.create(CreateCourseCategory);
