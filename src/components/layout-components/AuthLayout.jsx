import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../../utils/auth';
import Loading from '../util-components/Loading';

const AuthLayout = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await isAuthenticated();

        if (!isAuth) {
          // Not authenticated, redirect to login
          router.push('/auth/login');
          return;
        }

        setAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <Loading align="center" cover="page" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthLayout;
