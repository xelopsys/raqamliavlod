import 'quill/dist/quill.snow.css';
import '../style/globals.css';
import { Inter } from 'next/font/google';
import PersistProvider from '@/provider/persist-provider';
import ReactQueryProvider from '@/provider/react-query';
import ToasterClient from '@/provider/react-hot-toast';
import Sidebar from '@/layout/sidebar/sidebar';
import Header from '@/layout/header/header';
import Footer from '@/layout/footer/footer';
import NiceModalWrapper from '@/provider/nicemodal-provider';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Raqamli avlod',
  description: 'Raqamli avlod IT oromgohi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} w-full h-full flex flex-col box-border overflow-hidden `}>
        <PersistProvider>
          <ReactQueryProvider>
            <Header />
            <div className='w-full h-full flex flex-col md:flex-row lg:flex-row flex-nowrap justify-between items-center md:justify-start md:items-start lg:justify-start lg:items-start overflow-hidden box-border'>
              <Sidebar />
              <div className='w-full h-full min-h-max flex flex-col justify-between items-start overflow-auto bg-[#F4F4F4] gap-5 box-border order-1 md:order-2 lg:order-2 xl:order-2 2xl-order-2 relative'>
                <NiceModalWrapper>{children}</NiceModalWrapper>
                <Footer />
              </div>
            </div>
            <ToasterClient />
          </ReactQueryProvider>
        </PersistProvider>
      </body>
    </html>
  );
}
