import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Row, Col, Card, Button, Input, Modal, Alert, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import AdminLayout from '../../../../src/components/layout-components/AdminLayout';
import POIMap from '../../../../src/components/poi-components/POIMap';
import { getMediaForAdmin } from '../../../../src/graphql/adminQueries';
import {
  adminApproveMedia,
  adminRejectMedia,
  changePoiCoords
} from '../../../../src/graphql/adminMutations';
import { CLOUDFRONT_URL } from '../../../../src/constants/ApiConstant';
import { STATO_MEDIA } from '../../../../src/constants/CiviglioConstants';

const { TextArea } = Input;

export default function EditPOIAdminPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [media, setMedia] = useState(null);
  const [poiLocation, setPoiLocation] = useState({ lat: 41.890321994610964, lng: 12.492220169150155 });
  const [originalLocation, setOriginalLocation] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [coordsChanged, setCoordsChanged] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadMedia = async () => {
      try {
        const { API, graphqlOperation } = await import('aws-amplify');
        const [PK, skPart] = id.split('__');

        if (!skPart) {
          message.error('Formato ID non valido');
          router.push('/admin/poi/validazione');
          return;
        }

        const SK = `_${skPart}`;

        const response = await API.graphql(
          graphqlOperation(getMediaForAdmin, { PK, SK })
        );

        const mediaData = response.data.getMedia;

        if (!mediaData || !mediaData.geopoi) {
          message.error('Media o dati POI mancanti');
          router.push('/admin/poi/validazione');
          return;
        }

        // Parse coordinates
        const geoJson = JSON.parse(mediaData.geopoi.geoJson);
        const coords = {
          lat: geoJson.coordinates[1],
          lng: geoJson.coordinates[0]
        };

        setPoiLocation(coords);
        setOriginalLocation(coords);
        setMedia(mediaData);
      } catch (error) {
        console.error('Error loading media:', error);
        message.error('Errore nel caricamento: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [id, router]);

  const handleMapClick = (coords) => {
    setPoiLocation(coords);
    setCoordsChanged(
      coords.lat !== originalLocation.lat || coords.lng !== originalLocation.lng
    );
  };

  const handleApprove = async () => {
    if (!media) return;

    Modal.confirm({
      title: 'Approva Media',
      content: coordsChanged
        ? 'Le coordinate sono state modificate. Vuoi salvare le nuove coordinate e approvare il media?'
        : 'Sei sicuro di voler approvare questo media?',
      okText: 'Approva',
      cancelText: 'Annulla',
      onOk: async () => {
        setSubmitting(true);
        try {
          const { API, graphqlOperation } = await import('aws-amplify');

          // Se le coordinate sono cambiate, aggiornale prima
          if (coordsChanged && media.geopoi) {
            await API.graphql(
              graphqlOperation(changePoiCoords, {
                hashKey: media.geopoi.hashKey,
                oldRangeKey: media.geopoi.rangeKey,
                lat: poiLocation.lat,
                lng: poiLocation.lng
              })
            );
          }

          // Approva il media
          await API.graphql(
            graphqlOperation(adminApproveMedia, {
              PK: media.PK,
              SK: media.SK,
              hashKey: media.geopoi.hashKey
            })
          );

          message.success('Media approvato con successo!');
          router.push('/admin/poi/validazione');
        } catch (error) {
          console.error('Error approving media:', error);
          message.error('Errore nell\'approvazione: ' + error.message);
        } finally {
          setSubmitting(false);
        }
      }
    });
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!media || !rejectReason.trim()) {
      message.error('Inserisci un motivo per il rifiuto');
      return;
    }

    setSubmitting(true);
    try {
      const { API, graphqlOperation } = await import('aws-amplify');

      await API.graphql(
        graphqlOperation(adminRejectMedia, {
          PK: media.PK,
          SK: media.SK,
          motivo: rejectReason
        })
      );

      message.success('Media rifiutato');
      router.push('/admin/poi/validazione');
    } catch (error) {
      console.error('Error rejecting media:', error);
      message.error('Errore nel rifiuto: ' + error.message);
    } finally {
      setSubmitting(false);
      setShowRejectModal(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Caricamento...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!media) {
    return (
      <AdminLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Media non trovato</h2>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Validazione Media: {media.audioTitle} - Admin Civiglio</title>
      </Head>

      <div className="container-fluid" style={{ padding: '20px' }}>
        <h2>Validazione Media</h2>

        {media.stato_media === STATO_MEDIA.RIFIUTATO && (
          <Alert
            message="Media Rifiutato"
            description="Questo media è stato precedentemente rifiutato"
            type="error"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}

        {media.stato_media === STATO_MEDIA.APPROVATO && (
          <Alert
            message="Media Approvato"
            description="Questo media è già stato approvato"
            type="success"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}

        {coordsChanged && (
          <Alert
            message="Coordinate Modificate"
            description="Le coordinate del POI sono state modificate. Verranno salvate al momento dell'approvazione."
            type="warning"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}

        <Row gutter={[16, 16]}>
          {/* Mappa */}
          <Col xs={24} md={12}>
            <Card title="Posizione POI">
              <POIMap
                lat={poiLocation.lat}
                lng={poiLocation.lng}
                title={media.audioTitle}
                editable={true}
                onMapClick={handleMapClick}
              />
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                <p>Lat: {poiLocation.lat.toFixed(6)}</p>
                <p>Lng: {poiLocation.lng.toFixed(6)}</p>
              </div>
            </Card>
          </Col>

          {/* Form Validazione */}
          <Col xs={24} md={12}>
            <Card title="Dettagli Media">
              {/* Immagine */}
              {media.immagine && media.immagine !== 'image_upload.png' && (
                <div style={{ marginBottom: '20px' }}>
                  <img
                    src={`${CLOUDFRONT_URL}/images/${media.immagine}`}
                    alt={media.audioTitle}
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              )}

              {/* Titolo */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                  Titolo:
                </label>
                <Input value={media.audioTitle} readOnly />
              </div>

              {/* Descrizione */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                  Descrizione:
                </label>
                <TextArea value={media.description} rows={4} readOnly />
              </div>

              {/* Proprietario */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                  Proprietario:
                </label>
                <Input value={media.proprietario} readOnly />
              </div>

              {/* Lingua */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                  Lingua:
                </label>
                <Input value={media.lingua} readOnly />
              </div>

              {/* Audio Full */}
              {media.audioFile && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                    Audio Completo:
                  </label>
                  <audio controls style={{ width: '100%' }}>
                    <source src={`${CLOUDFRONT_URL}/audio/${media.audioFile}`} type="audio/mpeg" />
                  </audio>
                </div>
              )}

              {/* Audio Extract */}
              {media.audioExtract && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                    Estratto Audio:
                  </label>
                  <audio controls style={{ width: '100%' }}>
                    <source src={`${CLOUDFRONT_URL}/audio/${media.audioExtract}`} type="audio/mpeg" />
                  </audio>
                </div>
              )}

              {/* Pulsanti Azione */}
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleApprove}
                  loading={submitting}
                  size="large"
                  style={{ flex: 1 }}
                >
                  Approva
                </Button>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={handleReject}
                  loading={submitting}
                  size="large"
                  style={{ flex: 1 }}
                >
                  Rifiuta
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal Rifiuto */}
      <Modal
        title="Rifiuta Media"
        open={showRejectModal}
        onOk={confirmReject}
        onCancel={() => setShowRejectModal(false)}
        okText="Rifiuta"
        cancelText="Annulla"
        okButtonProps={{ danger: true, loading: submitting }}
      >
        <p>Inserisci il motivo del rifiuto:</p>
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Spiega perché questo media viene rifiutato..."
        />
      </Modal>
    </AdminLayout>
  );
}
