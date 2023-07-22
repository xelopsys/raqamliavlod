import CoursesScreen from '@/screen/courses/courses-screen';

export default function Courses() {
  return (
    <div className=' w-full h-full flex flex-col justify-start items-start p-3 md:p-10 lg:p-20 box-border overflow-y-scroll scrollbar-none gap-10'>
      <CoursesScreen />
    </div>
  );
}
