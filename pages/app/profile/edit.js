import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { Form, Input, Button, Select, Row, Col, Switch, Modal } from 'antd';
import AuthLayout from '../../../src/components/layout-components/AuthLayout';
import ProfileImage from '../../../src/components/profile-components/ProfileImage';
import { countries } from '../../../src/data/countries';
import { getProfileInfo } from '../../../src/graphql/profileQueries';
import { createProfileInfo, updateProfileInfo } from '../../../src/graphql/profileMutations';

const { Option } = Select;

export default function EditProfilePage() {
  const router = useRouter();
  const [newProfile, setNewProfile] = useState(true);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({
    visible: false,
    title: '',
    text: '',
    onOk: null
  });

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
        const { API, graphqlOperation } = await import('aws-amplify');
        const input = { ...values };

        if (newProfile) {
          await API.graphql(graphqlOperation(createProfileInfo, { input }));
          setModalData({
            visible: true,
            title: 'Creazione profilo',
            text: 'Profilo creato con successo!',
            onOk: () => setModalData({ ...modalData, visible: false })
          });
          setNewProfile(false);
        } else {
          await API.graphql(graphqlOperation(updateProfileInfo, { input }));
          setModalData({
            visible: true,
            title: 'Aggiornamento profilo',
            text: 'Profilo aggiornato con successo!',
            onOk: () => setModalData({ ...modalData, visible: false })
          });
        }
      } catch (error) {
        console.error('Profile save error:', error);
        setModalData({
          visible: true,
          title: 'Errore',
          text: 'Si è verificato un errore nel salvataggio del profilo.',
          onOk: () => setModalData({ ...modalData, visible: false })
        });
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
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <AuthLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Caricamento profilo...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Head>
        <title>Modifica Profilo - Civiglio</title>
      </Head>

      <div className="ant-layout-content">
        <div className="container">
          <div className="ant-card ant-card-bordered">
            <div className="ant-card-head">Edit Profile</div>
            <div className="ant-card-body">
              <Form onFinish={formik.handleSubmit}>
                {/* Personal Info Section */}
                <Row gutter={[5, 15]}>
                  <Col xs={18}>
                    <h4>Personal info</h4>
                  </Col>
                  <Col xs={6} style={{ textAlign: 'right' }}>
                    Public profile{' '}
                    <Switch
                      name="publicProfile"
                      onChange={(v) => formik.setFieldValue('publicProfile', v)}
                      checked={formik.values.publicProfile}
                    />
                  </Col>

                  <Col xs={24} md={12} lg={8}>
                    <ProfileImage
                      imageSrc={formik.values.immagine}
                      onFileCreated={onImageChange}
                      imageAlt={`Immagine di ${formik.values.name}`}
                    />
                  </Col>

                  <Col xs={24}>
                    <Input
                      type="text"
                      name="email"
                      id="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      placeholder="Email"
                    />
                  </Col>

                  <Col xs={12}>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      placeholder="Nome"
                    />
                  </Col>
                  <Col xs={12}>
                    <Input
                      type="text"
                      name="surname"
                      id="surname"
                      value={formik.values.surname}
                      onChange={formik.handleChange}
                      placeholder="Cognome"
                    />
                  </Col>
                </Row>

                {/* Channel Info Section */}
                <Row gutter={[5, 15]} style={{ marginTop: '20px' }}>
                  <Col xs={24}>
                    <h4>Channel info</h4>
                  </Col>

                  <Col xs={24}>
                    <Input
                      type="text"
                      name="channelTitle"
                      id="channelTitle"
                      value={formik.values.channelTitle}
                      onChange={formik.handleChange}
                      placeholder="Titolo canale"
                    />
                  </Col>

                  <Col xs={24}>
                    <Input
                      type="text"
                      name="channelDescription"
                      id="channelDescription"
                      value={formik.values.channelDescription}
                      onChange={formik.handleChange}
                      placeholder="Descrizione canale"
                    />
                  </Col>
                </Row>

                {/* Billing Info Section */}
                <Row gutter={[5, 15]} style={{ marginTop: '20px' }}>
                  <Col xs={24}>
                    <h4>Billing info</h4>
                  </Col>

                  <Col xs={24}>
                    <Input
                      type="text"
                      name="billingCompany"
                      id="billingCompany"
                      value={formik.values.billingCompany}
                      onChange={formik.handleChange}
                      placeholder="Nome azienda / Nome persona"
                    />
                  </Col>

                  <Col xs={12}>
                    <Select
                      style={{ width: '100%' }}
                      name="billingCountry"
                      id="billingCountry"
                      value={formik.values.billingCountry}
                      onChange={(value) => formik.setFieldValue('billingCountry', value)}
                      placeholder="Paese"
                    >
                      {countries.map((country, i) => (
                        <Option key={`country-${i}`} value={country.name}>
                          {country.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>

                  <Col xs={12}>
                    <Input
                      type="text"
                      name="billingZipCode"
                      id="billingZipCode"
                      value={formik.values.billingZipCode}
                      onChange={formik.handleChange}
                      placeholder="CAP"
                    />
                  </Col>

                  <Col xs={24}>
                    <Input
                      type="text"
                      name="billingStreet"
                      id="billingStreet"
                      value={formik.values.billingStreet}
                      onChange={formik.handleChange}
                      placeholder="Via"
                    />
                  </Col>

                  <Col xs={24}>
                    <Input
                      type="text"
                      name="billingVatFiscalCode"
                      id="billingVatFiscalCode"
                      value={formik.values.billingVatFiscalCode}
                      onChange={formik.handleChange}
                      placeholder="P.IVA / Codice Fiscale"
                    />
                  </Col>
                </Row>

                {/* Payment Method Section */}
                <Row gutter={[5, 15]} style={{ marginTop: '20px' }}>
                  <Col xs={24}>
                    <h4>Payment method</h4>
                  </Col>

                  <Col xs={24}>
                    <Input
                      type="text"
                      name="paymentMethod"
                      id="paymentMethod"
                      value={formik.values.paymentMethod}
                      onChange={formik.handleChange}
                      placeholder="Metodo di pagamento"
                    />
                  </Col>

                  <Col xs={24}>
                    <Input
                      type="text"
                      name="paymentData"
                      id="paymentData"
                      value={formik.values.paymentData}
                      onChange={formik.handleChange}
                      placeholder="IBAN"
                    />
                  </Col>
                </Row>

                {/* Submit Button */}
                <Row gutter={[5, 15]} style={{ marginTop: '20px' }}>
                  <Col xs={24}>
                    <Button type="primary" htmlType="submit" size="large">
                      Salva
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={modalData.title}
        open={modalData.visible}
        onOk={modalData.onOk}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>{modalData.text}</p>
      </Modal>
    </AuthLayout>
  );
}
