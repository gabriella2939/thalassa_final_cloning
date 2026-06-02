import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Shipment Detail' };

export default function TrackDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}