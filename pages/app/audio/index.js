import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MyAudioPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified content page
    router.replace('/app/content');
  }, [router]);

  return null;
}
