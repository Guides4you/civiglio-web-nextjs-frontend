import { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import store from '../src/redux/store';
import AppLocale from '../src/lang';
import ErrorBoundary from '../src/components/util-components/ErrorBoundary';

// Import layouts
import PubLayout from '../src/components/layouts/PubLayout';
import BackendLayout from '../src/components/layouts/BackendLayout';
import AuthLayout from '../src/components/layouts/AuthLayout';
// Note: AppLayout is imported directly in /app/* pages to avoid double wrapping

// Import Ant Design CSS
import 'antd/dist/antd.css';

// Component interno per accedere allo store Redux
const AppContent = ({ Component, pageProps, pathname }) => {
  const locale = useSelector(state => state.theme.locale);
  const currentAppLocale = AppLocale[locale] || AppLocale['it'];

  // Determina quale layout usare in base al path
  const getLayout = () => {
    if (pathname.startsWith('/auth')) {
      return (page) => <AuthLayout>{page}</AuthLayout>;
    }
    if (pathname.startsWith('/guide')) {
      return (page) => <PubLayout>{page}</PubLayout>;
    }
    if (pathname.startsWith('/admin')) {
      return (page) => <BackendLayout>{page}</BackendLayout>;
    }
    // Note: /app/* pages use AppLayout directly in their components
    // to avoid double wrapping
    // Default: no layout (per homepage e altre pagine)
    return (page) => page;
  };

  const renderWithLayout = getLayout();

  return (
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}
    >
      <ConfigProvider locale={currentAppLocale.antd}>
        {renderWithLayout(<Component {...pageProps} />)}
      </ConfigProvider>
    </IntlProvider>
  );
};

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    // Configura Amplify solo lato client con dynamic import
    if (typeof window !== 'undefined') {
      import('aws-amplify').then((Amplify) => {
        import('../src/aws-exports').then(({ default: awsExports }) => {
          // Configura Amplify ma disabilita Analytics per evitare errori di endpoint
          const configWithoutAnalytics = {
            ...awsExports,
            Analytics: {
              disabled: true, // Disabilita Analytics durante lo sviluppo
            },
          };

          Amplify.default.configure(configWithoutAnalytics);
          console.log('✅ Amplify configured successfully (Analytics disabled)');
        });
      }).catch(err => {
        console.error('❌ Amplify configuration error:', err);
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Civiglio Web</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Civiglio Web - Guida audio interattiva" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ErrorBoundary>
        <Provider store={store}>
          <AppContent Component={Component} pageProps={pageProps} pathname={pathname} />
        </Provider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
