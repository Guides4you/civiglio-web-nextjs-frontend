import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthLayout from '../../../src/components/layout-components/AuthLayout';
import Loading from '../../../src/components/util-components/Loading';

export default function ProfileIndex() {
  const router = useRouter();

  useEffect(() => {
    router.push('/app/profile/edit');
  }, [router]);

  return (
    <AuthLayout>
      <Loading align="center" cover="page" />
    </AuthLayout>
  );
}
