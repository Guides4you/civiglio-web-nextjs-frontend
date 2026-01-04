import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Row, Col, Card, Modal } from 'antd';
import { useSelector } from 'react-redux';
import {
  PushpinOutlined,
  UserOutlined,
  HeartOutlined,
  PlayCircleOutlined,
  EuroCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import AppLayoutSimple from '../../../src/components/layouts/AppLayoutSimple';
import Flex from '../../../src/components/shared-components/Flex';
import IntlMessage from '../../../src/components/util-components/IntlMessage';
import { CLOUDFRONT_URL } from '../../../src/constants/ApiConstant';
import { STATO_MEDIA } from '../../../src/constants/CiviglioConstants';
import { getProfileInfo } from '../../../src/graphql/profileQueries';
import { listMediaByProprietario } from '../../../src/graphql/poiQueries';
import { updateProfileChannel } from '../../../src/graphql/poiMutations';
import { createProfileInfo } from '../../../src/graphql/profileMutations';

const truncateString = (str, n) => {
  if (!str) return '';
  return str.length > n ? str.substring(0, n) + '...' : str;
};

const HeaderInfo = ({ data }) => {
  const infoModal = () => {
    Modal.info({
      title: 'Motivo del rifiuto',
      content: data.motivoRifiuto || 'Nessun motivo specificato',
      icon: <InfoCircleOutlined />,
    });
  };

  return (
    <span>
      <Row>
        {data.stato_media === STATO_MEDIA.NUOVO && (
          <Col xs={24}>
            <span className="stato-media">
              <IntlMessage id="poidetail3.media.in.revisione" />
            </span>
          </Col>
        )}
        {data.stato_media === STATO_MEDIA.APPROVATO && (
          <Col xs={24}>
            <span className="stato-media">
              <IntlMessage id="poidetail3.media.approvato" />
            </span>
          </Col>
        )}
        {data.stato_media === STATO_MEDIA.RIFIUTATO && (
          <Col xs={24}>
            <span className="stato-media red">
              <IntlMessage id="poidetail3.media.rifiutato" />
            </span>
            &nbsp;
            <Button
              type="link"
              shape="circle"
              onClick={(e) => {
                e.preventDefault();
                infoModal();
              }}
            >
              <i className="fas fa-info-circle"></i>
            </Button>
          </Col>
        )}
      </Row>
      <Row>
        <Col span={20}>
          <div className="poi-item-header">{data.audioTitle}</div>
        </Col>
        <Col span={4}>
          <Link href={`/app/poi/poidetail/${data.PK}_${data.SK}`}>
            <Button type="default">
              <IntlMessage id="edit" />
            </Button>
          </Link>
        </Col>
      </Row>
    </span>
  );
};

const FooterInfo = ({ poidata }) => (
  <Row>
    <Col sm={4} md={2} className="footer-icon">
      <PlayCircleOutlined />
    </Col>
    <Col sm={8} md={4} className="footer-icon">
      {poidata.geopoi?.listen || 0}
    </Col>
    <Col sm={4} md={2} className="footer-icon">
      <HeartOutlined />
    </Col>
    <Col sm={8} md={4} className="footer-icon">
      {poidata.geopoi?.likes || 0}
    </Col>
    <Col sm={4} md={2} className="footer-icon">
      <UserOutlined />
    </Col>
    <Col sm={8} md={4} className="footer-icon">
      {poidata.geopoi?.follower || 0}
    </Col>
    <Col sm={4} md={2} className="footer-icon">
      <EuroCircleOutlined />
    </Col>
    <Col sm={8} md={4} className="footer-icon">
      0.00
    </Col>
  </Row>
);

const ItemInfo = ({ data }) => (
  <div className="poi-item-info">
    <div style={{ padding: '0 10px', width: '100%' }} className="poi">
      <HeaderInfo data={data} />
      <p>{truncateString(data.description, 300)}</p>
      {data.tags && data.tags.length > 0 && (
        <p>
          {data.tags.map((t, i) => (
            <span key={`${t}-${i}`}>{t}&nbsp;</span>
          ))}
        </p>
      )}
      <FooterInfo poidata={data} />
    </div>
  </div>
);

const GridItem = ({ data }) => {
  const immagine =
    !data.immagine || data.immagine === 'image_upload.png'
      ? data.geopoi?.immagine || 'image_upload.png'
      : data.immagine;

  return (
    <Card>
      <Row align="top">
        <Col span={4}>
          <img
            src={`${CLOUDFRONT_URL}/images/${immagine}`}
            style={{ width: '100%' }}
            alt={data.audioTitle}
          />
        </Col>
        <Col span={20}>
          <ItemInfo data={data} />
        </Col>
      </Row>
    </Card>
  );
};

export default function PoiListPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified content page
    router.replace('/app/content');
  }, [router]);

  return null;
}

// Old implementation below - kept for reference
function OldPoiListPage() {
  const router = useRouter();
  const locale = useSelector((state) => state.theme.locale);
  const [list, setList] = useState({ channel: { title: '', poiobjects: [] } });
  const [editChannel, setEditChannel] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [newProfile, setNewProfile] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const { Auth } = await import('aws-amplify');
        const user = await Auth.currentUserInfo();
        if (user) {
          setLoggedUser(user);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        router.push('/auth/login');
      }
    };

    loadUserInfo();
  }, [router]);

  useEffect(() => {
    const loadPOIs = async () => {
      if (!loggedUser) return;

      try {
        const { API, graphqlOperation } = await import('aws-amplify');
        const newList = { ...list };

        // Load profile info
        const profileResponse = await API.graphql(
          graphqlOperation(getProfileInfo, { PK: loggedUser.attributes.sub })
        );

        const profileInfo = profileResponse.data.getProfileInfo;
        setNewProfile(!profileInfo);

        if (profileInfo) {
          newList.channel.title = profileInfo.channelTitle || '';
        }

        // Load user's POIs
        const parameters = {
          filter: {
            lingua: locale,
            proprietario: loggedUser.username
          },
        };

        const poiResponse = await API.graphql(
          graphqlOperation(listMediaByProprietario, parameters)
        );

        const poiObjects = poiResponse.data.listMediaByProprietario.items || [];
        newList.channel.poiobjects = [...poiObjects];
        setList(newList);
      } catch (error) {
        console.error('Error loading POIs:', error);
        Modal.error({
          title: 'Errore',
          content: 'Errore nel caricamento dei POI: ' + error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    loadPOIs();
  }, [loggedUser, locale]);

  const handleChannelUpdate = async () => {
    try {
      const { API, graphqlOperation } = await import('aws-amplify');

      if (newProfile) {
        const input = {
          PK: loggedUser.attributes.sub,
          email: loggedUser.attributes.email,
          channelTitle: list.channel.title,
        };
        await API.graphql(graphqlOperation(createProfileInfo, { input }));
        setNewProfile(false);
      } else {
        await API.graphql(
          graphqlOperation(updateProfileChannel, {
            PK: loggedUser.attributes.sub,
            channelTitle: list.channel.title,
          })
        );
      }

      setEditChannel(false);
    } catch (error) {
      console.error('Error updating channel:', error);
      Modal.error({
        title: 'Errore',
        content: 'Errore nell\'aggiornamento del canale',
      });
    }
  };

  const canaleTitle = editChannel ? (
    <h2>
      <IntlMessage id="addeditpoi.canale" />{' '}
      <input
        type="text"
        name="channelName"
        className="pippo1"
        onChange={(e) => {
          const newList = { ...list };
          newList.channel.title = e.target.value;
          setList(newList);
        }}
        onBlur={handleChannelUpdate}
        defaultValue={list.channel.title}
        style={{
          border: '1px solid #d9d9d9',
          padding: '4px 11px',
          borderRadius: '2px',
        }}
      />
    </h2>
  ) : (
    <h3>
      <IntlMessage id="addeditpoi.canale" /> {list.channel.title}
    </h3>
  );

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
        <title>I miei POI - Civiglio</title>
      </Head>

      <div className="container-fluid">
        <div className="bg-white border-bottom">
          <div className="container-fluid">
            <Flex justifyContent="between" alignItems="center" className="py-4">
              {canaleTitle}
              <div>
                <div className="addpoi" style={{ display: 'inline-block', marginRight: '10px' }}>
                  <Link href="/app/poi/poidetail/create">
                    <Button type="primary">
                      <i className="fas fa-plus"></i> <IntlMessage id="add" /> POI
                    </Button>
                  </Link>
                </div>
                <Button
                  type="default"
                  onClick={() => setEditChannel(!editChannel)}
                >
                  <IntlMessage id="edit" />
                </Button>
                <span style={{ marginLeft: '10px' }}>
                  <PushpinOutlined /> {list.channel.poiobjects.length}
                </span>
              </div>
            </Flex>
          </div>
        </div>

        <br />
        <Row gutter={[16, 16]}>
          {list.channel.poiobjects.map((elm) => (
            <Col xs={24} md={12} key={`${elm.PK}_${elm.SK}`}>
              <GridItem data={elm} />
            </Col>
          ))}
        </Row>
      </div>
    </AppLayoutSimple>
  );
}
