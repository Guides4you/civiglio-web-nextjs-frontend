import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, getUserInfo } from '../../utils/auth';
import Loading from '../util-components/Loading';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const isAuth = await isAuthenticated();

        if (!isAuth) {
          // Not authenticated, redirect to login with return URL
          router.push('/auth/login?redirect=' + encodeURIComponent(router.asPath));
          return;
        }

        // Get user info to check admin role
        const userInfo = await getUserInfo();

        // TODO: Add admin role check here if needed
        // For now, all authenticated users can access admin
        // You can add a check like:
        // if (!userInfo?.attributes?.['custom:role']?.includes('admin')) {
        //   router.push('/app/home');
        //   return;
        // }

        setAuthorized(true);
      } catch (error) {
        console.error('Admin auth check failed:', error);
        router.push('/auth/login?redirect=' + encodeURIComponent(router.asPath));
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
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

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
};

export default AdminLayout;
