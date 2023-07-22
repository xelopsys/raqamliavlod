'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axiosinstance from '@/utility/axiosinstance';
import useAuth from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
  CameraIcon,
  LockOpenIcon,
  PhoneIcon,
  GlobeAltIcon,
  UserIcon,
  AcademicCapIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  LockClosedIcon,
  AtSymbolIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { classNames, unformatPhoneNumber } from '@/helper';
import { ObjectToFormData } from '@/helper';
import Image from 'next/image';
import Input from '@/components/form/input/input';
import PhoneInput from '@/components/form/input/phone';
import Select from '@/components/form/select/select';
import { countries } from '@/data/countries';
import Link from 'next/link';

export default function SignInScreen() {
  const apiUrl = '/api/users';
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { handleSubmit, register, watch, reset, control, setValue } = useForm();
  const [image, setImage] = useState('');
  const file = watch('image');

  const mutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.post(apiUrl, ObjectToFormData(data));
    },
    {
      onSuccess: (data) => {
        toast.success('Kirishga jo`natilyapti...');
        router.push(`/signin?email=${data?.data?.email}`);
      },
      onError: (error: Error | any) => {
        toast.error(
          error?.response?.data?.Message || error?.message || 'error'
        );
      },
    }
  );

  const onSubmit = (form: Record<string, any>) => {
    console.log(form);
    // mutation.mutate({ ...form, image: form?.image?.[0] || null });
  };

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
    reset();
  }, []);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full h-max md:w-fit lg:w-fit max-w-full min-w-fit flex flex-col justify-start md:justify-center lg:justify-center items-start overflow-y-scroll scrollbar-none rounded-lg bg-white gap-5 p-5 md:p-8 lg:p-10 box-border'>
        <h1 className='w-full text-lg md:text-lg lg:text-2xl font-semibold text-left '>
          Xush kelibsiz!
        </h1>
        <div className='w-full h-fit flex flex-col md:flex-row lg:flex-row justify-start md:justify-evenly lg:justify-evenly items-start gap-10'>
          <div className='w-full h-max md:w-1/3 lg:w-1/3 flex flex-col justify-start items-start gap-4'>
            <Input
              Icon={UserIcon}
              label='Ismingiz'
              placeholder='Ismingiz'
              register={register('firstname')}
            />
            <Input
              Icon={UserIcon}
              label='Familiyangiz'
              placeholder='Familiyangiz'
              register={register('lastname')}
            />
            <Input
              Icon={EnvelopeIcon}
              label='Email'
              required
              placeholder='Email'
              register={register('email', { required: true })}
            />
            <Input
              Icon={AtSymbolIcon}
              label='Taxallus'
              placeholder='Taxallus'
              register={register('username')}
            />
          </div>
          <div className='w-full h-max md:w-1/3 lg:w-1/3 flex flex-col justify-start items-start gap-4 '>
            <Input
              Icon={BuildingOfficeIcon}
              label="O'qish joyingiz"
              placeholder="O'qish joyingiz"
              register={register('studyplace')}
            />
            <Input
              Icon={AcademicCapIcon}
              label='Kurs yoki sinf'
              placeholder='Kurs yoki sinf'
              register={register('grade')}
            />
            <Input
              Icon={LockClosedIcon}
              label='Parol'
              required
              placeholder='Parol'
              register={register('password', { required: true })}
            />
            <PhoneInput
              control={control}
              Icon={PhoneIcon}
              label='Telefon raqamingiz'
              placeholder='(xx) xxx-xx-xx'
              register={register('phone')}
              name='phone'
              inputMode='tel'
              {...{
                onAccept: (value: string | number | unknown) => {
                  setValue(
                    'phone',
                    unformatPhoneNumber((value as string) || undefined)
                  );
                },
                inputRef,
              }}
            />
          </div>

          <div className='w-full h-max md:w-1/3 lg:w-1/3 order-1 md:order-1 lg:order-2 flex flex-col flex-nowrap justify-start items-start gap-2'>
            <h1 className='flex whitespace-nowrap text-base md:text-md lg:text-lg font-semibold'>
              Profil suratingiz
            </h1>
            <p className='text-sm'>
              Rasm hajmi 5MB dan oshmasligi va JPG yoki PNG fayl kengaytmasida
              bo{"'"}lishi zarur.
            </p>
            <label
              htmlFor='image'
              className={classNames(
                'break-words text-left md:text-right lg:text-right w-20 h-20 bg-blue-light rounded-full flex flex-row justify-center items-center'
              )}>
              {file?.[0] ? (
                image ? (
                  <>
                    <Image
                      src={image as string}
                      width={300}
                      height={300}
                      quality={1}
                      className='w-full h-full object-cover rounded-full'
                      alt='avatar'
                    />
                  </>
                ) : (
                  <span>
                    {"'"}Uploading...{"'"}
                  </span>
                )
              ) : (
                <CameraIcon
                  width={20}
                  className='text-blue'
                />
              )}
            </label>
            <input
              id='image'
              {...register('image')}
              placeholder='Kurs yoki sinf'
              type='file'
              accept='image/*'
              className='hidden'
            />
            {/* <Select
              selectList={countries?.map((item, index) => ({
                id: item.label,
                name: item.label,
              }))}
              Icon={GlobeAltIcon}
              label='Davlat'
              placeholder='Davlat'
              register={register('country', { required: true })}
            /> */}
            {/* <section>
              <input
                id='male'
                register={register('gender')}
                type='radio'
                className='hidden peer'
              />
              <label
                htmlFor='male'
                className='w-20 h-10 py-2 px-5 text-gray-600 peer-checked:border-2 peer-checked:border-green peer-checked:text-green rounded-xl'>
                Erkak
              </label>
            </section>
            <section>
              <input
                id='female'
                register={register('gender')}
                type='radio'
                className='hidden peer'
              />
              <label
                htmlFor='female'
                className='w-20 h-10 py-2 px-5 text-gray-600 font-semibold peer-checked:border-2 peer-checked:border-purple peer-checked:text-purple rounded-xl'>
                Ayol
              </label>
            </section> */}
          </div>
        </div>
        <button
          type='submit'
          disabled={mutation.isLoading}
          className='w-max rounded-lg py-2 px-5 bg-blue text-sm md:text-md lg:text-lg text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white hover:text-blue hover:ring-2 hover:ring-blue'>
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
              Kirishga jo`natilyapti...
            </>
          ) : (
            <span className='flex flex-row justify-center items-center gap-3'>
              <LockOpenIcon
                width={20}
                strokeWidth={2.5}
                className='w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7'
              />
              Ro{"'"}yxatdan o{"'"}tish
            </span>
          )}
        </button>
        <hr className='mr-auto w-full my-3' />
        <p className='text-sm md:text-base lg:text-lg font-normal text-gray-600'>
          Hisobingiz bormi?
          <Link
            href='/signin'
            className='text-blue underline hover:text-blue-500 transition-all ml-1'>
            Tizimga kiring
          </Link>
        </p>
      </form>
    </>
  );
}
