import Signup from '@/screen/auth/signup-screen';

export default function SignUp() {
  return (
    <div className='min-w-[280px] w-full h-full flex flex-col justify-start items-start p-3 gap-y-5'>
      <div className='w-full h-full flex flex-col justify-start items-start md:justify-center md:items-center lg:justify-center lg:items-center md:p-10 lg:p-14 '>
        <Signup />
      </div>
    </div>
  );
}
