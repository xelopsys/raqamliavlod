import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { removeToken } from '@/app/actions';

export default async function AdminLayoutAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get('token');
  if (token) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}api/users/info/self`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },

        credentials: 'include',
      }
    )
      .then((res) => res)
      .catch((res) => redirect('/admin/signin'));

    const data = await response.json();
    if (data?.role !== 'Admin') {
      removeToken();
    } else return <>{children}</>;
  } else {
    redirect('/admin/signin');
  }
}
