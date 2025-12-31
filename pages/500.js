import { Result, Button } from 'antd';
import { useRouter } from 'next/router';
import Head from 'next/head';

/**
 * Custom 500 Page
 * Displayed when a server error occurs
 */
export default function Custom500() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>500 - Errore del Server | Civiglio Web</title>
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
          status="500"
          title="500"
          subTitle="Spiacente, si è verificato un errore del server."
          extra={[
            <Button type="primary" key="home" onClick={() => router.push('/')}>
              Torna alla Home
            </Button>,
            <Button key="reload" onClick={() => window.location.reload()}>
              Ricarica
            </Button>
          ]}
        />
      </div>
    </>
  );
}
