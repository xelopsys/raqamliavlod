import ForumIDScreen from '@/screen/forum/forum-id-screen';

export default function ForumID({
  searchParams: { id },
}: {
  searchParams: { id: string };
}) {
  return (
    <div className='min-w-[280px] w-full h-full flex flex-col justify-between items-start p-3 md:pt-10 md:px-10 lg:pt-20 lg:px-20 gap-5 scrollbar-none box-border overflow-scroll scroll-smooth'>
      <ForumIDScreen forumId={id} />
    </div>
  );
}
