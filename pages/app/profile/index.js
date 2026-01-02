import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AppLayoutSimple from '../../../src/components/layouts/AppLayoutSimple';
import Loading from '../../../src/components/util-components/Loading';

export default function ProfileIndex() {
  const router = useRouter();

  useEffect(() => {
    router.push('/app/profile/edit');
  }, [router]);

  return (
    <AppLayoutSimple>
      <Loading align="center" cover="page" />
    </AppLayoutSimple>
  );
}
