import useAuth from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Filter({
  handleSetFilter,
  filter,
}: {
  handleSetFilter: (filter: Record<string, any>) => void;
  filter: string;
}) {
  const { handleFilter, user } = useAuth();
  const { register, handleSubmit, watch, reset, getValues } = useForm();

  const onSave = (data: Record<string, any>) => {
    handleFilter(data);
    handleSetFilter(data);
    console.log(data, 'data');
  };

  useEffect(() => {
    reset(user?.filter);
    console.log(user?.filter, 'filter');
  }, [user?.filter]);

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className='w-full h-max p-5 rounded-md border bg-gray-100 flex flex-col justify-start items-start gap-4'>
      <div className='w-full h-full flex flex-row justify-start items-start gap-4 whitespace-normal overflow-x-scroll scrollbar-none box-border'>
        <div className='w-max h-max flex flex-col justify-start items-start gap-2'>
          <h2 className='text-base md:text-lg lg:text-xl font-semibold'>
            Filter
          </h2>
          {/* <span>
          <input
            type='checkbox'
            name='noAnswer'
            id='noAnswer'
          />
          <label htmlFor='hasFoundAnswer'>Javobi topilmagan</label>
        </span> */}
          <span className='flex flex-row justify-center items-center gap-2'>
            <input
              type='checkbox'
              id='NoAnswers'
              defaultChecked={false}
              {...register('NoAnswers')}
            />
            <label
              htmlFor='NoAnswers'
              className='text-sm md:text-base lg:text-lg'>
              Javob berilmagan
            </label>
          </span>
          <span className='flex flex-row justify-center items-center gap-2'>
            <input
              type='checkbox'
              id='HasFoundAnswer'
              defaultChecked={false}
              {...register('HasFoundAnswer')}
            />
            <label
              htmlFor='HasFoundAnswer'
              className='text-sm md:text-base lg:text-lg'>
              Javobi topilgan
            </label>
          </span>
        </div>
        <div className='w-max h-max flex flex-col justify-start items-start gap-2'>
          <h2 className='text-base md:text-lg lg:text-xl font-semibold'>
            Tartiblash
          </h2>
          {/* <span>
          <input
            type='checkbox'
            name='noAnswer'
            id='noAnswer'
          />
          <label htmlFor='hasFoundAnswer'>Javobi topilmagan</label>
        </span> */}
          <span className='flex flex-row justify-center items-center gap-2'>
            <input
              type='radio'
              id='Newest'
              defaultChecked={false}
              {...register('sort')}
              value='Newest'
            />
            <label
              htmlFor='Newest'
              className='text-sm md:text-base lg:text-lg'>
              Yangi savollar
            </label>
          </span>
          {/* <span className='flex flex-row justify-center items-center gap-2'>
            <input
              type='radio'
              id='most'
              defaultChecked={false}
              {...register('sort', {})}
              value='most'
            />
            <label
              htmlFor='most'
              className='text-sm md:text-base lg:text-lg'>
              Ko{"'"}p ko{"'"}rilgan savollar
            </label>
          </span> */}
          <span className='flex flex-row justify-center items-center gap-2'>
            <input
              type='radio'
              id='HighestScore'
              defaultChecked={false}
              {...register('sort', {})}
              value='HighestScore'
            />
            <label
              htmlFor='HighestScore'
              className='text-sm md:text-base lg:text-lg'>
              Ko{"'"}p baholangan savollar
            </label>
          </span>
        </div>
      </div>
      <div className='w-full flex flex-row justify-between items-start gap-2'>
        <button
          type='submit'
          className='py-1.5 px-3 bg-blue text-white rounded-lg text-sm md:text-base lg:text-lg'>
          Topish
        </button>
        <button
          onClick={() => {
            handleFilter({});
            reset();
            handleSetFilter({});
          }}
          disabled={
            !(user?.filter && Object?.keys(user?.filter as {})?.length > 0)
          }
          className='py-1.5 px-3 bg-white text-black rounded-lg border whitespace-nowrap text-sm md:text-base lg:text-lg disabled:opacity-20 disabled:cursor-not-allowed'>
          Filterni o{"'"}chirish
        </button>
      </div>
    </form>
  );
}

// {user?.filter && Object?.keys(user?.filter as {})?.length > 0 ? (

// ) : (
//   <button
//     onClick={() => {
//       const values = getValues();
//     }}
//     className='py-1.5 px-3 bg-white text-black rounded-lg border whitespace-nowrap text-sm md:text-base lg:text-lg'>
//     Filterni saqlash
//   </button>
// )}
