import SignInScreen from '@/screen/admin/signin/signin-screen';
import { setToken } from '@/app/actions';
import { cookies } from 'next/headers';

export default function Home() {
  const token = cookies().get('token');
  console.log(token?.value);
  return (
    <div className='min-w-[280px] h-full flex flex-row flex-wrap justify-start items-start p-3 gap-y-5 w-full overflow-hidden'>
      <div className='w-full h-full max-h-full min-h-max flex flex-col  justify-start items-start gap-5 overflow-y-scroll scrollbar-none p-0 md:p-8 lg:p-10 '>
        <SignInScreen setToken={setToken} />
      </div>
    </div>
  );
}
