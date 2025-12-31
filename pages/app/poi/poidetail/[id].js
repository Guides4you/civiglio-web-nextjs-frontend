import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Row, Col, Input, Select, Modal, Alert, InputNumber } from 'antd';
import { useSelector } from 'react-redux';
import AuthLayout from '../../../../src/components/layout-components/AuthLayout';
import POIImage from '../../../../src/components/poi-components/POIImage';
import POIMap from '../../../../src/components/poi-components/POIMap';
import IntlMessage from '../../../../src/components/util-components/IntlMessage';
import { CIVIGLIO_LANGUAGES, STATO_MEDIA } from '../../../../src/constants/CiviglioConstants';
import { getMedia, listLingue } from '../../../../src/graphql/poiQueries';
import {
  createPoi,
  createAudioMedia,
  updatePoi,
  updateAudioMedia,
  richiestaPubblicazioneMedia
} from '../../../../src/graphql/poiMutations';

const { TextArea } = Input;
const { Option } = Select;

export default function POIDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const locale = useSelector((state) => state.theme.locale);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);

  // Form state
  const [selectedLanguage, setSelectedLanguage] = useState('it');
  const [audioLanguages, setAudioLanguages] = useState({});
  const [currentAudio, setCurrentAudio] = useState({
    PK: '',
    SK: '',
    audioTitle: '',
    description: '',
    tags: [],
    price: 0,
    immagine: 'image_upload.png',
    audioFile: '',
    audioExtract: '',
    lingua: 'it',
    stato_media: STATO_MEDIA.NUOVO,
    richiesta_pubblicazione: false
  });

  // Map state
  const [poiLocation, setPoiLocation] = useState({
    lat: 41.890321994610964,
    lng: 12.492220169150155,
    title: ''
  });

  const [modalData, setModalData] = useState({
    visible: false,
    title: '',
    text: '',
    onOk: null
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { Auth } = await import('aws-amplify');
        const user = await Auth.currentUserInfo();
        setLoggedUser(user);
      } catch (error) {
        console.error('Error loading user:', error);
        router.push('/auth/login');
      }
    };

    loadUser();
  }, [router]);

  useEffect(() => {
    if (!id || !loggedUser) return;

    const loadPOI = async () => {
      if (id === 'create') {
        setIsCreate(true);
        setLoading(false);
        return;
      }

      try {
        const { API, graphqlOperation } = await import('aws-amplify');
        const [poiId, skPart] = id.split('__');

        if (!skPart) {
          alert('Formato ID non valido');
          router.push('/app/poi');
          return;
        }

        // Load media data
        const mediaResponse = await API.graphql(
          graphqlOperation(getMedia, {
            PK: poiId,
            SK: `_${skPart}`
          })
        );

        const poiData = mediaResponse.data.getMedia;

        if (!poiData || !poiData.geopoi) {
          alert('Dati POI mancanti. Contattare gli amministratori.');
          router.push('/app/poi');
          return;
        }

        // Parse coordinates
        const coordinate = JSON.parse(poiData.geopoi.geoJson);
        setPoiLocation({
          lat: coordinate.coordinates[1],
          lng: coordinate.coordinates[0],
          title: poiData.audioTitle
        });

        // Load all language versions
        const languageId = skPart.split('_')[2];
        const langResponse = await API.graphql(
          graphqlOperation(listLingue, { id: languageId })
        );

        const languages = {};
        let hasRequestedPublication = true;

        langResponse.data.listLingue.items.forEach((item) => {
          languages[item.lingua] = {
            ...item,
            tags: item.tags || []
          };
          if (item.richiesta_pubblicazione === 'false' || !item.richiesta_pubblicazione) {
            hasRequestedPublication = false;
          }
        });

        setAudioLanguages(languages);
        setSelectedLanguage(poiData.lingua || 'it');

        // Set current audio data
        const current = languages[poiData.lingua] || poiData;
        setCurrentAudio({
          PK: poiData.PK,
          SK: poiData.SK,
          audioTitle: current.audioTitle || '',
          description: current.description || '',
          tags: Array.isArray(current.tags) ? current.tags : [],
          price: current.price || 0,
          immagine: current.immagine || poiData.geopoi.immagine || 'image_upload.png',
          audioFile: current.audioFile || '',
          audioExtract: current.audioExtract || '',
          lingua: poiData.lingua || 'it',
          stato_media: current.stato_media || STATO_MEDIA.NUOVO,
          richiesta_pubblicazione: hasRequestedPublication
        });

        setIsCreate(false);
      } catch (error) {
        console.error('Error loading POI:', error);
        Modal.error({
          title: 'Errore',
          content: 'Errore nel caricamento del POI: ' + error.message
        });
      } finally {
        setLoading(false);
      }
    };

    loadPOI();
  }, [id, loggedUser, router]);

  const handleLanguageChange = (lang) => {
    if (audioLanguages[lang]) {
      const langData = audioLanguages[lang];
      setCurrentAudio({
        ...currentAudio,
        audioTitle: langData.audioTitle || '',
        description: langData.description || '',
        tags: langData.tags || [],
        price: langData.price || 0,
        immagine: langData.immagine || currentAudio.immagine,
        audioFile: langData.audioFile || '',
        audioExtract: langData.audioExtract || '',
        lingua: lang,
        stato_media: langData.stato_media || STATO_MEDIA.NUOVO
      });
    } else {
      setCurrentAudio({
        ...currentAudio,
        audioTitle: '',
        description: '',
        tags: [],
        lingua: lang
      });
    }
    setSelectedLanguage(lang);
  };

  const handleSave = async () => {
    // Validation
    if (!currentAudio.audioTitle) {
      Modal.error({
        title: 'Errore',
        content: 'Il titolo audio è obbligatorio'
      });
      return;
    }

    if (!currentAudio.description) {
      Modal.error({
        title: 'Errore',
        content: 'La descrizione è obbligatoria'
      });
      return;
    }

    setSaving(true);

    try {
      const { API, graphqlOperation } = await import('aws-amplify');

      if (isCreate) {
        // Create new POI
        const poiInput = {
          titolo: currentAudio.audioTitle,
          lingua: selectedLanguage,
          proprietario: loggedUser.username,
          proprietario_uuid: loggedUser.attributes.sub,
          geoJson: JSON.stringify({
            type: 'Point',
            coordinates: [poiLocation.lng, poiLocation.lat]
          })
        };

        const poiResponse = await API.graphql(
          graphqlOperation(createPoi, { input: poiInput })
        );

        const createdPoi = poiResponse.data.createPoi;

        // Create audio media
        const audioInput = {
          PK: createdPoi.PK,
          SK: createdPoi.SK,
          audioTitle: currentAudio.audioTitle,
          description: currentAudio.description,
          tags: currentAudio.tags,
          price: currentAudio.price,
          immagine: currentAudio.immagine,
          lingua: selectedLanguage,
          proprietario: loggedUser.username,
          proprietario_uuid: loggedUser.attributes.sub,
          audioFile: currentAudio.audioFile,
          audioExtract: currentAudio.audioExtract,
          stato_media: STATO_MEDIA.NUOVO
        };

        await API.graphql(
          graphqlOperation(createAudioMedia, { input: audioInput })
        );

        setModalData({
          visible: true,
          title: 'Successo',
          text: 'POI creato con successo!',
          onOk: () => router.push('/app/poi')
        });
      } else {
        // Update existing audio media
        const updateInput = {
          PK: currentAudio.PK,
          SK: currentAudio.SK,
          audioTitle: currentAudio.audioTitle,
          description: currentAudio.description,
          tags: currentAudio.tags,
          price: currentAudio.price,
          immagine: currentAudio.immagine,
          audioFile: currentAudio.audioFile,
          audioExtract: currentAudio.audioExtract
        };

        await API.graphql(
          graphqlOperation(updateAudioMedia, { input: updateInput })
        );

        setModalData({
          visible: true,
          title: 'Successo',
          text: 'POI aggiornato con successo!',
          onOk: () => setModalData({ ...modalData, visible: false })
        });
      }
    } catch (error) {
      console.error('Error saving POI:', error);
      Modal.error({
        title: 'Errore',
        content: 'Errore nel salvataggio: ' + error.message
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRequestPublication = async () => {
    if (!currentAudio.PK || !currentAudio.SK) {
      Modal.error({
        title: 'Errore',
        content: 'Salva prima il POI'
      });
      return;
    }

    try {
      const { API, graphqlOperation } = await import('aws-amplify');

      await API.graphql(
        graphqlOperation(richiestaPubblicazioneMedia, {
          PK: currentAudio.PK,
          SK: currentAudio.SK,
          value: true
        })
      );

      setCurrentAudio({
        ...currentAudio,
        richiesta_pubblicazione: true
      });

      Modal.success({
        title: 'Successo',
        content: 'Richiesta di pubblicazione inviata!'
      });
    } catch (error) {
      console.error('Error requesting publication:', error);
      Modal.error({
        title: 'Errore',
        content: 'Errore nell\'invio della richiesta: ' + error.message
      });
    }
  };

  if (loading) {
    return (
      <AuthLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Caricamento...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Head>
        <title>{isCreate ? 'Nuovo POI' : 'Modifica POI'} - Civiglio</title>
      </Head>

      <div className="container-fluid" style={{ padding: '20px' }}>
        <h2>{isCreate ? 'Nuovo POI' : 'Modifica POI'}</h2>

        {currentAudio.stato_media === STATO_MEDIA.RIFIUTATO && (
          <Alert
            message="Media Rifiutato"
            description="Questo media è stato rifiutato. Controlla il motivo e apporta le modifiche necessarie."
            type="error"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}

        {currentAudio.stato_media === STATO_MEDIA.NUOVO && (
          <Alert
            message="In Revisione"
            description="Questo media è in attesa di approvazione."
            type="info"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}

        {currentAudio.stato_media === STATO_MEDIA.APPROVATO && (
          <Alert
            message="Approvato"
            description="Questo media è stato approvato ed è pubblico."
            type="success"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}

        <Row gutter={[16, 16]}>
          {/* Language Selection */}
          <Col xs={24}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              <IntlMessage id="poidetail3.seleziona.lingua" />
            </label>
            <Select
              style={{ width: '100%' }}
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              {CIVIGLIO_LANGUAGES.map((lang) => (
                <Option key={lang.lang} value={lang.lang}>
                  {lang.etichetta}
                </Option>
              ))}
            </Select>
          </Col>

          {/* Title */}
          <Col xs={24}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              <IntlMessage id="poidetail3.titolo.audio" /> *
            </label>
            <Input
              value={currentAudio.audioTitle}
              onChange={(e) => setCurrentAudio({ ...currentAudio, audioTitle: e.target.value })}
              placeholder="Titolo del POI"
            />
          </Col>

          {/* Description */}
          <Col xs={24}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              <IntlMessage id="poidetail3.descrizione" /> *
            </label>
            <TextArea
              rows={4}
              value={currentAudio.description}
              onChange={(e) => setCurrentAudio({ ...currentAudio, description: e.target.value })}
              placeholder="Descrizione del POI"
            />
          </Col>

          {/* Tags */}
          <Col xs={24} md={12}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              <IntlMessage id="poidetail3.tags" />
            </label>
            <Input
              value={Array.isArray(currentAudio.tags) ? currentAudio.tags.join(', ') : ''}
              onChange={(e) => setCurrentAudio({
                ...currentAudio,
                tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
              })}
              placeholder="arte, storia, cultura"
            />
          </Col>

          {/* Price */}
          <Col xs={24} md={12}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              <IntlMessage id="poidetail3.prezzo" />
            </label>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              value={currentAudio.price}
              onChange={(value) => setCurrentAudio({ ...currentAudio, price: value })}
              placeholder="0.00"
            />
          </Col>

          {/* Image */}
          <Col xs={24} md={12}>
            <POIImage
              imageSrc={currentAudio.immagine}
              imageAlt={currentAudio.audioTitle}
              onFileCreated={(img) => setCurrentAudio({ ...currentAudio, immagine: img })}
            />
          </Col>

          {/* Map */}
          <Col xs={24} md={12}>
            <div className="ant-card ant-card-bordered">
              <div className="ant-card-head">
                <div className="ant-card-head-title">
                  <IntlMessage id="poidetail3.location" />
                </div>
              </div>
              <div className="ant-card-body" style={{ padding: 0 }}>
                <POIMap
                  lat={poiLocation.lat}
                  lng={poiLocation.lng}
                  title={currentAudio.audioTitle}
                  editable={isCreate || !currentAudio.PK}
                  onMapClick={(coords) => setPoiLocation({ ...poiLocation, ...coords })}
                />
              </div>
            </div>
          </Col>

          {/* Action Buttons */}
          <Col xs={24}>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <Button
                type="primary"
                size="large"
                onClick={handleSave}
                loading={saving}
              >
                <IntlMessage id="poidetail3.salva" />
              </Button>

              {!isCreate && currentAudio.stato_media !== STATO_MEDIA.NUOVO && (
                <Button
                  type="default"
                  size="large"
                  onClick={handleRequestPublication}
                  disabled={currentAudio.richiesta_pubblicazione}
                >
                  {currentAudio.richiesta_pubblicazione ? (
                    <IntlMessage id="poidetail3.pubblicazione.richiesta" />
                  ) : (
                    <IntlMessage id="poidetail3.richiedi.pubblicazione" />
                  )}
                </Button>
              )}

              <Button
                size="large"
                onClick={() => router.push('/app/poi')}
              >
                Annulla
              </Button>
            </div>
          </Col>
        </Row>
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
