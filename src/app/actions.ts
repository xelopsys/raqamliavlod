'use server';

import { cookies } from 'next/headers';

export async function setToken(token: string) {
  // @ts-ignore
  cookies().set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
  });
}

export async function getToken() {
  // @ts-ignore
  return cookies().get('token');
}

export async function removeToken() {
  // @ts-ignore
  cookies().set({
    name: 'token',
    value: '',
    expires: new Date(0),
    path: '/',
  });
}
