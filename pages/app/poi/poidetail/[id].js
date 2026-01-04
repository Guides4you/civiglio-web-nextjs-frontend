import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Row, Col, Input, Select, Modal, Alert, InputNumber, Card } from 'antd';
import { useSelector } from 'react-redux';
import AppLayoutSimple from '../../../../src/components/layouts/AppLayoutSimple';
import POIImage from '../../../../src/components/poi-components/POIImage';
import POIMap from '../../../../src/components/poi-components/POIMap';
import IntlMessage from '../../../../src/components/util-components/IntlMessage';
import UploadAudio from '../../../../src/components/audio-components/UploadAudio';
import RecordAudioWidget2 from '../../../../src/components/audio-components/RecordAudioWidget2';
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
  const [audiotype, setAudiotype] = useState('');
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
    title: '',
    linked: false,
    rangeKey: null,
    hashkey: null
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
          title: poiData.audioTitle,
          linked: poiData.linked || false,
          rangeKey: poiData.linked ? poiData.PK : null,
          hashkey: poiData.geopoi.hashKey || null
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
        const hasAudio = current.audioFile && current.audioFile !== '';

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

        setAudiotype(hasAudio ? 'present' : '');
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

    if (!audiotype) {
      Modal.error({
        title: 'Errore',
        content: 'Selezionare come si preferisce caricare l\'audio'
      });
      return;
    }

    if (!currentAudio.audioFile) {
      Modal.error({
        title: 'Errore',
        content: 'Registrazione audio mancante'
      });
      return;
    }

    if (!currentAudio.audioExtract) {
      Modal.error({
        title: 'Errore',
        content: 'Audio extract mancante (estratto di 20 secondi)'
      });
      return;
    }

    setSaving(true);

    try {
      const { API, graphqlOperation } = await import('aws-amplify');
      const axios = (await import('axios')).default;

      if (isCreate) {
        let guid;

        // Step 1: Create GeoPoi or use existing POI
        if (poiLocation.linked) {
          // Use existing POI's rangeKey
          guid = poiLocation.rangeKey;
        } else {
          // Create new GeoPoi object via REST API to get UUID
          const poiObject = {
            lat: poiLocation.lat,
            lng: poiLocation.lng,
            immagine: currentAudio.immagine,
            idproprietarioattuale: loggedUser.username,
            tipo: '',
            stato: 'nuovo',
            url: '/app/poi/poidetail/',
            dateStart: new Date().toISOString().split('T')[0],
            dateEnd: '',
            proprietario_uuid: loggedUser.attributes.sub
          };

          const geoResponse = await axios.put(
            'https://bgsxzp0b7a.execute-api.eu-west-1.amazonaws.com/test/poicrud',
            poiObject
          );

          guid = geoResponse.data.RangeKeyValue.S;

          // Step 2: Create POI metadata (only for new POI)
          const poiInput = {
            PK: guid,
            SK: `_${selectedLanguage}_POI`,
            lingua: selectedLanguage,
            titolo: currentAudio.audioTitle,
            proprietario: loggedUser.username,
            proprietario_uuid: loggedUser.attributes.sub
          };

          await API.graphql(
            graphqlOperation(createPoi, { input: poiInput })
          );
        }

        // Step 3: Create audio media (for both new and linked POI)
        const audioInput = {
          PK: guid,
          lingua: selectedLanguage,
          audioTitle: currentAudio.audioTitle,
          description: currentAudio.description,
          tags: currentAudio.tags,
          price: currentAudio.price,
          immagine: currentAudio.immagine,
          audioFile: currentAudio.audioFile,
          audioExtract: currentAudio.audioExtract,
          proprietario: loggedUser.username,
          proprietario_uuid: loggedUser.attributes.sub,
          linked: poiLocation.linked || false,
          richiesta_pubblicazione: false
        };

        await API.graphql(
          graphqlOperation(createAudioMedia, { input: audioInput })
        );

        setModalData({
          visible: true,
          title: 'Successo',
          text: 'POI creato con successo!',
          onOk: () => router.push('/app/content')
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
      <AppLayoutSimple>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Caricamento...</p>
        </div>
      </AppLayoutSimple>
    );
  }

  return (
    <AppLayoutSimple>
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

        {/* Sezione 1: Informazioni Base */}
        <Card
          title="Informazioni Base"
          style={{ marginBottom: '24px' }}
          headStyle={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
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

            <Col xs={24} md={12}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                <IntlMessage id="poidetail3.titolo.audio" /> *
              </label>
              <Input
                size="large"
                value={currentAudio.audioTitle}
                onChange={(e) => setCurrentAudio({ ...currentAudio, audioTitle: e.target.value })}
                placeholder="Titolo del POI"
              />
            </Col>
          </Row>
        </Card>

        {/* Sezione 2: Media Visivi (Immagine e Mappa) */}
        <Card
          title="Media Visivi"
          style={{ marginBottom: '24px' }}
          headStyle={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <POIImage
                imageSrc={currentAudio.immagine}
                imageAlt={currentAudio.audioTitle}
                onFileCreated={(img) => setCurrentAudio({ ...currentAudio, immagine: img })}
              />
            </Col>

            <Col xs={24} lg={12}>
              <div style={{
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                overflow: 'hidden',
                height: '100%',
                minHeight: '300px'
              }}>
                <div style={{
                  padding: '16px',
                  background: '#fafafa',
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold'
                }}>
                  <IntlMessage id="poidetail3.location" />
                </div>
                <POIMap
                  lat={poiLocation.lat}
                  lng={poiLocation.lng}
                  title={currentAudio.audioTitle}
                  linked={poiLocation.linked}
                  editable={isCreate || !currentAudio.PK}
                  onMapClick={(coords) => setPoiLocation({ ...poiLocation, ...coords })}
                />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Sezione 3: Contenuto */}
        <Card
          title="Contenuto"
          style={{ marginBottom: '24px' }}
          headStyle={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                <IntlMessage id="poidetail3.descrizione" /> *
              </label>
              <TextArea
                rows={5}
                value={currentAudio.description}
                onChange={(e) => setCurrentAudio({ ...currentAudio, description: e.target.value })}
                placeholder="Descrizione del POI"
              />
            </Col>

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
                formatter={(value) => `€ ${value}`}
                parser={(value) => value.replace('€ ', '')}
              />
              <small style={{ color: '#999', display: 'block', marginTop: '4px' }}>
                <IntlMessage id="poicontent.inserisci.zero.per.rendere.gratuito.il.tuo.contenuto" />
              </small>
            </Col>
          </Row>
        </Card>

        {/* Sezione 4: File Audio */}
        <Card
          title="File Audio"
          style={{ marginBottom: '24px' }}
          headStyle={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}
        >
          <Row gutter={[16, 24]}>
            {/* Audio Type Selection */}
            {audiotype !== 'present' && (
              <Col xs={24}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                  <IntlMessage id="poidetail3.come.preferisci.caricare.il.tuo.audio" />
                </label>
                <Select
                  size="large"
                  style={{ width: '100%', maxWidth: '400px' }}
                  value={audiotype}
                  onChange={(value) => setAudiotype(value)}
                  placeholder="Seleziona..."
                >
                  <Option value="">Seleziona...</Option>
                  <Option value="upload">
                    <IntlMessage id="poicontent.upload" />
                  </Option>
                  <Option value="record">
                    <IntlMessage id="poicontent.recordhere" />
                  </Option>
                </Select>
              </Col>
            )}

            {/* Audio Upload/Record Section */}
            {(audiotype === 'upload' || audiotype === 'record' || audiotype === 'present') && (
              <>
                <Col xs={24} lg={12}>
                  <div style={{
                    padding: '20px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px dashed #d9d9d9'
                  }}>
                    <label style={{
                      fontWeight: 'bold',
                      display: 'block',
                      marginBottom: '12px',
                      fontSize: '15px'
                    }}>
                      {audiotype === 'upload' ? (
                        <IntlMessage id="poicontent.uploadaudio" />
                      ) : (
                        <IntlMessage id="poicontent.registraaudio" />
                      )}
                    </label>
                    {(audiotype === 'record' || audiotype === 'present') && (
                      <>
                        <RecordAudioWidget2
                          audioFile={currentAudio.audioFile}
                          onFileCreated={(fname) =>
                            setCurrentAudio({ ...currentAudio, audioFile: fname })
                          }
                          primary
                          onAudioDelete={() => setCurrentAudio({ ...currentAudio, audioFile: '' })}
                        />
                        <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
                          {CIVIGLIO_LANGUAGES.find(l => l.lang === selectedLanguage)?.etichetta}
                        </small>
                      </>
                    )}
                    {audiotype === 'upload' && (
                      <>
                        <UploadAudio
                          name="civiglio-upload"
                          title="Upload"
                          audioFile={currentAudio.audioFile}
                          onFileCreated={(fname) =>
                            setCurrentAudio({ ...currentAudio, audioFile: fname })
                          }
                          primary
                        />
                        <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
                          {CIVIGLIO_LANGUAGES.find(l => l.lang === selectedLanguage)?.etichetta}
                        </small>
                      </>
                    )}
                  </div>
                </Col>

                {/* Audio Extract */}
                <Col xs={24} lg={12}>
                  <div style={{
                    padding: '20px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px dashed #d9d9d9'
                  }}>
                    <label style={{
                      fontWeight: 'bold',
                      display: 'block',
                      marginBottom: '12px',
                      fontSize: '15px'
                    }}>
                      {audiotype === 'upload' ? (
                        <>Upload Preview - </>
                      ) : (
                        <>Registra Preview - </>
                      )}
                      <IntlMessage id="poicontent.estratto.di.20.secondi" />
                    </label>
                    {(audiotype === 'record' || audiotype === 'present') && (
                      <>
                        <RecordAudioWidget2
                          audioFile={currentAudio.audioExtract}
                          onFileCreated={(fname) =>
                            setCurrentAudio({ ...currentAudio, audioExtract: fname })
                          }
                          onAudioDelete={() => setCurrentAudio({ ...currentAudio, audioExtract: '' })}
                        />
                        <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
                          {CIVIGLIO_LANGUAGES.find(l => l.lang === selectedLanguage)?.etichetta} - Preview
                        </small>
                      </>
                    )}
                    {audiotype === 'upload' && (
                      <>
                        <UploadAudio
                          name="civiglio-upload-preview"
                          title="Upload preview"
                          audioFile={currentAudio.audioExtract}
                          onFileCreated={(fname) =>
                            setCurrentAudio({ ...currentAudio, audioExtract: fname })
                          }
                        />
                        <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
                          {CIVIGLIO_LANGUAGES.find(l => l.lang === selectedLanguage)?.etichetta} - Preview
                        </small>
                      </>
                    )}
                  </div>
                </Col>
              </>
            )}
          </Row>
        </Card>

        {/* Action Buttons */}
        <div style={{
          marginTop: '24px',
          padding: '20px',
          background: '#fff',
          borderRadius: '8px',
          border: '1px solid #e8e8e8',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <Button
            type="primary"
            size="large"
            onClick={handleSave}
            loading={saving}
            style={{ minWidth: '140px' }}
          >
            <IntlMessage id="poidetail3.salva" />
          </Button>

          {!isCreate && currentAudio.stato_media !== STATO_MEDIA.NUOVO && (
            <Button
              type="default"
              size="large"
              onClick={handleRequestPublication}
              disabled={currentAudio.richiesta_pubblicazione}
              style={{ minWidth: '200px' }}
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
            onClick={() => router.push('/app/content')}
            style={{ minWidth: '120px' }}
          >
            Annulla
          </Button>
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

      <style jsx>{`
        .rec-timer {
          font-size: 18px;
          font-weight: bold;
          color: #667eea;
          padding-left: 12px;
        }
      `}</style>
    </AppLayoutSimple>
  );
}
