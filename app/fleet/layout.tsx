import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Our Fleet' };

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}