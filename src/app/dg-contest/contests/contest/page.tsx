import ContestIDScreen from '@/screen/contest/contest-id-screen';

export default function ContestID({
  searchParams: { id },
}: {
  searchParams: {
    id: string;
  };
}) {
  return (
    <div className='w-full h-full max-w-full flex flex-col justify-start items-start gap-y-5 box-border'>
      <ContestIDScreen id={id || ''} />
    </div>
  );
}
