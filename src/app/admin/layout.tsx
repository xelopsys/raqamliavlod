import Sidebar from '@/layout/admin/sidebar/sidebar';
import AdminLayoutAuth from '@/provider/admin-wrapper';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='w-full h-full flex flex-col box-border overflow-hidden'>
      <div className='w-full h-full flex flex-row flex-nowrap justify-between items-center md:justify-start md:items-start lg:justify-start lg:items-start overflow-hidden box-border'>
        <Sidebar />
        <AdminLayoutAuth>{children}</AdminLayoutAuth>
      </div>
    </div>
  );
}
