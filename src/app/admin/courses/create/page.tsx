import CreateCourseScreen from '@/screen/admin/courses/create-course';

export default function Create() {
  return (
    <div className='min-w-[280px] 2xl:container w-full h-full flex flex-row flex-wrap justify-start items-start gap-y-5'>
      <CreateCourseScreen />
    </div>
  );
}
