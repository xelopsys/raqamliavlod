import { Inter } from 'next/font/google';
import NewsWrapper from '@/screen/admin/news/news-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.className} w-full h-full 2xl:container flex flex-col box-border overflow-hidden justify-start items-start p-5 md:p-10 lg:p-10`}>
      <NewsWrapper>{children}</NewsWrapper>
    </div>
  );
}
