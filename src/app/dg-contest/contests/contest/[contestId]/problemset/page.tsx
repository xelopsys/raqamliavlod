import ProblemSetIdScreen from '@/screen/contest/contest-problemset/contest-problemset-id-screen';

export default function ContestProblemSet({
  params: { contestId },
  searchParams: { id },
}: {
  params: { contestId: string };
  searchParams: { id: string };
}) {
  return (
    <div className='w-full h-full flex flex-col justify-start items-start overflow-x-scroll scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-600 p-3 gap-y-5'>
      <ProblemSetIdScreen
        id={contestId || ''}
        problemId={id || ''}
      />
    </div>
  );
}
