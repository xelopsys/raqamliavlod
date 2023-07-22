import CoursesScreen from '@/screen/admin/courses/courses-screen';

export default function Home() {
  return (
    <div className='min-w-[280px] h-full flex flex-row flex-wrap justify-start items-start p-3 gap-y-5 w-full overflow-hidden'>
      <CoursesScreen />
    </div>
  );
}
