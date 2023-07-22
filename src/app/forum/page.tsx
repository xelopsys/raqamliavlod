import ForumScreen from '@/screen/forum/forum-screen';

export default function Forum() {
  return (
    <div className='w-full h-full flex flex-col justify-between items-start overflow-y-scroll scrollbar-none'>
      <ForumScreen />
    </div>
  );
}
