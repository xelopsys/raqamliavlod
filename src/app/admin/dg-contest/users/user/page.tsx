import UserIdScreen from '@/screen/profile/user-id-screen-copy';

export default function User({
  searchParams: { id, tab },
}: {
  searchParams: { id: string; tab: string };
}) {
  return (
    <div className='w-full max-w-full h-full flex flex-col md:flex-row lg:flex-row md:flex-wrap lg:flex-nowrap justify-start items-start  gap-10 md:gap-16 lg:gap-20 scrollbar-none box-border overflow-x-hidden overflow-y-scroll scroll-smooth'>
      <UserIdScreen
        id={id || ''}
        tab={tab}
      />
    </div>
  );
}
