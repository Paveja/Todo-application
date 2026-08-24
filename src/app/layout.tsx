import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tempo Tasks — Your day, in rhythm',
  description: 'A focused, beautifully simple task manager.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
