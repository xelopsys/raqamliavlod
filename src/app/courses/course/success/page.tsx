import CourseIDScreen from '@/screen/courses/courses-id-success-screen';

export default function Courses({
  searchParams: { id, lesson },
}: {
  searchParams: { id: string; lesson: string };
}) {
  return (
    <div className='min-w-[280px] 2xl:container w-full h-full flex flex-col  justify-start items-start gap-y-5'>
      <CourseIDScreen id={id} />
    </div>
  );
}
