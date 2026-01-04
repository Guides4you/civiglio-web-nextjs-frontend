import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API, graphqlOperation } from 'aws-amplify';
import IntlMessage from '../util-components/IntlMessage';
import { listMediaByProprietario } from '../../graphql/poiQueries';
import { CLOUDFRONT_URL } from '../../constants/ApiConstant';
import Loading from '../util-components/Loading';

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAudio: 0,
    inReview: 0,
    published: 0,
    rejected: 0,
    totalLikes: 0,
    totalPlays: 0,
  });
  const [recentContent, setRecentContent] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { Auth } = await import('aws-amplify');
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser(currentUser);

        // Fetch user's media
        const response = await API.graphql(
          graphqlOperation(listMediaByProprietario, {
            filter: {
              proprietario_uuid: currentUser.attributes.sub,
            },
            limit: 100, // Adjust if needed
          })
        );

        const items = response.data.listMediaByProprietario.items || [];

        // Calculate statistics
        const stats = {
          totalAudio: items.length,
          inReview: items.filter(
            (item) => item.richiesta_pubblicazione === true && item.stato_media !== 'approvato'
          ).length,
          published: items.filter((item) => item.stato_media === 'approvato').length,
          rejected: items.filter((item) => item.stato_media === 'rifiutato').length,
          totalLikes: items.reduce((sum, item) => sum + (item.geopoi?.likes || 0), 0),
          totalPlays: items.reduce((sum, item) => sum + (item.geopoi?.listen || 0), 0),
        };

        setStats(stats);

        // Get recent content (last 5)
        const recent = items
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentContent(recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return <Loading align="center" cover="content" />;
  }

  return (
    <>
      <div className="dashboard">
        {/* Welcome Section */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            <IntlMessage id="app.dashboard.welcome" />
            {user && `, ${user.attributes?.name || user.username}!`}
          </h1>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <i className="fa fa-music"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalAudio}</div>
              <div className="stat-label">
                <IntlMessage id="app.dashboard.stats.totalaudio" />
              </div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <i className="fa fa-clock-o"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.inReview}</div>
              <div className="stat-label">
                <IntlMessage id="app.dashboard.stats.inreview" />
              </div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <i className="fa fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.published}</div>
              <div className="stat-label">
                <IntlMessage id="app.dashboard.stats.published" />
              </div>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">
              <i className="fa fa-times-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.rejected}</div>
              <div className="stat-label">
                <IntlMessage id="app.dashboard.stats.rejected" />
              </div>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <i className="fa fa-heart"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalLikes}</div>
              <div className="stat-label">
                <IntlMessage id="app.dashboard.stats.totallikes" />
              </div>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <i className="fa fa-headphones"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalPlays}</div>
              <div className="stat-label">
                <IntlMessage id="app.dashboard.stats.totalplays" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section">
          <h2 className="section-title">
            <IntlMessage id="app.dashboard.quickactions" />
          </h2>
          <div className="quick-actions">
            <button
              className="action-card"
              onClick={() => router.push('/app/poi')}
            >
              <div className="action-icon">
                <i className="fa fa-plus-circle"></i>
              </div>
              <div className="action-label">
                <IntlMessage id="app.dashboard.quickactions.newaudio" />
              </div>
            </button>
          </div>
        </div>

        {/* Recent Content */}
        {recentContent.length > 0 && (
          <div className="section">
            <h2 className="section-title">
              <IntlMessage id="app.dashboard.recentcontent" />
            </h2>
            <div className="recent-content-list">
              {recentContent.map((item) => {
                const badge = getStatusBadge(item);
                return (
                  <div
                    key={item.SK}
                    className="content-item"
                    onClick={() => router.push(`/app/poi/poidetail/${item.PK}`)}
                  >
                    <div className="content-image">
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
                    </div>
                    <div className="content-info">
                      <h3 className="content-title">{item.audioTitle}</h3>
                      <p className="content-poi">{item.poi?.titolo}</p>
                      <div className="content-meta">
                        <span className={`badge badge-${badge.color}`}>
                          <IntlMessage id={badge.text} />
                        </span>
                        <span className="content-stats">
                          <i className="fa fa-heart"></i> {item.geopoi?.likes || 0}
                          <i className="fa fa-headphones"></i> {item.geopoi?.listen || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ========== Header ========== */
        .dashboard-header {
          margin-bottom: 32px;
        }

        .dashboard-title {
          font-size: 32px;
          font-weight: 700;
          color: #2d3748;
          margin: 0;
        }

        /* ========== Stats Grid ========== */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .stat-card.primary {
          border-left-color: #667eea;
        }

        .stat-card.warning {
          border-left-color: #f59e0b;
        }

        .stat-card.success {
          border-left-color: #10b981;
        }

        .stat-card.danger {
          border-left-color: #ef4444;
        }

        .stat-card.info {
          border-left-color: #3b82f6;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
        }

        .stat-card.primary .stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
        }

        .stat-card.warning .stat-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
        }

        .stat-card.success .stat-icon {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
        }

        .stat-card.danger .stat-icon {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #ffffff;
        }

        .stat-card.info .stat-icon {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #ffffff;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #2d3748;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: #6c757d;
          font-weight: 500;
        }

        /* ========== Section ========== */
        .section {
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 20px 0;
        }

        /* ========== Quick Actions ========== */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .action-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }

        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .action-icon {
          font-size: 48px;
          color: #ffffff;
        }

        .action-label {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          text-align: center;
        }

        /* ========== Recent Content ========== */
        .recent-content-list {
          display: grid;
          gap: 16px;
        }

        .content-item {
          background: #ffffff;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .content-item:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        }

        .content-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          background: #f0f0f0;
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
          font-size: 32px;
        }

        .content-info {
          flex: 1;
          min-width: 0;
        }

        .content-title {
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 4px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .content-poi {
          font-size: 14px;
          color: #6c757d;
          margin: 0 0 8px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .content-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .badge {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 12px;
          display: inline-block;
        }

        .badge-success {
          background: #d1fae5;
          color: #065f46;
        }

        .badge-warning {
          background: #fef3c7;
          color: #92400e;
        }

        .badge-danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .badge-secondary {
          background: #e5e7eb;
          color: #374151;
        }

        .content-stats {
          font-size: 13px;
          color: #6c757d;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .content-stats i {
          margin-right: 4px;
          color: #667eea;
        }

        /* ========== Responsive ========== */
        @media (max-width: 768px) {
          .dashboard-title {
            font-size: 24px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .content-item {
            flex-direction: column;
          }

          .content-image {
            width: 100%;
            height: 180px;
          }
        }
      `}</style>
    </>
  );
};

export default Dashboard;
