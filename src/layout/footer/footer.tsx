'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const path = usePathname();
  if (path.startsWith('/courses/course') || path.startsWith('/admin'))
    return null;
  return (
    <section className='w-full hidden md:flex lg:flex justify-center items-center'>
      <footer className='w-full flex-col justify-center items-center bg-inherit pb-2 flex gap-1'>
        <section className='w-full flex flex-row justify-center items-center gap-1'>
          <Image
            src='/logo.svg'
            alt='logo'
            width={20}
            height={20}
          />
          <h1 className='text-base font-semibold whitespace-nowrap'>
            Raqamli Avlod IT O{"'"}zbekiston
          </h1>
        </section>
        <p className='whitespace-nowrap text-sm'>© 2019-yildan beri</p>
        <section className='w-full flex flex-row flex-nowrap justify-center items-center gap-2'>
          <a href='https://t.me/digitalgeneration_uz'>
            <Image
              src='/telegram.svg'
              alt='logo'
              width={15}
              height={15}
            />
          </a>
          <a
            href='https://instagram.com/DGUzbekistan'
            className='rounded-md bg-[#EE4B62] flex flex-row justify-center items-center  whitespace-nowrap w-max h-max text-white'>
            <Image
              src='/instagram.svg'
              alt='logo'
              width={15}
              height={15}
            />
          </a>
        </section>
      </footer>
    </section>
  );
}
