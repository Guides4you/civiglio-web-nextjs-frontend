import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Higher-Order Component to protect private routes
 * Redirects to login page if user is not authenticated
 *
 * @param {React.Component} WrappedComponent - The component to protect
 * @returns {React.Component} Protected component
 */
const withAuth = (WrappedComponent) => {
  const WithAuthComponent = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          // Dynamic import of Auth to avoid SSR issues
          const { Auth } = await import('aws-amplify');

          // Try to get current authenticated user
          const user = await Auth.currentAuthenticatedUser();

          if (user) {
            console.log('withAuth: User is authenticated:', user.username);
            setIsAuthenticated(true);
            setIsLoading(false);
          } else {
            console.log('withAuth: No authenticated user found');
            // Redirect to login
            router.replace('/auth/login?redirect=' + encodeURIComponent(router.asPath));
          }
        } catch (error) {
          console.log('withAuth: Authentication check failed:', error);
          // User is not authenticated, redirect to login
          router.replace('/auth/login?redirect=' + encodeURIComponent(router.asPath));
        }
      };

      checkAuth();
    }, [router]);

    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="auth-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Verifica autenticazione...</p>
          </div>

          <style jsx>{`
            .auth-loading {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f5f7fa;
            }

            .loading-spinner {
              text-align: center;
            }

            .spinner {
              width: 50px;
              height: 50px;
              margin: 0 auto 20px;
              border: 4px solid rgba(102, 126, 234, 0.2);
              border-top: 4px solid #667eea;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }

            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }

            .loading-spinner p {
              color: #667eea;
              font-size: 16px;
              font-weight: 500;
            }
          `}</style>
        </div>
      );
    }

    // Only render the wrapped component if authenticated
    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Copy static properties and display name
  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};

export default withAuth;
