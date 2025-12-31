import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Alert, Card, Divider } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

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
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card style={{ width: 400 }}>
          <div className="my-4">
            <div className="text-center">
              <h1>Accedi a Civiglio</h1>
              <p>Inserisci le tue credenziali per accedere</p>
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
                >
                  Accedi con Google
                </Button>
              </Form.Item>

              <div className="text-center mt-3">
                <span>Non hai un account? </span>
                <a href="/auth/register">Registrati ora</a>
              </div>
            </Form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
