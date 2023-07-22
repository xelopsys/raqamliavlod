import { IMaskInput } from 'react-imask';
import React, { InputHTMLAttributes, RefAttributes, SVGProps } from 'react';
import { Control, Controller, UseFormRegisterReturn } from 'react-hook-form';
import { UserIcon } from '@heroicons/react/24/outline';

interface IInput
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'name' | 'onBlur' | 'onChange'
  > {
  Icon: React.ComponentType<
    Omit<SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & RefAttributes<SVGSVGElement>
  >;
  label: string;
  control: Control;
  name: string;
  register: UseFormRegisterReturn;
}

export default function PhoneInput({
  Icon,
  label,
  register,
  control,
  name,
  ...props
}: IInput) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <section className='w-full flex flex-col justify-start items-start gap-1'>
          <label
            className='w-full text-sm md:text-md lg:text-lg flex flex-row justify-start items-center text-black font-semibold'
            htmlFor={props.id}>
            {label}
            {props.required && <span className='text-purple'>*</span>}
          </label>
          <span
            className='w-full  px-3 flex flex-row justify-start items-center rounded-xl gap-1'
            style={{
              background: 'rgba(61, 103, 173, 0.1)',
            }}>
            <Icon
              width={20}
              className='text-blue'
              style={{
                strokeWidth: 2.5,
              }}
            />
            <IMaskInput
              mask='+{998} (00) 000-00-00'
              definitions={{
                '#': /[1-9]/,
              }}
              {...props}
              {...register}
              {...field}
              //   inputRef={register}
              className='w-full text-sm md:text-md lg:text-lg bg-transparent h-12 px-3 rounded-r-xl focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-600 text-gray-900'
            />
          </span>
        </section>
      )}
    />
  );
}
