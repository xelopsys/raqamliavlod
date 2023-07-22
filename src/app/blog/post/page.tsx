import PostIdScreen from '@/screen/blog/post/post-id-screen';

export default function Post({
  searchParams: { id },
}: {
  searchParams: { id: string };
}) {
  return (
    <div className='min-w-[280px] w-full 2xl:container h-full flex flex-col justify-start items-start p-3 gap-5 scrollbar-none box-border overflow-scroll scroll-smooth'>
      <PostIdScreen id={id || ''} />
    </div>
  );
}
