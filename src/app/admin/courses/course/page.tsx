import CourseIDScreen from '@/screen/admin/courses/courses-id-screen';

export default function Courses({
  searchParams: { id, lesson },
}: {
  searchParams: { id: string; lesson: string };
}) {
  return (
    <div className='min-w-[280px] 2xl:container w-full h-full flex flex-row flex-wrap justify-start items-start gap-y-5'>
      <CourseIDScreen
        id={id}
        lesson={lesson}
      />
    </div>
  );
}
