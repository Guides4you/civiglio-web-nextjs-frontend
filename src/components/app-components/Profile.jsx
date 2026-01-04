import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { Form, Input, Button, Select, Row, Col, Switch, Modal, message } from 'antd';
import ProfileImage from '../profile-components/ProfileImage';
import IntlMessage from '../util-components/IntlMessage';
import Loading from '../util-components/Loading';
import { countries } from '../../data/countries';
import { getProfileInfo } from '../../graphql/profileQueries';
import { createProfileInfo, updateProfileInfo } from '../../graphql/profileMutations';

const { Option } = Select;
const { TextArea } = Input;

const Profile = () => {
  const router = useRouter();
  const [newProfile, setNewProfile] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const initialValues = {
    PK: '',
    email: '',
    publicProfile: false,
    name: '',
    surname: '',
    channelTitle: '',
    channelDescription: '',
    billingCompany: '',
    billingCountry: '',
    billingZipCode: '',
    billingStreet: '',
    billingVatFiscalCode: '',
    paymentMethod: '',
    paymentData: '',
    immagine: 'blank-profile.png'
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      try {
        setSaving(true);
        const { API, graphqlOperation } = await import('aws-amplify');

        // Only send fields that are defined in ProfileInfoInput schema
        // Build input object and omit fields that are empty or null
        const buildInput = () => {
          const input = {
            PK: values.PK,
            email: values.email, // Required field in schema
            publicProfile: Boolean(values.publicProfile)
          };

          // Only add fields that have values
          if (values.name) input.name = values.name;
          if (values.surname) input.surname = values.surname;
          if (values.channelTitle) input.channelTitle = values.channelTitle;
          if (values.channelDescription) input.channelDescription = values.channelDescription;
          if (values.billingCompany) input.billingCompany = values.billingCompany;
          if (values.billingCountry) input.billingCountry = values.billingCountry;
          if (values.billingZipCode) input.billingZipCode = values.billingZipCode;
          if (values.billingStreet) input.billingStreet = values.billingStreet;
          if (values.billingVatFiscalCode) input.billingVatFiscalCode = values.billingVatFiscalCode;
          if (values.paymentMethod) input.paymentMethod = values.paymentMethod;
          if (values.paymentData) input.paymentData = values.paymentData;

          // For update, include immagine if present
          if (!newProfile && values.immagine) {
            input.immagine = values.immagine;
          }

          return input;
        };

        const input = buildInput();
        console.log('Saving profile with input:', JSON.stringify(input, null, 2));

        if (newProfile) {
          await API.graphql(graphqlOperation(createProfileInfo, { input }));
          message.success('Profilo creato con successo!');
          setNewProfile(false);
        } else {
          await API.graphql(graphqlOperation(updateProfileInfo, { input }));
          message.success('Profilo aggiornato con successo!');
        }
      } catch (error) {
        console.error('Profile save error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        message.error('Si è verificato un errore nel salvataggio del profilo.');
      } finally {
        setSaving(false);
      }
    }
  });

  const onImageChange = (image) => {
    formik.setFieldValue('immagine', image);
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { API, Auth, graphqlOperation } = await import('aws-amplify');
        const session = await Auth.currentSession();
        const userId = session.idToken.payload.sub;
        const emailCognito = session.idToken.payload.email;
        const canaleCognito = session.idToken.payload['custom:nomecanale'];

        formik.setFieldValue('PK', userId);

        // Fetch profile info
        const response = await API.graphql(
          graphqlOperation(getProfileInfo, { PK: userId })
        );

        const profileInfo = response.data.getProfileInfo;
        setNewProfile(!profileInfo);

        if (profileInfo) {
          // Update all form fields with profile data
          Object.keys(profileInfo).forEach((key) => {
            if (key !== '__typename') {
              formik.setFieldValue(key, profileInfo[key] || '');
            }
          });

          // Set email from cognito if not in profile
          if (!profileInfo.email) {
            formik.setFieldValue('email', emailCognito);
          }
        } else {
          // New profile - set cognito defaults
          formik.setFieldValue('email', emailCognito);
          formik.setFieldValue('channelTitle', canaleCognito);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        message.error('Errore nel caricamento del profilo');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <Loading align="center" cover="content" />;
  }

  return (
    <>
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-title">
            <IntlMessage id="app.menu.profile" />
          </h1>
          <p className="profile-subtitle">
            <IntlMessage id="app.profile.subtitle" />
          </p>
        </div>

        <Form onFinish={formik.handleSubmit}>
          {/* Personal Info Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fa fa-user section-icon"></i>
                <IntlMessage id="app.profile.personal.title" />
              </h2>
              <div className="public-profile-toggle">
                <span className="toggle-label">
                  <IntlMessage id="app.profile.public" />
                </span>
                <Switch
                  name="publicProfile"
                  onChange={(v) => formik.setFieldValue('publicProfile', v)}
                  checked={formik.values.publicProfile}
                />
              </div>
            </div>

            <div className="section-content">
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <div className="profile-image-wrapper">
                    <ProfileImage
                      imageSrc={formik.values.immagine}
                      onFileCreated={onImageChange}
                      imageAlt={`Immagine di ${formik.values.name}`}
                    />
                  </div>
                </Col>

                <Col xs={24} md={16}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <div className="form-field">
                        <label className="field-label">Email</label>
                        <Input
                          type="email"
                          name="email"
                          id="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          placeholder="email@example.com"
                          size="large"
                        />
                      </div>
                    </Col>

                    <Col xs={24} sm={12}>
                      <div className="form-field">
                        <label className="field-label">
                          <IntlMessage id="app.profile.name" />
                        </label>
                        <Input
                          type="text"
                          name="name"
                          id="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          placeholder="Nome"
                          size="large"
                        />
                      </div>
                    </Col>

                    <Col xs={24} sm={12}>
                      <div className="form-field">
                        <label className="field-label">
                          <IntlMessage id="app.profile.surname" />
                        </label>
                        <Input
                          type="text"
                          name="surname"
                          id="surname"
                          value={formik.values.surname}
                          onChange={formik.handleChange}
                          placeholder="Cognome"
                          size="large"
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>

          {/* Channel Info Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fa fa-tv section-icon"></i>
                <IntlMessage id="app.profile.channel.title" />
              </h2>
            </div>

            <div className="section-content">
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <div className="form-field">
                    <label className="field-label">
                      <IntlMessage id="app.profile.channel.name" />
                    </label>
                    <Input
                      type="text"
                      name="channelTitle"
                      id="channelTitle"
                      value={formik.values.channelTitle}
                      onChange={formik.handleChange}
                      placeholder="Titolo del canale"
                      size="large"
                    />
                  </div>
                </Col>

                <Col xs={24}>
                  <div className="form-field">
                    <label className="field-label">
                      <IntlMessage id="app.profile.channel.description" />
                    </label>
                    <TextArea
                      name="channelDescription"
                      id="channelDescription"
                      value={formik.values.channelDescription}
                      onChange={formik.handleChange}
                      placeholder="Descrizione del canale"
                      rows={4}
                      size="large"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Billing Info Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fa fa-file-text section-icon"></i>
                <IntlMessage id="app.profile.billing.title" />
              </h2>
            </div>

            <div className="section-content">
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <div className="form-field">
                    <label className="field-label">
                      <IntlMessage id="app.profile.billing.company" />
                    </label>
                    <Input
                      type="text"
                      name="billingCompany"
                      id="billingCompany"
                      value={formik.values.billingCompany}
                      onChange={formik.handleChange}
                      placeholder="Nome azienda / Nome persona"
                      size="large"
                    />
                  </div>
                </Col>

                <Col xs={24} sm={12}>
                  <div className="form-field">
                    <label className="field-label">
                      <IntlMessage id="app.profile.billing.country" />
                    </label>
                    <Select
                      style={{ width: '100%' }}
                      name="billingCountry"
                      id="billingCountry"
                      value={formik.values.billingCountry}
                      onChange={(value) => formik.setFieldValue('billingCountry', value)}
                      placeholder="Seleziona paese"
                      size="large"
                      showSearch
                      optionFilterProp="children"
                    >
                      {countries.map((country, i) => (
                        <Option key={`country-${i}`} value={country.name}>
                          {country.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Col>

                <Col xs={24} sm={12}>
                  <div className="form-field">
                    <label className="field-label">
                      <IntlMessage id="app.profile.billing.zip" />
                    </label>
                    <Input
                      type="text"
                      name="billingZipCode"
                      id="billingZipCode"
                      value={formik.values.billingZipCode}
                      onChange={formik.handleChange}
                      placeholder="CAP"
                      size="large"
                    />
                  </div>
                </Col>

                <Col xs={24}>
                  <div className="form-field">
                    <label className="field-label">
                      <IntlMessage id="app.profile.billing.street" />
                    </label>
                    <Input
                      type="text"
                      name="billingStreet"
                      id="billingStreet"
                      value={formik.values.billingStreet}
                      onChange={formik.handleChange}
                      placeholder="Via e numero civico"
                      size="large"
                    />
                  </div>
                </Col>

                <Col xs={24}>
                  <div className="form-field">
                    <label className="field-label">
                      <IntlMessage id="app.profile.billing.vat" />
                    </label>
                    <Input
                      type="text"
                      name="billingVatFiscalCode"
                      id="billingVatFiscalCode"
                      value={formik.values.billingVatFiscalCode}
                      onChange={formik.handleChange}
                      placeholder="P.IVA / Codice Fiscale"
                      size="large"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fa fa-credit-card section-icon"></i>
                <IntlMessage id="app.profile.payment.title" />
              </h2>
            </div>

            <div className="section-content">
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <div className="form-field">
                    <label className="field-label">
                      <IntlMessage id="app.profile.payment.method" />
                    </label>
                    <Input
                      type="text"
                      name="paymentMethod"
                      id="paymentMethod"
                      value={formik.values.paymentMethod}
                      onChange={formik.handleChange}
                      placeholder="Metodo di pagamento (es. Bonifico bancario)"
                      size="large"
                    />
                  </div>
                </Col>

                <Col xs={24}>
                  <div className="form-field">
                    <label className="field-label">IBAN</label>
                    <Input
                      type="text"
                      name="paymentData"
                      id="paymentData"
                      value={formik.values.paymentData}
                      onChange={formik.handleChange}
                      placeholder="IT00 X000 0000 0000 0000 0000 000"
                      size="large"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Save Button */}
          <div className="profile-actions">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={saving}
              className="save-button"
            >
              <i className="fa fa-save"></i>
              <IntlMessage id="app.profile.save" />
            </Button>
          </div>
        </Form>
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ========== Header ========== */
        .profile-header {
          margin-bottom: 32px;
        }

        .profile-title {
          font-size: 32px;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 8px 0;
        }

        .profile-subtitle {
          font-size: 16px;
          color: #6c757d;
          margin: 0;
        }

        /* ========== Sections ========== */
        .profile-section {
          background: #ffffff;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .section-header {
          padding: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #ffffff;
        }

        .section-icon {
          font-size: 20px;
        }

        .public-profile-toggle {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .toggle-label {
          font-size: 14px;
          font-weight: 500;
        }

        .section-content {
          padding: 32px 24px;
        }

        /* ========== Form Fields ========== */
        .form-field {
          margin-bottom: 0;
        }

        .field-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
        }

        :global(.profile-container .ant-input),
        :global(.profile-container .ant-select-selector),
        :global(.profile-container .ant-input-textarea) {
          border-radius: 8px;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        :global(.profile-container .ant-input:hover),
        :global(.profile-container .ant-select-selector:hover),
        :global(.profile-container .ant-input-textarea:hover) {
          border-color: #667eea;
        }

        :global(.profile-container .ant-input:focus),
        :global(.profile-container .ant-select-focused .ant-select-selector),
        :global(.profile-container .ant-input-textarea:focus) {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* ========== Profile Image ========== */
        .profile-image-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          min-height: 200px;
        }

        /* ========== Actions ========== */
        .profile-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 32px;
        }

        :global(.profile-container .save-button) {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          padding: 12px 32px;
          height: auto;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        :global(.profile-container .save-button:hover) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        /* ========== Responsive ========== */
        @media (max-width: 768px) {
          .profile-title {
            font-size: 24px;
          }

          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .section-content {
            padding: 24px 16px;
          }

          .profile-actions {
            justify-content: stretch;
          }

          :global(.profile-container .save-button) {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default Profile;
