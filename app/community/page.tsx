import { redirect } from 'next/navigation';

export default function CommunityPage() {
  // Redirect to the new Pinterest-style community home
  redirect('/community/home');
}

