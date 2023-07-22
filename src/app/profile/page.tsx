import ProfileScreen from '@/screen/profile/user-profile-screen';

export default function Profile({
  searchParams: { tab },
}: {
  searchParams: { tab: string };
}) {
  return (
    <div className='w-full max-w-full h-max flex flex-col md:flex-row lg:flex-row md:flex-wrap lg:flex-nowrap justify-start items-start  gap-10 md:gap-16 lg:gap-20  box-border  scroll-smooth p-5 md:p-10 lg:p-20'>
      <ProfileScreen tab={tab} />
    </div>
  );
}
