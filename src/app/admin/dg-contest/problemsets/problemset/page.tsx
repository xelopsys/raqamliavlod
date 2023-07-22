import ProblemsetIdScreen from '@/screen/admin/dg-contest/problemset-id-screen';

export default function ProblemSetID({
  searchParams: { id },
}: {
  searchParams: {
    id: string;
  };
}) {
  return (
    <div className='w-full h-full flex flex-col justify-start items-start overflow-x-auto p-3 gap-y-5'>
      <ProblemsetIdScreen problemId={id} />
    </div>
  );
}
