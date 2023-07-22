'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import useAuth from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { CameraIcon } from '@heroicons/react/24/outline';
import TextArea from '@/components/textarea/textarea';
import { classNames } from '@/helper';
import { ObjectToFormData } from '@/helper';
import { TObject } from '@/types';

export default function CreatePostScreen() {
  const apiUrl = '/api/documentation';
  const tagsUrl = '/api/doctag';
  const tagName = 'tags-table';
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { handleSubmit, register, watch, reset } = useForm();
  const [image, setImage] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [text, setText] = useState<any>();
  const [tagsData, setTagsData] = useState<Record<string, any>[]>([]);
  const [activeTags, setActiveTagsData] = useState<Record<string, any>[]>([]);

  const file = watch('formfile');

  const { data: tags, refetch: refetchTag } = useQuery([tagName], async () => {
    return await axiosinstance.get(tagsUrl);
  });

  const mutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance(apiUrl, {
        data,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    {
      onSuccess: (data) => {
        toast.success(
          'Maqola adminga jo`natildi! Boshqa maqolalarni o`qib turing.'
        );
        router.push('/blog');
      },
      onError: (error: Error | any) => {
        toast.error(
          error?.response?.data?.Message || error?.message || 'error'
        );
      },
    }
  );

  const handleText = (value: any) => {
    setText(value);
  };

  const onSubmit = (form: Record<string, any>) => {
    console.log(form);
    mutation.mutate({
      ...form,
      formfile: file?.[0] || null,
      tagids: activeTags?.map((item) => item?.id),
      text: JSON.stringify(text),
    });
  };

  const handleShowTags = () => {
    setShowMore(!showMore);
  };

  const handleTags = (tag: Record<string, any>) => {
    if (activeTags?.find((item) => item?.id === tag?.id)) {
      setActiveTagsData(activeTags?.filter((item) => item?.id !== tag?.id));
    } else {
      setActiveTagsData([...activeTags, tag]);
    }
  };

  useEffect(() => {
    setTagsData(showMore ? tags?.data : tags?.data?.slice(0, 3));
  }, [tags, showMore]);

  useEffect(() => {
    const reader = new FileReader();
    const load = async () => {
      await reader.readAsDataURL(new Blob([file?.[0]], { type: 'image/*' }));
    };
    load();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
  }, [file]);

  useEffect(() => {
    refetchTag();
    reset();
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <div className='w-full lg:w-2/3 h-full flex flex-col justify-start items-center box-border gap-5 overflow-y-scroll scrollbar-none bg-white p-5 rounded-lg'>
          <div className='w-full flex flex-row justify-start items-start'>
            <div className='w-full flex flex-row justify-start items-center flex-wrap gap-3'>
              {tagsData?.map((tag: TObject, index: number) => {
                return (
                  <span
                    key={index}
                    className={classNames(
                      'py-2 px-6 rounded-md text-sm md:text-md lg:text-lg flex justify-center items-center cursor-pointer border',
                      activeTags?.find((item) => item?.id === tag?.id)
                        ? 'bg-green text-white'
                        : 'hover:border-none hover:bg-green hover:text-white'
                    )}
                    onClick={() => handleTags(tag)}>
                    {tag?.content}
                  </span>
                );
              })}
              <button
                type='button'
                onClick={handleShowTags}
                className='py-2 px-6 rounded-md border text-sm md:text-md lg:text-lg flex justify-center items-center hover:border-none hover:bg-green hover:text-white cursor-pointer'>
                {showMore ? '-' : '+'}
              </button>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='w-full flex flex-col justify-start items-start gap-y-3'>
            <div className='w-full h-max flex flex-col justify-start items-start gap-y-3 rounded-md'>
              <section className='w-full h-max flex flex-col md:flex-row lg:flex-row flex-nowrap justify-center items-center gap-x-4'>
                <input
                  id='title'
                  {...register('title', { required: true })}
                  placeholder='Sarlavha'
                  className='rounded-lg px-3 py-2 w-full outline-none'
                />
              </section>
              <section className='w-full h-max flex flex-col md:flex-row lg:flex-row flex-nowrap justify-center items-center gap-x-4'>
                <input
                  id='shortdescription'
                  {...register('shortdescription', { required: true })}
                  placeholder='Qisqacha'
                  className='rounded-lg px-3 py-2 outline-none w-full'
                />
              </section>
              {/* <section className="w-full h-max flex flex-col md:flex-row lg:flex-row flex-nowrap justify-center items-center gap-x-4">
								<textarea
									id="text"
									{...register("text", { required: true })}
									placeholder="Matn"
									className="rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
								/>
							</section> */}
              <div className='w-full h-max flex flex-col justify-start items-start gap-3'>
                <h1 className='w-full text-lg md:text-lg lg:text-xl text-gray-600 px-3'>
                  Maqola muqova rasmi:
                </h1>
                <section className='w-full h-max flex flex-col md:flex-row lg:flex-row flex-nowrap justify-center items-center gap-x-4'>
                  <div className='flex items-center justify-center w-full'>
                    <label
                      htmlFor='formfile'
                      className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  hover:bg-gray-50'>
                      {file?.[0] ? (
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
                            <span className='font-semibold'>
                              Yuklash uchun bosing
                            </span>
                          </p>
                          <p className='text-xs text-gray-500 '>
                            SVG, PNG, JPG yoki GIF
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                  <input
                    id='formfile'
                    {...register('formfile')}
                    type='file'
                    accept='image/*'
                    className='hidden'
                  />
                </section>
              </div>
              <div className='w-full flex flex-col justify-start items-start rounded-b-md relative z-0'>
                <h1 className='text-lg md:text-lg lg:text-lg text-gray-600 px-3'>
                  Maqola matni:
                </h1>
                <TextArea handleSubmitText={handleText} />
              </div>
            </div>
            <button
              disabled={mutation.isLoading || !text}
              className='w-full rounded-lg py-2 px-3 bg-purple-500 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white hover:text-purple-500 hover:ring-2 hover:ring-purple-50 sticky bottom-0 z-50'>
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
                  Yaratilyapti...
                </>
              ) : (
                'Maqolani yuborish'
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className='w-full h-full flex flex-row justify-center items-center'>
          <h1 className='text-sm md:text-md lg:text-lg text-center'>
            Maqola yaratish uchun siz ro{'`'}yxatdan o{'`'}tishingiz kerak yoki
            tizimga kirishingiz kerak
          </h1>
        </div>
      )}
    </>
  );
}
