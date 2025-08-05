// src/app/page.tsx
// 첫 진입 시 Dashboard로 리다이렉트

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}