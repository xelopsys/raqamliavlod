import BlogScreen from '@/screen/blog/blog-screen';

export default function Blog() {
  return (
    <div className='w-full h-full flex flex-col justify-between items-start overflow-y-scroll scrollbar-none'>
      <BlogScreen />
    </div>
  );
}
