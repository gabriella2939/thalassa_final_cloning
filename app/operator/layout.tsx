import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Operator Portal' };

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}