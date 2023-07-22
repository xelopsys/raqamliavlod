'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import Select from '@/components/form/select/select';
import Input from '@/components/form/input/input';
import File from '@/components/form/input/file-input';
import { useForm } from 'react-hook-form';
import NiceModal from '@ebay/nice-modal-react';
import { PencilIcon, UserIcon, TagIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import CreateCourseCategory from '@/form/create-course-category-modal';

export default function CreateCourse() {
  const courseUrl = '/api/courses';
  const categoryUrl = '/api/coursecategories';
  const categoryName = 'course-categories';
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const file = watch('image');

  const {
    data: categories,
    isFetching,
    refetch,
  } = useQuery([categoryName], () => {
    return axiosinstance.get(categoryUrl);
  });

  const mutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.post(courseUrl, data);
    },
    {
      onSuccess: () => {
        toast.success('Kurs yaratildi');
        router.push('/admin/courses');
      },
      onError: () => {
        toast.error('Kurs yaratilmadi');
      },
    }
  );

  const onSubmit = (data: Record<string, any>) => {
    mutation.mutate({ ...data, image: file?.[0] });
  };

  useEffect(() => {
    refetch();
  }, []);

  const showModal = {
    show: () => NiceModal.show(CreateCourseCategory),
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full h-full flex flex-col justify-start items-start gap-3'>
      <div className='w-full md:w-2/3 lg:w-1/2 flex flex-col justify-start items-start gap-3'>
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
          <Input
            type='text'
            id='author'
            placeholder='Muallif'
            required
            Icon={UserIcon}
            label='Muallif'
            register={register('author', { required: true })}
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
            id='playlisturl'
            placeholder='Muallif'
            required
            Icon={UserIcon}
            label='Muallif'
            register={register('playlisturl', { required: true })}
          />
        </div>
        <div className='w-full flex flex-col gap-2 justify-start items-center'>
          <Select
            selectList={
              categories?.data?.data?.map((item: Record<string, any>) => ({
                id: item?.id,
                name: item?.content,
              })) || []
            }
            id='categoryid'
            Icon={TagIcon}
            label='Kategoriya'
            placeholder='Kategoriya'
            register={register('categoryid')}
          />
          <button
            type='button'
            onClick={showModal.show}>
            <p className='text-base text-blue-500 underline'>
              Kategoriya yaratish
            </p>
          </button>
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
