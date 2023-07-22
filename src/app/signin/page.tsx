import Signin from '@/screen/auth/signin-screen';

export default function SignIn({
  searchParams: { email },
}: {
  searchParams: { email: string };
}) {
  return (
    <div className='min-w-[280px] w-full h-full flex flex-col justify-start items-start p-3 gap-y-5'>
      <Signin email={email || ''} />
    </div>
  );
}
