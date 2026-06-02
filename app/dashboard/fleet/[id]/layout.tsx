import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Fleet Detail' };

export default function FleetDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}