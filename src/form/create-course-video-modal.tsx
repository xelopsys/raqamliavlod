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

function CreateCourseVideo(props: Record<string, any>) {
  const courseCategories = '/api/courses/videos';
  const modal = useModal();
  const queyrClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const mutation = useMutation(
    (data: Record<string, any>) => axiosinstance.post(courseCategories, data),
    {
      onSuccess: () => {
        queyrClient.invalidateQueries();
        toast.success("Video qo'shildi");
        modal.hide();
      },
      onError: () => {
        toast.error('Xatolik');
      },
    }
  );

  const onSubmit = (data: Record<string, any>) => {
    mutation.mutate({ courseId: props?.id, ...data });
  };
  return (
    <Modal modal={modal}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full min-h-[120px] flex flex-col py-10 px-5 gap-3'>
        <div className='w-full flex flex-col justify-center items-center gap-3'>
          <Input
            type='text'
            id='link'
            placeholder='Link'
            required
            Icon={PencilIcon}
            label='Link'
            register={register('link', { required: true })}
          />
        </div>
        <button
          type='submit'
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
          Qo{"'"}shish
        </button>
      </form>
    </Modal>
  );
}

export default NiceModal.create(CreateCourseVideo);
