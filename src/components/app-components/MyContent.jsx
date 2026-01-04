import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API, graphqlOperation } from 'aws-amplify';
import { message, Modal, Input } from 'antd';
import { useSelector } from 'react-redux';
import IntlMessage from '../util-components/IntlMessage';
import { listMediaByProprietario } from '../../graphql/poiQueries';
import { getProfileInfo } from '../../graphql/profileQueries';
import { richiestaPubblicazioneMedia, updateProfileChannel } from '../../graphql/poiMutations';
import { createProfileInfo } from '../../graphql/profileMutations';
import { CLOUDFRONT_URL } from '../../constants/ApiConstant';
import Loading from '../util-components/Loading';

const MyContent = () => {
  const router = useRouter();
  const locale = useSelector((state) => state.theme.locale);

  const [loading, setLoading] = useState(true);
  const [contentList, setContentList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Channel info
  const [channelTitle, setChannelTitle] = useState('');
  const [editingChannel, setEditingChannel] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadUserAndContent();
  }, []);

  useEffect(() => {
    filterContentList();
  }, [activeFilter, languageFilter, searchQuery, contentList]);

  const loadUserAndContent = async () => {
    setLoading(true);
    try {
      const { Auth } = await import('aws-amplify');
      const userInfo = await Auth.currentUserInfo();

      if (!userInfo) {
        message.error('Utente non autenticato');
        setLoading(false);
        return;
      }

      setCurrentUser(userInfo);

      // Load profile info
      const profileResponse = await API.graphql(
        graphqlOperation(getProfileInfo, { PK: userInfo.attributes.sub })
      );

      const profile = profileResponse.data.getProfileInfo;
      if (profile) {
        setChannelTitle(profile.channelTitle || '');
        setIsNewProfile(false);
      } else {
        setIsNewProfile(true);
      }

      // Load all user's content
      // Note: This query loads items for ALL languages and then we filter client-side
      console.log('User info:', {
        username: userInfo.username,
        sub: userInfo.attributes.sub,
      });

      // Query without language filter to get all content
      const allItems = [];
      const languages = ['it', 'en', 'fr'];

      for (const lang of languages) {
        try {
          const parameters = {
            filter: {
              lingua: lang,
              proprietario: userInfo.username,
            },
          };

          console.log(`Trying query for language ${lang}:`, parameters);
          const response = await API.graphql(
            graphqlOperation(listMediaByProprietario, parameters)
          );

          const langItems = response.data.listMediaByProprietario.items || [];
          console.log(`Found ${langItems.length} items for ${lang}`);
          allItems.push(...langItems);
        } catch (err) {
          console.warn(`Error loading ${lang} content:`, err.message);
          // Continue with next language
        }
      }

      const items = allItems;

      console.log('Loaded content items:', items.length);
      console.log('Content items:', items);
      setContentList(items);
    } catch (error) {
      console.error('Error loading content:', error);
      if (error.errors && error.errors.length > 0) {
        console.error('GraphQL errors:', error.errors);
        error.errors.forEach((err, idx) => {
          console.error(`Error ${idx + 1}:`, err.message);
        });
      }
      message.error('Errore nel caricamento dei contenuti');
    } finally {
      setLoading(false);
    }
  };

  const filterContentList = () => {
    let filtered = [...contentList];

    // Filter by status
    switch (activeFilter) {
      case 'draft':
        filtered = filtered.filter(
          (item) =>
            !item.richiesta_pubblicazione && item.stato_media !== 'approvato'
        );
        break;
      case 'review':
        filtered = filtered.filter(
          (item) =>
            item.richiesta_pubblicazione === true &&
            item.stato_media !== 'approvato'
        );
        break;
      case 'published':
        filtered = filtered.filter((item) => item.stato_media === 'approvato');
        break;
      case 'rejected':
        filtered = filtered.filter((item) => item.stato_media === 'rifiutato');
        break;
    }

    // Filter by language
    if (languageFilter !== 'all') {
      filtered = filtered.filter((item) => item.lingua === languageFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.audioTitle?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.poi?.titolo?.toLowerCase().includes(query)
      );
    }

    // Sort by creation date (most recent first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredList(filtered);
  };

  const getStatusBadge = (item) => {
    if (item.stato_media === 'approvato') {
      return { color: 'success', text: 'app.content.status.published' };
    } else if (item.richiesta_pubblicazione === true) {
      return { color: 'warning', text: 'app.content.status.review' };
    } else if (item.stato_media === 'rifiutato') {
      return { color: 'danger', text: 'app.content.status.rejected' };
    }
    return { color: 'secondary', text: 'app.content.status.draft' };
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

      message.success('Richiesta di pubblicazione inviata con successo');
      loadUserAndContent();
    } catch (error) {
      console.error('Error requesting publication:', error);
      message.error("Errore nell'invio della richiesta");
    }
  };

  const handleEdit = (item) => {
    // Format: PK__SK (without leading underscore from SK)
    const skPart = item.SK.startsWith('_') ? item.SK.substring(1) : item.SK;
    router.push(`/app/poi/poidetail/${item.PK}__${skPart}`);
  };

  const handleDelete = (item) => {
    Modal.warning({
      title: 'Funzionalità non disponibile',
      content: 'La funzione di eliminazione sarà disponibile prossimamente.',
      okText: 'OK',
    });
  };

  const handleChannelSave = async () => {
    if (!channelTitle.trim()) {
      message.error('Inserisci un titolo per il canale');
      return;
    }

    try {
      if (isNewProfile) {
        const input = {
          PK: currentUser.attributes.sub,
          email: currentUser.attributes.email,
          channelTitle: channelTitle,
        };
        await API.graphql(graphqlOperation(createProfileInfo, { input }));
        setIsNewProfile(false);
      } else {
        await API.graphql(
          graphqlOperation(updateProfileChannel, {
            PK: currentUser.attributes.sub,
            channelTitle: channelTitle,
          })
        );
      }

      setEditingChannel(false);
      message.success('Canale aggiornato con successo');
    } catch (error) {
      console.error('Error updating channel:', error);
      message.error("Errore nell'aggiornamento del canale");
    }
  };

  const statusFilters = [
    { key: 'all', label: 'app.content.filter.all' },
    { key: 'draft', label: 'app.content.filter.draft' },
    { key: 'review', label: 'app.content.filter.review' },
    { key: 'published', label: 'app.content.filter.published' },
    { key: 'rejected', label: 'app.content.filter.rejected' },
  ];

  const languageFilters = [
    { key: 'all', label: 'Tutte' },
    { key: 'it', label: 'Italiano' },
    { key: 'en', label: 'English' },
    { key: 'fr', label: 'Français' },
  ];

  const getCountForFilter = (filterKey) => {
    return contentList.filter((item) => {
      switch (filterKey) {
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
    }).length;
  };

  if (loading) {
    return <Loading align="center" cover="content" />;
  }

  return (
    <>
      <div className="my-content">
        {/* Channel Header */}
        <div className="channel-header">
          <div className="channel-info">
            <div className="channel-icon">
              <i className="fa fa-tv"></i>
            </div>
            <div className="channel-details">
              <span className="channel-label">
                <IntlMessage id="app.content.channel" />
              </span>
              {editingChannel ? (
                <Input
                  value={channelTitle}
                  onChange={(e) => setChannelTitle(e.target.value)}
                  onPressEnter={handleChannelSave}
                  onBlur={handleChannelSave}
                  placeholder="Nome del tuo canale"
                  autoFocus
                  className="channel-input"
                />
              ) : (
                <h2 className="channel-title">
                  {channelTitle || 'Il Mio Canale'}
                  <button
                    className="edit-channel-btn"
                    onClick={() => setEditingChannel(true)}
                  >
                    <i className="fa fa-pencil"></i>
                  </button>
                </h2>
              )}
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={() => router.push('/app/poi/poidetail/create')}
          >
            <i className="fa fa-plus"></i>
            <IntlMessage id="app.content.new" />
          </button>
        </div>

        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">
            <IntlMessage id="app.content.title" />
          </h1>
          <p className="page-subtitle">
            <IntlMessage id="app.content.subtitle" />
          </p>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <Input
            prefix={<i className="fa fa-search"></i>}
            placeholder="Cerca per titolo, descrizione o POI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="large"
            allowClear
          />
        </div>

        {/* Filters Row */}
        <div className="filters-row">
          {/* Status Filters */}
          <div className="filters-group">
            <span className="filter-label">Stato:</span>
            <div className="filters">
              {statusFilters.map((filter) => (
                <button
                  key={filter.key}
                  className={`filter-btn ${
                    activeFilter === filter.key ? 'active' : ''
                  }`}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  <IntlMessage id={filter.label} />
                  {filter.key !== 'all' && (
                    <span className="count">{getCountForFilter(filter.key)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Language Filters */}
          <div className="filters-group">
            <span className="filter-label">Lingua:</span>
            <div className="filters">
              {languageFilters.map((filter) => (
                <button
                  key={filter.key}
                  className={`filter-btn ${
                    languageFilter === filter.key ? 'active' : ''
                  }`}
                  onClick={() => setLanguageFilter(filter.key)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {filteredList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fa fa-folder-open"></i>
            </div>
            <h3 className="empty-title">
              {searchQuery || activeFilter !== 'all' || languageFilter !== 'all' ? (
                <IntlMessage id="app.content.empty.filtered" />
              ) : (
                <IntlMessage id="app.content.empty" />
              )}
            </h3>
            <p className="empty-desc">
              {searchQuery || activeFilter !== 'all' || languageFilter !== 'all' ? (
                <IntlMessage id="app.content.empty.filtered.desc" />
              ) : (
                <IntlMessage id="app.content.empty.desc" />
              )}
            </p>
            {!searchQuery && activeFilter === 'all' && languageFilter === 'all' && (
              <button
                className="btn-primary"
                onClick={() => router.push('/app/poi/poidetail/create')}
              >
                <i className="fa fa-plus"></i>
                <IntlMessage id="app.content.new" />
              </button>
            )}
          </div>
        ) : (
          <div className="content-grid">
            {filteredList.map((item) => {
              const badge = getStatusBadge(item);
              const canRequestPublication =
                !item.richiesta_pubblicazione &&
                item.stato_media !== 'approvato';

              const imageUrl = item.immagine
                ? `${CLOUDFRONT_URL}/images/${item.immagine}`
                : item.geopoi?.immagine
                ? `${CLOUDFRONT_URL}/images/${item.geopoi.immagine}`
                : null;

              return (
                <div key={item.SK} className="content-card">
                  {/* Content Image */}
                  <div className="content-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.audioTitle} />
                    ) : (
                      <div className="placeholder-image">
                        <i className="fa fa-music"></i>
                      </div>
                    )}
                    <span className={`status-badge badge-${badge.color}`}>
                      <IntlMessage id={badge.text} />
                    </span>
                    <span className="language-badge">{item.lingua?.toUpperCase()}</span>
                  </div>

                  {/* Content Info */}
                  <div className="content-info">
                    <h3 className="content-title">{item.audioTitle}</h3>
                    {item.poi?.titolo && (
                      <p className="content-poi">
                        <i className="fa fa-map-marker"></i>
                        {item.poi.titolo}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="content-stats">
                      <span>
                        <i className="fa fa-heart"></i>
                        {item.geopoi?.likes || 0}
                      </span>
                      <span>
                        <i className="fa fa-headphones"></i>
                        {item.geopoi?.listen || 0}
                      </span>
                      <span>
                        <i className="fa fa-users"></i>
                        {item.geopoi?.follower || 0}
                      </span>
                      {item.price > 0 && (
                        <span className="price">€{item.price.toFixed(2)}</span>
                      )}
                    </div>

                    {/* Rejection Reason */}
                    {item.stato_media === 'rifiutato' && item.motivoRifiuto && (
                      <div className="rejection-reason">
                        <i className="fa fa-exclamation-circle"></i>
                        <span>{item.motivoRifiuto}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="content-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(item)}
                      title="Modifica"
                    >
                      <i className="fa fa-edit"></i>
                      <span>Modifica</span>
                    </button>

                    {canRequestPublication && (
                      <button
                        className="action-btn publish"
                        onClick={() => handleRequestPublication(item)}
                        title="Richiedi Pubblicazione"
                      >
                        <i className="fa fa-paper-plane"></i>
                        <span>Pubblica</span>
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
        .my-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ========== Channel Header ========== */
        .channel-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }

        .channel-info {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;
        }

        .channel-icon {
          width: 64px;
          height: 64px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: #ffffff;
        }

        .channel-details {
          flex: 1;
        }

        .channel-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .channel-title {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          margin: 4px 0 0 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .edit-channel-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .edit-channel-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        :global(.channel-input) {
          font-size: 28px;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
        }

        :global(.channel-input::placeholder) {
          color: rgba(255, 255, 255, 0.6);
        }

        /* ========== Page Header ========== */
        .page-header {
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 8px 0;
        }

        .page-subtitle {
          font-size: 16px;
          color: #6c757d;
          margin: 0;
        }

        /* ========== Search Bar ========== */
        .search-bar {
          margin-bottom: 24px;
        }

        .search-bar :global(.ant-input-affix-wrapper) {
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          padding: 12px 16px;
        }

        .search-bar :global(.ant-input-affix-wrapper:focus),
        .search-bar :global(.ant-input-affix-wrapper-focused) {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* ========== Filters ========== */
        .filters-row {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }

        .filters-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-label {
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
          min-width: 50px;
        }

        .filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          flex: 1;
        }

        .filter-btn {
          padding: 8px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 20px;
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
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
        }

        .filter-btn:not(.active) .count {
          background: #f3f4f6;
          color: #667eea;
        }

        /* ========== Content Grid ========== */
        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .content-card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .content-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .content-image {
          position: relative;
          width: 100%;
          height: 200px;
          background: #f0f0f0;
          overflow: hidden;
        }

        .content-image img {
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
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .language-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 10px;
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.6);
          color: #ffffff;
          letter-spacing: 0.5px;
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

        .content-info {
          padding: 20px;
          flex: 1;
        }

        .content-title {
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

        .content-poi {
          font-size: 14px;
          color: #6c757d;
          margin: 0 0 12px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .content-poi i {
          margin-right: 6px;
          color: #667eea;
        }

        .content-stats {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          color: #6c757d;
          flex-wrap: wrap;
        }

        .content-stats span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .content-stats i {
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

        .content-actions {
          padding: 16px 20px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 8px;
        }

        .action-btn {
          flex: 1;
          height: 40px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .action-btn i {
          font-size: 16px;
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
          flex: 0 0 40px;
        }

        .action-btn.delete span {
          display: none;
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
          .channel-header {
            flex-direction: column;
            gap: 20px;
            padding: 24px;
          }

          .channel-info {
            width: 100%;
          }

          .btn-primary {
            width: 100%;
            justify-content: center;
          }

          .page-title {
            font-size: 24px;
          }

          .content-grid {
            grid-template-columns: 1fr;
          }

          .filters-group {
            flex-direction: column;
            align-items: flex-start;
          }

          .filter-label {
            width: 100%;
          }

          .action-btn span {
            display: none;
          }

          .action-btn {
            flex: 1;
          }
        }
      `}</style>
    </>
  );
};

export default MyContent;
