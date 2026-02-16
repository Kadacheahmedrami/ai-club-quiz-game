import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Club Dashboard | Hidden Winners',
  description: 'Exclusive leaderboard for top performers',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}