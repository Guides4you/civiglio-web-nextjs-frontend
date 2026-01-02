import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '../../../src/components/layouts/AppLayout';
import Loading from '../../../src/components/util-components/Loading';

export default function ProfileIndex() {
  const router = useRouter();

  useEffect(() => {
    router.push('/app/profile/edit');
  }, [router]);

  return (
    <AppLayout>
      <Loading align="center" cover="page" />
    </AppLayout>
  );
}
