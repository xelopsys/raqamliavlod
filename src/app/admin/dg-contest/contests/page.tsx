import ContestScreen from '@/screen/contest/contest-screen';
import { classNames } from '@/helper';
import Link from 'next/link';

export default function Contest({
  searchParams: { tab },
}: {
  searchParams: { tab: string };
}) {
  return (
    <div className='w-full h-full flex flex-col justify-start items-start overflow-x-auto  gap-y-5'>
      <ContestScreen />
    </div>
  );
}
