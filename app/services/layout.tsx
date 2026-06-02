import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Our Services' };

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}