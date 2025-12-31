import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Alert, Card, Divider } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, GoogleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);

    try {
      const { Auth } = await import('aws-amplify');

      // Sign up with Cognito
      const { user } = await Auth.signUp({
        username: values.email,
        password: values.password,
        attributes: {
          email: values.email,
          name: values.name || '',
        },
      });

      console.log('Registration successful:', user);
      setSuccess(true);

      // Show success message and redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/auth/login?registered=true');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);

      let errorMessage = 'Errore durante la registrazione. Riprova.';

      if (err.code === 'UsernameExistsException') {
        errorMessage = 'Questo indirizzo email è già registrato.';
      } else if (err.code === 'InvalidPasswordException') {
        errorMessage = 'La password non soddisfa i requisiti minimi.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignUp = async () => {
    setLoading(true);
    setError('');

    try {
      const { Auth } = await import('aws-amplify');
      await Auth.federatedSignIn({ provider: 'Google' });
    } catch (err) {
      console.error('Google sign up error:', err);
      setError(err.message || 'Errore durante la registrazione con Google.');
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
              <h1>Registrati su Civiglio</h1>
              <p>Crea un nuovo account</p>
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

            {success && (
              <Alert
                type="success"
                showIcon
                message="Registrazione completata!"
                description="Controlla la tua email per confermare l'account. Verrai reindirizzato al login..."
                style={{ marginBottom: 16 }}
              />
            )}

            <Form
              form={form}
              layout="vertical"
              name="register-form"
              onFinish={onFinish}
            >
              <Form.Item
                name="name"
                label="Nome"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nome (opzionale)"
                  size="large"
                />
              </Form.Item>

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
                    message: 'Inserisci una password',
                  },
                  {
                    min: 8,
                    message: 'La password deve essere di almeno 8 caratteri',
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password (minimo 8 caratteri)"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Conferma Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Conferma la password',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Le password non corrispondono'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Conferma Password"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  size="large"
                  disabled={success}
                >
                  Registrati
                </Button>
              </Form.Item>

              <Divider>
                <span style={{ color: '#8c8c8c' }}>oppure</span>
              </Divider>

              <Form.Item>
                <Button
                  block
                  icon={<GoogleOutlined />}
                  onClick={onGoogleSignUp}
                  disabled={loading || success}
                  size="large"
                >
                  Registrati con Google
                </Button>
              </Form.Item>

              <div className="text-center mt-3">
                <span>Hai già un account? </span>
                <a href="/auth/login">Accedi</a>
              </div>
            </Form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
