import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ResultsClient from './ResultsClient';

export default async function ResultsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const user = session.user;

  return <ResultsClient user={user} />;
}