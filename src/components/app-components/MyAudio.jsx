import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API, graphqlOperation } from 'aws-amplify';
import { message, Modal } from 'antd';
import IntlMessage from '../util-components/IntlMessage';
import { listMediaByProprietario } from '../../graphql/poiQueries';
import { richiestaPubblicazioneMedia } from '../../graphql/poiMutations';
import { CLOUDFRONT_URL } from '../../constants/ApiConstant';
import Loading from '../util-components/Loading';

const MyAudio = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [audioList, setAudioList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchAudioList();
  }, []);

  useEffect(() => {
    filterAudioList();
  }, [activeFilter, audioList]);

  const fetchAudioList = async () => {
    setLoading(true);
    try {
      const { Auth } = await import('aws-amplify');
      const currentUser = await Auth.currentAuthenticatedUser();

      const response = await API.graphql(
        graphqlOperation(listMediaByProprietario, {
          filter: {
            proprietario_uuid: currentUser.attributes.sub,
          },
          limit: 100,
        })
      );

      const items = response.data.listMediaByProprietario.items || [];
      setAudioList(items);
    } catch (error) {
      console.error('Error fetching audio list:', error);
      messageApi.error('Errore nel caricamento degli audio');
    } finally {
      setLoading(false);
    }
  };

  const filterAudioList = () => {
    let filtered = [...audioList];

    switch (activeFilter) {
      case 'draft':
        filtered = audioList.filter(
          (item) =>
            !item.richiesta_pubblicazione && item.stato_media !== 'approvato'
        );
        break;
      case 'review':
        filtered = audioList.filter(
          (item) =>
            item.richiesta_pubblicazione === true &&
            item.stato_media !== 'approvato'
        );
        break;
      case 'published':
        filtered = audioList.filter((item) => item.stato_media === 'approvato');
        break;
      case 'rejected':
        filtered = audioList.filter((item) => item.stato_media === 'rifiutato');
        break;
      default:
        filtered = audioList;
    }

    // Sort by creation date (most recent first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredList(filtered);
  };

  const getStatusBadge = (item) => {
    if (item.stato_media === 'approvato') {
      return { color: 'success', text: 'app.audio.status.published' };
    } else if (item.richiesta_pubblicazione === true) {
      return { color: 'warning', text: 'app.audio.status.review' };
    } else if (item.stato_media === 'rifiutato') {
      return { color: 'danger', text: 'app.audio.status.rejected' };
    }
    return { color: 'secondary', text: 'app.audio.status.draft' };
  };

  const handleRequestPublication = async (item) => {
    try {
      await API.graphql(
        graphqlOperation(richiestaPubblicazioneMedia, {
          PK: item.PK,
          SK: item.SK,
          value: true,
        })
      );

      messageApi.success('Richiesta di pubblicazione inviata con successo');
      fetchAudioList();
    } catch (error) {
      console.error('Error requesting publication:', error);
      messageApi.error('Errore nell\'invio della richiesta');
    }
  };

  const handleEdit = (item) => {
    router.push(`/app/poi/poidetail/${item.PK}`);
  };

  const handleDelete = (item) => {
    Modal.confirm({
      title: 'Conferma eliminazione',
      content: `Sei sicuro di voler eliminare "${item.audioTitle}"?`,
      okText: 'Elimina',
      okType: 'danger',
      cancelText: 'Annulla',
      onOk: async () => {
        // TODO: Implement delete functionality when API is available
        messageApi.warning('Funzionalità in sviluppo');
      },
    });
  };

  const filters = [
    { key: 'all', label: 'app.audio.filter.all' },
    { key: 'draft', label: 'app.audio.filter.draft' },
    { key: 'review', label: 'app.audio.filter.review' },
    { key: 'published', label: 'app.audio.filter.published' },
    { key: 'rejected', label: 'app.audio.filter.rejected' },
  ];

  if (loading) {
    return <Loading align="center" cover="content" />;
  }

  return (
    <>
      {contextHolder}
      <div className="my-audio">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">
            <IntlMessage id="app.audio.title" />
          </h1>
        </div>

        {/* Filters */}
        <div className="filters">
          {filters.map((filter) => (
            <button
              key={filter.key}
              className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              <IntlMessage id={filter.label} />
              {filter.key !== 'all' && (
                <span className="count">
                  {
                    audioList.filter((item) => {
                      switch (filter.key) {
                        case 'draft':
                          return (
                            !item.richiesta_pubblicazione &&
                            item.stato_media !== 'approvato'
                          );
                        case 'review':
                          return (
                            item.richiesta_pubblicazione === true &&
                            item.stato_media !== 'approvato'
                          );
                        case 'published':
                          return item.stato_media === 'approvato';
                        case 'rejected':
                          return item.stato_media === 'rifiutato';
                        default:
                          return true;
                      }
                    }).length
                  }
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Audio List */}
        {filteredList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fa fa-music"></i>
            </div>
            <h3 className="empty-title">
              <IntlMessage id="app.audio.empty" />
            </h3>
            <p className="empty-desc">
              <IntlMessage id="app.audio.empty.desc" />
            </p>
            <button
              className="btn-primary"
              onClick={() => router.push('/app/poi')}
            >
              <i className="fa fa-plus"></i>
              <IntlMessage id="app.dashboard.quickactions.newaudio" />
            </button>
          </div>
        ) : (
          <div className="audio-grid">
            {filteredList.map((item) => {
              const badge = getStatusBadge(item);
              const canRequestPublication =
                !item.richiesta_pubblicazione &&
                item.stato_media !== 'approvato';

              return (
                <div key={item.SK} className="audio-card">
                  {/* Audio Image */}
                  <div className="audio-image">
                    {item.immagine ? (
                      <img
                        src={`${CLOUDFRONT_URL}/images/mediaitem/${item.immagine}`}
                        alt={item.audioTitle}
                      />
                    ) : (
                      <div className="placeholder-image">
                        <i className="fa fa-music"></i>
                      </div>
                    )}
                    <span className={`status-badge badge-${badge.color}`}>
                      <IntlMessage id={badge.text} />
                    </span>
                  </div>

                  {/* Audio Info */}
                  <div className="audio-info">
                    <h3 className="audio-title">{item.audioTitle}</h3>
                    <p className="audio-poi">
                      <i className="fa fa-map-marker"></i>
                      {item.poi?.titolo}
                    </p>

                    {/* Stats */}
                    <div className="audio-stats">
                      <span>
                        <i className="fa fa-heart"></i>
                        {item.geopoi?.likes || 0}
                      </span>
                      <span>
                        <i className="fa fa-headphones"></i>
                        {item.geopoi?.listen || 0}
                      </span>
                      {item.price > 0 && (
                        <span className="price">€{item.price}</span>
                      )}
                    </div>

                    {/* Rejection Reason */}
                    {item.stato_media === 'rifiutato' && item.motivoRifiuto && (
                      <div className="rejection-reason">
                        <i className="fa fa-exclamation-circle"></i>
                        {item.motivoRifiuto}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="audio-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(item)}
                      title="Modifica"
                    >
                      <i className="fa fa-edit"></i>
                    </button>

                    {canRequestPublication && (
                      <button
                        className="action-btn publish"
                        onClick={() => handleRequestPublication(item)}
                        title="Richiedi Pubblicazione"
                      >
                        <i className="fa fa-paper-plane"></i>
                      </button>
                    )}

                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(item)}
                      title="Elimina"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .my-audio {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ========== Page Header ========== */
        .page-header {
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #2d3748;
          margin: 0;
        }

        /* ========== Filters ========== */
        .filters {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 20px;
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          background: #ffffff;
          color: #4a5568;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-btn:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          color: #ffffff;
        }

        .count {
          background: rgba(255, 255, 255, 0.3);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .filter-btn.active .count {
          background: rgba(255, 255, 255, 0.3);
        }

        .filter-btn:not(.active) .count {
          background: #f3f4f6;
          color: #667eea;
        }

        /* ========== Audio Grid ========== */
        .audio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .audio-card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .audio-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .audio-image {
          position: relative;
          width: 100%;
          height: 200px;
          background: #f0f0f0;
          overflow: hidden;
        }

        .audio-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          font-size: 48px;
        }

        .status-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 16px;
        }

        .badge-success {
          background: #10b981;
          color: #ffffff;
        }

        .badge-warning {
          background: #f59e0b;
          color: #ffffff;
        }

        .badge-danger {
          background: #ef4444;
          color: #ffffff;
        }

        .badge-secondary {
          background: #6b7280;
          color: #ffffff;
        }

        .audio-info {
          padding: 20px;
        }

        .audio-title {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 8px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          min-height: 50px;
        }

        .audio-poi {
          font-size: 14px;
          color: #6c757d;
          margin: 0 0 12px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .audio-poi i {
          margin-right: 6px;
          color: #667eea;
        }

        .audio-stats {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          color: #6c757d;
        }

        .audio-stats span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .audio-stats i {
          color: #667eea;
        }

        .price {
          font-weight: 600;
          color: #10b981;
        }

        .rejection-reason {
          margin-top: 12px;
          padding: 12px;
          background: #fee2e2;
          border-left: 3px solid #ef4444;
          border-radius: 6px;
          font-size: 13px;
          color: #991b1b;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .rejection-reason i {
          margin-top: 2px;
          flex-shrink: 0;
        }

        .audio-actions {
          padding: 16px 20px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .action-btn.edit {
          background: #eef2ff;
          color: #667eea;
        }

        .action-btn.edit:hover {
          background: #667eea;
          color: #ffffff;
        }

        .action-btn.publish {
          background: #d1fae5;
          color: #065f46;
        }

        .action-btn.publish:hover {
          background: #10b981;
          color: #ffffff;
        }

        .action-btn.delete {
          background: #fee2e2;
          color: #991b1b;
        }

        .action-btn.delete:hover {
          background: #ef4444;
          color: #ffffff;
        }

        /* ========== Empty State ========== */
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .empty-icon {
          font-size: 80px;
          color: #d1d5db;
          margin-bottom: 24px;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 12px 0;
        }

        .empty-desc {
          font-size: 16px;
          color: #6c757d;
          margin: 0 0 32px 0;
        }

        .btn-primary {
          padding: 12px 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        /* ========== Responsive ========== */
        @media (max-width: 768px) {
          .page-title {
            font-size: 24px;
          }

          .audio-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default MyAudio;
