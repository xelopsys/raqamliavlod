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
  DocumentTextIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import { classNames, unformatPhoneNumber } from '@/helper';
import { ObjectToFormData } from '@/helper';
import Image from 'next/image';
import Input from '@/components/form/input/input';
import PhoneInput from '@/components/form/input/phone';
import Select from '@/components/form/select/select';
import { countries } from '@/data/countries';
import Link from 'next/link';

export default function EditProfileScreen() {
  const apiUrl = '/api/users';
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { handleSubmit, register, watch, reset, control, setValue } = useForm();
  const [image, setImage] = useState('');
  const { user, isAuthenticated, login } = useAuth();
  const file = watch('image');

  const mutation = useMutation(
    (data: Record<string, any>) => {
      return axiosinstance.put(`${apiUrl}/${user?.id}`, ObjectToFormData(data));
    },
    {
      onSuccess: (data) => {
        login({ ...data?.data });
        toast.success("Profil o'zgartirildi");
      },
      onError: (error: Error | any) => {
        toast.error(
          error?.response?.data?.Message || error?.message || 'error'
        );
      },
    }
  );

  const onSubmit = (form: Record<string, any>) => {
    console.log(form, 'file');
    mutation.mutate({ ...form, image: form?.image?.[0] || null });
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
    reset({
      firstname: user?.firstName,
      lastname: user?.lastName,
      email: user?.email,
      username: user?.email,
      status: user?.status,
      studyplace: user?.studyPlace,
      grade: user?.grade,
      telegram: user?.telegram,
      bio: user?.bio,
      country: user?.country,
      phone: `+998${user?.phone}`,
    });
  }, [user]);

  return (
    <div className='w-full h-full flex flex-col justify-start items-start md:justify-center md:items-center lg:justify-center lg:items-center md:p-10 lg:p-14 '>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full h-max md:w-fit lg:w-fit max-w-full min-w-fit flex flex-col justify-start md:justify-center lg:justify-center items-start overflow-y-scroll scrollbar-none rounded-lg bg-white gap-5 p-5 md:p-8 lg:p-10 box-border'>
        <h1 className='w-full text-lg md:text-lg lg:text-2xl font-semibold text-left '>
          Profilni yangilash
        </h1>
        <div className='w-full h-fit flex flex-col md:flex-row lg:flex-row justify-start md:justify-evenly lg:justify-evenly items-start gap-10'>
          <div className='w-full h-max md:w-1/3 lg:w-1/3 flex flex-col justify-start items-start gap-4'>
            <Input
              Icon={UserIcon}
              label='Ismingiz'
              placeholder='Ismingiz'
              register={register('firstname', { required: true })}
            />
            <Input
              Icon={UserIcon}
              label='Familiyangiz'
              required
              placeholder='Familiyangiz'
              register={register('lastname', { required: true })}
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
              register={register('username', { required: true })}
            />
            <Input
              Icon={BoltIcon}
              label='Bugungi shior'
              placeholder='shior'
              register={register('status', { required: true })}
            />
          </div>
          <div className='w-full h-max md:w-1/3 lg:w-1/3 flex flex-col justify-start items-start gap-4 '>
            <Input
              Icon={BuildingOfficeIcon}
              label="O'qish joyingiz"
              placeholder="O'qish joyingiz"
              register={register('studyplace', { required: true })}
            />
            <Input
              Icon={AcademicCapIcon}
              label='Kurs yoki sinf'
              placeholder='Kurs yoki sinf'
              register={register('grade', { required: true })}
            />
            <Input
              Icon={LockClosedIcon}
              label='Telegram'
              required
              placeholder='Telegram'
              register={register('telegram', { required: true })}
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

            <section className='w-full flex flex-col justify-start items-start gap-1'>
              <label
                className='w-full text-sm md:text-md lg:text-lg flex flex-row justify-start items-center text-black font-semibold'
                htmlFor='bio'>
                Bio
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
                  id='biod'
                  className='w-full text-sm md:text-md lg:text-lg bg-transparent h-12 px-3 rounded-xl focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-600 text-gray-900'
                  {...register('bio')}
                />
              </span>
            </section>
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
              {user?.image || file?.[0] ? (
                image ? (
                  <>
                    <Image
                      src={
                        `${process.env.NEXT_PUBLIC_URL}${user?.image}` ||
                        (image as string)
                      }
                      blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCA4MSA4NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjY3NjkgMS4yMzkwOEMzOC42NiAtMC40MTMwMjUgNDIuMzM1MyAtMC40MTMwMjUgNDUuMzE4MyAxLjIzOTA4TDc1LjMzODEgMTcuODY0OEM3OC4zMjExIDE5LjUxNjkgODAuMTU4OCAyMi41NzAxIDgwLjE1ODggMjUuODc0M1Y1OS4xMjU3QzgwLjE1ODggNjIuNDI5OSA3OC4zMjExIDY1LjQ4MzEgNzUuMzM4MSA2Ny4xMzUyTDQ1LjMxODMgODMuNzYwOUM0Mi4zMzUzIDg1LjQxMyAzOC42NiA4NS40MTMgMzUuNjc2OSA4My43NjA5TDUuNjU3MTQgNjcuMTM1MkMyLjY3NDA3IDY1LjQ4MzEgMC44MzY0MjYgNjIuNDI5OSAwLjgzNjQyNiA1OS4xMjU3VjI1Ljg3NDNDMC44MzY0MjYgMjIuNTcwMSAyLjY3NDA3IDE5LjUxNjkgNS42NTcxNCAxNy44NjQ4TDM1LjY3NjkgMS4yMzkwOFoiIGZpbGw9IiM1QzhBQkQiLz4KPHBhdGggZD0iTTM1LjY3NjggOS4wMjczNEMzOC42NTk5IDcuMzc1MjQgNDIuMzM1MiA3LjM3NTI0IDQ1LjMxODIgOS4wMjczNEw2OC4zMDY2IDIxLjc1ODlDNzEuMjg5NyAyMy40MTEgNzMuMTI3MyAyNi40NjQyIDczLjEyNzMgMjkuNzY4NFY1NS4yMzE2QzczLjEyNzMgNTguNTM1OCA3MS4yODk3IDYxLjU4OSA2OC4zMDY2IDYzLjI0MTFMNDUuMzE4MiA3NS45NzI2QzQyLjMzNTIgNzcuNjI0NyAzOC42NTk5IDc3LjYyNDcgMzUuNjc2OCA3NS45NzI2TDEyLjY4ODQgNjMuMjQxMUM5LjcwNTMyIDYxLjU4OSA3Ljg2NzY4IDU4LjUzNTggNy44Njc2OCA1NS4yMzE2VjI5Ljc2ODRDNy44Njc2OCAyNi40NjQyIDkuNzA1MzIgMjMuNDExIDEyLjY4ODQgMjEuNzU4OUwzNS42NzY4IDkuMDI3MzRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzcuMzI2MiAxNy4wNjY0QzM3LjMyNjIgMTUuNDUzNCAzOC42ODkzIDE0LjE0NTggNDAuMzcwOCAxNC4xNDU4QzQyLjA1MjQgMTQuMTQ1OCA0My40MTU1IDE1LjQ1MzQgNDMuNDE1NSAxNy4wNjY0VjY3LjkzMzdDNDMuNDE1NSA2OS41NDY3IDQyLjA1MjQgNzAuODU0MyA0MC4zNzA4IDcwLjg1NDNDMzguNjg5MyA3MC44NTQzIDM3LjMyNjIgNjkuNTQ2NyAzNy4zMjYyIDY3LjkzMzdWMTcuMDY2NFoiIGZpbGw9IiNGN0RBMTAiLz4KPHBhdGggZD0iTTQ5LjUwNDQgMjUuMDk4MUM0OS41MDQ0IDIzLjQ4NTEgNTAuODY3NSAyMi4xNzc1IDUyLjU0OTEgMjIuMTc3NUM1NC4yMzA2IDIyLjE3NzUgNTUuNTkzNyAyMy40ODUxIDU1LjU5MzcgMjUuMDk4MVY0OC40NjNDNTUuNTkzNyA1MC4wNzYgNTQuMjMwNiA1MS4zODM2IDUyLjU0OTEgNTEuMzgzNkM1MC44Njc1IDUxLjM4MzYgNDkuNTA0NCA1MC4wNzYgNDkuNTA0NCA0OC40NjNWMjUuMDk4MVoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMzguOTcxQzI1LjQwMDkgMzcuMzU4IDI2Ljc2NCAzNi4wNTA0IDI4LjQ0NTUgMzYuMDUwNEMzMC4xMjcxIDM2LjA1MDQgMzEuNDkwMiAzNy4zNTggMzEuNDkwMiAzOC45NzFWNjIuMzM1OUMzMS40OTAyIDYzLjk0ODkgMzAuMTI3MSA2NS4yNTY1IDI4LjQ0NTUgNjUuMjU2NUMyNi43NjQgNjUuMjU2NSAyNS40MDA5IDYzLjk0ODkgMjUuNDAwOSA2Mi4zMzU5VjM4Ljk3MVoiIGZpbGw9IiNFNTgyMjciLz4KPHBhdGggZD0iTTYxLjQyOTcgMjkuNzIyNEM2MS40Mjk3IDI4LjEwOTQgNjIuNzkyOCAyNi44MDE4IDY0LjQ3NDMgMjYuODAxOEM2Ni4xNTU5IDI2LjgwMTggNjcuNTE5IDI4LjEwOTQgNjcuNTE5IDI5LjcyMjRWMzIuODg2NEM2Ny41MTkgMzQuNDk5NCA2Ni4xNTU5IDM1LjgwNyA2NC40NzQzIDM1LjgwN0M2Mi43OTI4IDM1LjgwNyA2MS40Mjk3IDM0LjQ5OTQgNjEuNDI5NyAzMi44ODY0VjI5LjcyMjRaIiBmaWxsPSIjOTY0MTk1Ii8+CjxwYXRoIGQ9Ik0xMy40NzYxIDU0LjU0NzZDMTMuNDc2MSA1Mi45MzQ2IDE0LjgzOTIgNTEuNjI3IDE2LjUyMDcgNTEuNjI3QzE4LjIwMjMgNTEuNjI3IDE5LjU2NTQgNTIuOTM0NiAxOS41NjU0IDU0LjU0NzZWNTcuNzExNUMxOS41NjU0IDU5LjMyNDYgMTguMjAyMyA2MC42MzIyIDE2LjUyMDcgNjAuNjMyMkMxNC44MzkyIDYwLjYzMjIgMTMuNDc2MSA1OS4zMjQ2IDEzLjQ3NjEgNTcuNzExNVY1NC41NDc2WiIgZmlsbD0iI0QxMEQzQSIvPgo8cGF0aCBkPSJNNDkuNTA0NCA1OC45Mjg0QzQ5LjUwNDQgNTcuMzE1NCA1MC44Njc1IDU2LjAwNzggNTIuNTQ5MSA1Ni4wMDc4QzU0LjIzMDYgNTYuMDA3OCA1NS41OTM3IDU3LjMxNTQgNTUuNTkzNyA1OC45Mjg0VjYyLjMzNThDNTUuNTkzNyA2My45NDg4IDU0LjIzMDYgNjUuMjU2NCA1Mi41NDkxIDY1LjI1NjRDNTAuODY3NSA2NS4yNTY0IDQ5LjUwNDQgNjMuOTQ4OCA0OS41MDQ0IDYyLjMzNThWNTguOTI4NFoiIGZpbGw9IiM2NEMxNjgiLz4KPHBhdGggZD0iTTI1LjQwMDkgMjUuMDk4MUMyNS40MDA5IDIzLjQ4NTEgMjYuNzY0IDIyLjE3NzUgMjguNDQ1NSAyMi4xNzc1QzMwLjEyNzEgMjIuMTc3NSAzMS40OTAyIDIzLjQ4NTEgMzEuNDkwMiAyNS4wOTgxVjI4LjUwNTVDMzEuNDkwMiAzMC4xMTg1IDMwLjEyNzEgMzEuNDI2MSAyOC40NDU1IDMxLjQyNjFDMjYuNzY0IDMxLjQyNjEgMjUuNDAwOSAzMC4xMTg1IDI1LjQwMDkgMjguNTA1NVYyNS4wOTgxWiIgZmlsbD0iI0U1ODIyNyIvPgo8cGF0aCBkPSJNNjEuNDI5NyA0Mi42MjE3QzYxLjQyOTcgNDEuMDA4NyA2Mi43OTI4IDM5LjcwMTEgNjQuNDc0MyAzOS43MDExQzY2LjE1NTkgMzkuNzAxMSA2Ny41MTkgNDEuMDA4NyA2Ny41MTkgNDIuNjIxN1Y1Ny43MTE1QzY3LjUxOSA1OS4zMjQ1IDY2LjE1NTkgNjAuNjMyMSA2NC40NzQzIDYwLjYzMjFDNjIuNzkyOCA2MC42MzIxIDYxLjQyOTcgNTkuMzI0NSA2MS40Mjk3IDU3LjcxMTVWNDIuNjIxN1oiIGZpbGw9IiM5NjQxOTUiLz4KPHBhdGggZD0iTTEzLjQ3NjEgMjkuNzIyNEMxMy40NzYxIDI4LjEwOTQgMTQuODM5MiAyNi44MDE4IDE2LjUyMDcgMjYuODAxOEMxOC4yMDIzIDI2LjgwMTggMTkuNTY1NCAyOC4xMDk0IDE5LjU2NTQgMjkuNzIyNFY0NC44MTIyQzE5LjU2NTQgNDYuNDI1MiAxOC4yMDIzIDQ3LjczMjggMTYuNTIwNyA0Ny43MzI4QzE0LjgzOTIgNDcuNzMyOCAxMy40NzYxIDQ2LjQyNTIgMTMuNDc2MSA0NC44MTIyVjI5LjcyMjRaIiBmaWxsPSIjRDEwRDNBIi8+Cjwvc3ZnPgo='
                      width={300}
                      height={300}
                      placeholder='blur'
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
            <Select
              selectList={countries?.map((item, index) => ({
                id: item.label,
                name: item.label,
              }))}
              id='country'
              Icon={GlobeAltIcon}
              label='Davlat'
              placeholder='Davlat'
              register={register('country')}
            />
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
              Profilni o{"'"}zgartirish
            </span>
          )}
        </button>
        <hr className='mr-auto w-full my-3' />
        <p className='text-sm md:text-base lg:text-lg font-normal text-gray-600'>
          <Link
            href='/profile/password'
            className='text-blue underline hover:text-blue-500 transition-all'>
            Parolni o{"'"}zgartirish
          </Link>
        </p>
      </form>
    </div>
  );
}
