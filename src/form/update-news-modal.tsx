'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import Modal from '@/components/modal/modal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Select from '@/components/form/select/select';
import Input from '@/components/form/input/input';
import File from '@/components/form/input/file-input';
import { useForm } from 'react-hook-form';
import { PencilIcon, UserIcon, TagIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

function UpdateNews(props: Record<string, any>) {
  const newsUrl = '/api/news';
  const modal = useModal();
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, reset } = useForm();
  const router = useRouter();
  const file = watch('image');

  const mutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance(`${newsUrl}/${props?.id}`, {
        data,
        method: 'PUT',
        params: { id: props?.id },
      });
    },
    {
      onSuccess: () => {
        toast.success("Yangilik o'zgartirildi");
        queryClient.invalidateQueries();
        modal.hide();
        router.push('/admin/news');
      },
      onError: () => {
        toast.error('Yangilik yaratilmadi');
      },
    }
  );

  const onSubmit = (data: Record<string, any>) => {
    mutation.mutate({ ...data, bannerform: file?.[0] });
  };

  useEffect(() => {
    reset({ ...props });
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
              id='title'
              placeholder='Sarlavha'
              required
              Icon={PencilIcon}
              label='Sarlavha'
              register={register('title', { required: true })}
            />
          </div>
          <File
            id='image'
            file={file?.[0]}
            placeholder='Rasm'
            required
            label='Rasm'
            register={register('image', { required: true })}
          />
          <div className='w-full flex gap-3'>
            <Input
              type='text'
              id='description'
              placeholder='Batafsil'
              Icon={PencilIcon}
              label='Batafsil'
              register={register('description')}
            />
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
            className='text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
            O{"'"}zgartirish
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default NiceModal.create(UpdateNews);
