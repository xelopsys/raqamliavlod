import NewsScreen from '@/screen/admin/news/news-screen';

export default function Home() {
  return (
    <div className='min-w-[280px] h-full flex flex-row flex-wrap justify-start items-start p-3 gap-y-5 w-full overflow-hidden'>
      <NewsScreen />
    </div>
  );
}
