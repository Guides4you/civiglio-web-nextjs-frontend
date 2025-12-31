import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Alert, Card, Steps } from 'antd';
import { MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Step } = Steps;

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');

  const onSendCode = async (values) => {
    setLoading(true);
    setError('');

    try {
      const { Auth } = await import('aws-amplify');
      await Auth.forgotPassword(values.email);

      setEmail(values.email);
      setCurrentStep(1);
      console.log('Password reset code sent to:', values.email);
    } catch (err) {
      console.error('Forgot password error:', err);

      let errorMessage = 'Errore durante l\'invio del codice. Riprova.';

      if (err.code === 'UserNotFoundException') {
        errorMessage = 'Email non trovata.';
      } else if (err.code === 'LimitExceededException') {
        errorMessage = 'Troppi tentativi. Riprova più tardi.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (values) => {
    setLoading(true);
    setError('');

    try {
      const { Auth } = await import('aws-amplify');
      await Auth.forgotPasswordSubmit(
        email,
        values.code,
        values.newPassword
      );

      console.log('Password reset successful');

      // Redirect to login
      router.push('/auth/login?reset=success');
    } catch (err) {
      console.error('Reset password error:', err);

      let errorMessage = 'Errore durante il reset della password. Riprova.';

      if (err.code === 'CodeMismatchException') {
        errorMessage = 'Codice di verifica non valido.';
      } else if (err.code === 'ExpiredCodeException') {
        errorMessage = 'Codice scaduto. Richiedi un nuovo codice.';
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
        <Card style={{ width: 500 }}>
          <div className="my-4">
            <div className="text-center mb-4">
              <h1>Recupera Password</h1>
              <p>Segui i passaggi per reimpostare la tua password</p>
            </div>

            <Steps current={currentStep} style={{ marginBottom: 24 }}>
              <Step title="Inserisci Email" icon={<MailOutlined />} />
              <Step title="Reimposta Password" icon={<LockOutlined />} />
            </Steps>

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

            {currentStep === 0 && (
              <Form
                form={form}
                layout="vertical"
                name="forgot-password-form"
                onFinish={onSendCode}
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

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    size="large"
                  >
                    Invia Codice di Verifica
                  </Button>
                </Form.Item>

                <div className="text-center mt-3">
                  <a href="/auth/login">Torna al login</a>
                </div>
              </Form>
            )}

            {currentStep === 1 && (
              <div>
                <Alert
                  type="info"
                  showIcon
                  message="Codice inviato"
                  description={`Abbiamo inviato un codice di verifica a ${email}. Controlla la tua email.`}
                  style={{ marginBottom: 16 }}
                />

                <Form
                  form={form}
                  layout="vertical"
                  name="reset-password-form"
                  onFinish={onResetPassword}
                >
                  <Form.Item
                    name="code"
                    label="Codice di Verifica"
                    rules={[
                      {
                        required: true,
                        message: 'Inserisci il codice ricevuto via email',
                      },
                    ]}
                  >
                    <Input
                      prefix={<SafetyOutlined />}
                      placeholder="Codice di verifica"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="Nuova Password"
                    rules={[
                      {
                        required: true,
                        message: 'Inserisci una nuova password',
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
                      placeholder="Nuova Password (minimo 8 caratteri)"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="Conferma Password"
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Conferma la nuova password',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
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
                    >
                      Reimposta Password
                    </Button>
                  </Form.Item>

                  <div className="text-center mt-3">
                    <Button type="link" onClick={() => {
                      setCurrentStep(0);
                      setError('');
                      form.resetFields();
                    }}>
                      Invia di nuovo il codice
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
