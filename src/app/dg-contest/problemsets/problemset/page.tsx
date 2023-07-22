import ProblemsetIdScreen from '@/screen/contest/problemset/problemset-id-screen';

export default function ProblemSetID({
  searchParams: { id },
}: {
  searchParams: {
    id: string;
  };
}) {
  return (
    <div className='w-full h-full flex flex-col justify-start items-start overflow-x-scroll scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-600 p-3 gap-y-5'>
      <ProblemsetIdScreen problemId={id} />
    </div>
  );
}
