import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Form, Input, Button, Alert, Card, Divider } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { LOGO } from '../../src/configs/AppConfig';

const LoginPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authenticated
    if (typeof window !== 'undefined') {
      import('aws-amplify').then(({ Auth }) => {
        Auth.currentAuthenticatedUser()
          .then(() => {
            // Already logged in, redirect to app
            router.push('/app/home');
          })
          .catch(() => {
            // Not logged in, stay on page
          });
      });
    }
  }, [router]);

  const onFinish = async (values) => {
    setLoading(true);
    setError('');

    try {
      const { Auth } = await import('aws-amplify');
      const user = await Auth.signIn(values.email, values.password);

      console.log('Login successful:', user);

      // Redirect to app
      router.push('/app/home');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Errore durante il login. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { Auth } = await import('aws-amplify');
      await Auth.federatedSignIn({ provider: 'Google' });
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'Errore durante il login con Google.');
      setLoading(false);
    }
  };

  return (
    <div className="h-100" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* Logo cliccabile in alto */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '32px' }}
      >
        <Link href="/guide/pub/home">
          <img
            src={LOGO}
            alt="Civiglio"
            style={{
              height: '60px',
              cursor: 'pointer',
              filter: 'brightness(0) invert(1)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <Card
          style={{
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="my-4">
            <div className="text-center" style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#2d3748',
                marginBottom: '8px'
              }}>
                Bentornato!
              </h1>
              <p style={{ color: '#6c757d', fontSize: '15px' }}>
                Inserisci le tue credenziali per accedere
              </p>
            </div>

            {error && (
              <Alert
                type="error"
                showIcon
                message={error}
                style={{ marginBottom: 16 }}
                closable
                onClose={() => setError('')}
              />
            )}

            <Form
              form={form}
              layout="vertical"
              name="login-form"
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: 'Inserisci la tua email',
                  },
                  {
                    type: 'email',
                    message: 'Email non valida',
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: 'Inserisci la tua password',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <a href="/auth/forgot-password">Password dimenticata?</a>
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  size="large"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(102, 126, 234, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
                  }}
                >
                  Accedi
                </Button>
              </Form.Item>

              <Divider>
                <span style={{ color: '#8c8c8c' }}>oppure</span>
              </Divider>

              <Form.Item>
                <Button
                  block
                  icon={<GoogleOutlined />}
                  onClick={onGoogleLogin}
                  disabled={loading}
                  size="large"
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.color = '#667eea';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.color = 'inherit';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Accedi con Google
                </Button>
              </Form.Item>

              <div className="text-center mt-3">
                <span style={{ color: '#6c757d' }}>Non hai un account? </span>
                <a
                  href="/auth/register"
                  style={{
                    color: '#667eea',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  Registrati ora
                </a>
              </div>
            </Form>
          </div>
        </Card>

        {/* Link per tornare alla home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{
            marginTop: '24px',
            textAlign: 'center'
          }}
        >
          <Link
            href="/guide/pub/home"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 500,
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.25)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <ArrowLeftOutlined />
            <span>Torna alla home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

// Add global styles for this page
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .ant-input,
    .ant-input-password,
    .ant-input-affix-wrapper {
      border-radius: 8px !important;
      border: 2px solid #e5e7eb !important;
      transition: all 0.3s ease !important;
    }

    .ant-input:hover,
    .ant-input-password:hover,
    .ant-input-affix-wrapper:hover {
      border-color: #667eea !important;
    }

    .ant-input:focus,
    .ant-input-password:focus,
    .ant-input-affix-wrapper-focused {
      border-color: #667eea !important;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    }

    .ant-form-item-label > label {
      font-weight: 600 !important;
      color: #2d3748 !important;
    }
  `;
  document.head.appendChild(style);
}
