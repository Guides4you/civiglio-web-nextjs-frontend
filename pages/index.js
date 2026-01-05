import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to guide page after 1 second
    const timer = setTimeout(() => {
      router.push('/guide/pub/home');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Head>
        <title>Civiglio - Loading...</title>
      </Head>

      <div className="splash-screen">
        <div className="splash-content">
          {/* Logo */}
          <div className="logo-container">
            <img
              src="/img/civiglio/logo.png"
              alt="Civiglio Logo"
              className="logo"
            />
          </div>

          {/* Title */}
          <h1 className="splash-title">Civiglio</h1>

          {/* Subtitle */}
          <p className="splash-subtitle">Redirecting to guide...</p>

          {/* Loading Spinner */}
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        </div>

        <style jsx>{`
          .splash-screen {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
            overflow: hidden;
          }

          /* Animated background pattern */
          .splash-screen::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: moveBackground 20s linear infinite;
            opacity: 0.3;
          }

          @keyframes moveBackground {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(50px, 50px);
            }
          }

          .splash-content {
            text-align: center;
            z-index: 1;
            animation: fadeInUp 0.6s ease-out;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .logo-container {
            margin-bottom: 30px;
            animation: scaleIn 0.5s ease-out;
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .logo {
            width: 120px;
            height: 120px;
            object-fit: contain;
            filter: drop-shadow(0 10px 30px rgba(0,0,0,0.2));
            animation: float 3s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .splash-title {
            font-size: 48px;
            font-weight: 700;
            color: #ffffff;
            margin: 0 0 15px 0;
            text-shadow: 0 4px 12px rgba(0,0,0,0.2);
            letter-spacing: -0.5px;
          }

          .splash-subtitle {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.9);
            margin: 0 0 40px 0;
            font-weight: 400;
            animation: pulse 2s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 0.9;
            }
            50% {
              opacity: 0.6;
            }
          }

          .spinner-container {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-top: 4px solid #ffffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          /* Responsive */
          @media (max-width: 768px) {
            .logo {
              width: 100px;
              height: 100px;
            }

            .splash-title {
              font-size: 36px;
            }

            .splash-subtitle {
              font-size: 16px;
            }

            .spinner {
              width: 40px;
              height: 40px;
            }
          }

          @media (max-width: 480px) {
            .logo {
              width: 80px;
              height: 80px;
            }

            .splash-title {
              font-size: 28px;
            }

            .splash-subtitle {
              font-size: 14px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
