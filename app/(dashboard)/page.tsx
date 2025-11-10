import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Redirect to Today view as the main page
  redirect('/today');
}

