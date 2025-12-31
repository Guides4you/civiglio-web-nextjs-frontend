import { Button, Image } from "antd";
import { CLOUDFRONT_URL } from "../../../constants/ApiConstant";
import React, { useContext, useEffect, useState } from "react";
import { CiviglioConsumer, CiviglioContext } from "../../layouts/PubLayout";
import { FolderViewOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import IntlMessage from "../../util-components/IntlMessage";
import ExpandableParagraph from "./ExpandableParagraph";
import { useRouter } from 'next/router';

const AudiosPoi = ({ poi }) => {
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [currentAudio, setCurrentAudio] = useState();
  const [poiAudios, setPoiAudios] = useState(poi.audioMediaItems);
  const { locale } = useSelector((state) => state.theme);
  const context = useContext(CiviglioContext);
  const router = useRouter();
  const isMobile = JSON.parse(router.query.mobile || 'false');

  const audios = poiAudios.items.filter((x) => x.lingua === locale);

  const isUserAuthenticated = () => {
    return context.getUser();
  };

  const reloadAudioItems = async () => {
    try {
      const { API, graphqlOperation } = await import('aws-amplify');
      const { GRAPHQL_AUTH_MODE } = await import('@aws-amplify/api-graphql');
      const { getGeoPoi } = await import('../../../graphql/publicQueries');

      const result = await API.graphql({
        query: getGeoPoi,
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
        variables: { rangeKey: poi.PK, SK: poi.SK },
      });

      setPoiAudios(result.data.getGeoPoi.audioMediaItems);
    } catch (e) {
      console.log(e);
    }
  };

  const recordPlayAudioEvent = async (audio, isPaid) => {
    try {
      const { Analytics } = await import('aws-amplify');

      if (isPaid) {
        Analytics.record({
          name: "playAudioAbstract",
          attributes: {
            lingua: audio.lingua,
            proprietario: poi.proprietario,
            mediaPK: poi.PK,
            mediaSK: poi.SK,
          },
        });
      } else {
        Analytics.record({
          name: "playAudio",
          attributes: {
            lingua: audio.lingua,
            proprietario: poi.proprietario,
            mediaPK: audio.PK,
            mediaSK: audio.SK,
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLike = async (audio) => {
    const auth = isUserAuthenticated();

    if (!auth.current) {
      context.showLogin();
    } else {
      try {
        const { API, graphqlOperation } = await import('aws-amplify');
        const { addLikeMedia } = await import('../../../graphql/publicMutations');

        await API.graphql(
          graphqlOperation(addLikeMedia, {
            PK: audio.PK,
            SK: audio.SK,
            user: auth.current.attributes.sub,
          })
        );

        reloadAudioItems();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleDislike = async (audio) => {
    const auth = isUserAuthenticated();
    if (!auth.current) {
      context.showLogin();
    } else {
      try {
        const { API, graphqlOperation } = await import('aws-amplify');
        const { removeLikeMedia } = await import('../../../graphql/publicMutations');

        await API.graphql(
          graphqlOperation(removeLikeMedia, {
            PK: audio.PK,
            SK: audio.SK,
            user: auth.current.attributes.sub,
          })
        );

        reloadAudioItems();
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (isUserAuthenticated().current) {
      reloadAudioItems();
    }
  }, [context]);

  return (
    <div className="audio-guides-section">
      <h2 className="section-title">
        <i className="fa fa-headphones section-icon"></i>
        <IntlMessage id="poidetail.audio" />
      </h2>

      <div className="audio-cards-grid">
        {audios.map((a) => (
          <div className="audio-card" key={a.SK}>
            {/* Card Image */}
            <div className="card-image">
              <Image
                preview={false}
                src={`${CLOUDFRONT_URL}/images/${a.immagine}`}
                alt={a.audioTitle}
                className="audio-thumbnail"
              />
              <div className="card-badge-container">
                {a.price === 0 ? (
                  <span className="card-badge badge-free">FREE</span>
                ) : (
                  <span className="card-badge badge-premium">PREMIUM</span>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="card-content">
              {/* Header with Play Button and Title */}
              <div className="card-header">
                <CiviglioConsumer>
                  {(value) => {
                    value.setAudioEndFn(() => setAudioPlayed(false));

                    return (
                      <button
                        className={`play-button ${audioPlayed && currentAudio?.SK === a.SK ? 'playing' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          if (audioPlayed && currentAudio?.SK === a.SK) {
                            value.pauseAudio();
                            setAudioPlayed(false);
                          } else {
                            const p = value.setPlayedObject(a);
                            recordPlayAudioEvent(a, a.price > 0);
                            if (p) {
                              setAudioPlayed(true);
                              setCurrentAudio(a);
                            }
                          }
                        }}
                      >
                        <i className={`fa ${audioPlayed && currentAudio?.SK === a.SK ? 'fa-pause' : 'fa-play'}`}></i>
                      </button>
                    );
                  }}
                </CiviglioConsumer>

                <div className="card-title-wrapper">
                  <h3 className="card-title">{a.audioTitle}</h3>
                  <div className="card-meta">
                    <span className="meta-item">
                      <i className="fa fa-user"></i>
                      <span
                        className="channel-link"
                        onClick={() => {
                          router.push(
                            `/guide/pub/canale/${a.proprietario_uuid}?mobile=${isMobile}`
                          );
                        }}
                      >
                        {a.owner?.channelTitle || "Channel"}
                      </span>
                    </span>
                    <span className="meta-item">
                      <i className="fa fa-globe"></i>
                      {a.lingua?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="card-actions-top">
                  <button
                    className={`like-button ${a.liked ? 'liked' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (a.liked) {
                        handleDislike(a);
                      } else {
                        handleLike(a);
                      }
                    }}
                    title={a.liked ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                  >
                    <i className={`fa ${a.liked ? 'fa-heart' : 'fa-heart-o'}`}></i>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="card-description">
                <ExpandableParagraph text={a.description} />
              </div>

              {/* Footer Actions */}
              <div className="card-footer">
                <div className="price-tag">
                  {a.price === 0 ? (
                    <span className="price-free">Gratuito</span>
                  ) : (
                    <span className="price-amount">€{a.price}</span>
                  )}
                </div>

                <div className="card-actions">
                  <Button
                    type="link"
                    size="small"
                    icon={<FolderViewOutlined />}
                    onClick={() => {
                      router.push(
                        `/guide/pub/canale/${a.proprietario_uuid}?mobile=${isMobile}`
                      );
                    }}
                  >
                    <IntlMessage id="poidetail.channel" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .audio-guides-section {
          margin-bottom: 48px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-icon {
          font-size: 28px;
          color: #667eea;
        }

        .audio-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
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
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transform: translateY(-4px);
        }

        .card-image {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        :global(.audio-thumbnail) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-badge-container {
          position: absolute;
          top: 12px;
          left: 12px;
        }

        .card-badge {
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-free {
          background: #52c41a;
          color: #ffffff;
        }

        .badge-premium {
          background: linear-gradient(135deg, #faad14 0%, #ff9c00 100%);
          color: #ffffff;
        }

        .card-content {
          padding: 20px;
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }

        .play-button {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: #ffffff;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .play-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .play-button.playing {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        .card-title-wrapper {
          flex: 1;
          min-width: 0;
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6c757d;
        }

        .meta-item i {
          font-size: 14px;
        }

        .channel-link {
          color: #3e82f7;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .channel-link:hover {
          color: #667eea;
          text-decoration: underline;
        }

        .card-actions-top {
          flex-shrink: 0;
        }

        /* Modern Like Button */
        .like-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f0f0f0;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .like-button i {
          font-size: 18px;
          color: #9d9d9d;
          transition: all 0.3s ease;
        }

        .like-button:hover {
          background: #ffe6e6;
          transform: scale(1.1);
        }

        .like-button:hover i {
          color: #ff6b6b;
        }

        .like-button.liked {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
        }

        .like-button.liked i {
          color: #ffffff;
        }

        .like-button:active {
          transform: scale(0.9);
        }

        /* Fix: Override global like-icon styles to prevent appearing on map */
        .audio-card :global(.like-icon) {
          display: none !important;
        }

        .card-description {
          margin-bottom: 16px;
          color: #6c757d;
          font-size: 15px;
          line-height: 1.6;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        .price-tag {
          font-size: 16px;
          font-weight: 700;
        }

        .price-free {
          color: #52c41a;
        }

        .price-amount {
          color: #faad14;
        }

        .card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-actions :global(.ant-btn) {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          height: auto;
          font-size: 14px;
          color: #667eea;
          transition: all 0.2s ease;
        }

        .card-actions :global(.ant-btn:hover) {
          color: #764ba2;
          transform: translateX(2px);
        }

        .card-actions :global(.ant-btn .anticon) {
          font-size: 16px;
          display: flex;
          align-items: center;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 24px;
          }

          .card-image {
            height: 160px;
          }

          .card-content {
            padding: 16px;
          }

          .play-button {
            width: 40px;
            height: 40px;
            font-size: 14px;
          }

          .card-title {
            font-size: 18px;
          }

          .card-meta {
            gap: 12px;
          }

          .meta-item {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default AudiosPoi;
