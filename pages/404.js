import { Result, Button } from 'antd';
import { useRouter } from 'next/router';
import Head from 'next/head';

/**
 * Custom 404 Page
 * Displayed when a page is not found
 */
export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>404 - Pagina Non Trovata | Civiglio Web</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        background: '#f0f2f5'
      }}>
        <Result
          status="404"
          title="404"
          subTitle="Spiacente, la pagina che stai cercando non esiste."
          extra={[
            <Button type="primary" key="home" onClick={() => router.push('/')}>
              Torna alla Home
            </Button>,
            <Button key="back" onClick={() => router.back()}>
              Indietro
            </Button>
          ]}
        />
      </div>
    </>
  );
}
