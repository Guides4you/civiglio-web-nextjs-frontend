import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Image, Switch } from 'antd';
import { API, graphqlOperation } from 'aws-amplify';
import { CLOUDFRONT_URL } from '../../../constants/ApiConstant';
import { CiviglioContext } from '../../layouts/PubLayout';
import IntlMessage from '../../util-components/IntlMessage';
import { useSelector } from 'react-redux';
import ChannelStats from './ChannelStats';
import MediaItemCard from './MediaItemCard';
import { addFollowerCanale, removeFollowerCanale } from '../../../graphql/publicMutations';
import { getFollowedCanaleByUser } from '../../../graphql/publicQueries';

const ChannelProfile = ({ profileInfo: initialProfileInfo, medias: initialMedias, channelId }) => {
  const router = useRouter();
  const context = useContext(CiviglioContext);
  const { locale } = useSelector((state) => state.theme);

  const [profileInfo, setProfileInfo] = useState(initialProfileInfo);
  const [medias, setMedias] = useState(initialMedias);
  const [isFollowing, setIsFollowing] = useState(false);
  const [update, setUpdate] = useState(false);

  const random = parseInt(Math.round(100) * 100);

  // Check if user is authenticated
  const getUserAuth = () => {
    return context.getUser();
  };

  // Check if user is following this channel
  useEffect(() => {
    const checkFollowing = async () => {
      const user = getUserAuth();
      if (user?.current && profileInfo) {
        try {
          const response = await API.graphql(
            graphqlOperation(getFollowedCanaleByUser, {
              canale: profileInfo.PK,
              user: user.current.attributes.sub,
            })
          );

          if (response.data.getFollowedCanaleByUser) {
            setIsFollowing(true);
          } else {
            setIsFollowing(false);
          }
        } catch (error) {
          console.error('Error checking follow status:', error);
        }
      }
    };

    checkFollowing();
  }, [profileInfo, context]);

  // Handle follow/unfollow
  const handleFollowToggle = async (checked) => {
    const user = getUserAuth();

    if (!user?.current) {
      context.showLogin();
      return;
    }

    try {
      if (checked) {
        // Follow
        const response = await API.graphql(
          graphqlOperation(addFollowerCanale, {
            canale: profileInfo.PK,
            user: user.current.attributes.sub,
          })
        );

        const updatedProfile = { ...profileInfo };
        updatedProfile.followers = response.data.addFollowerCanale;
        setProfileInfo(updatedProfile);
        setIsFollowing(true);
      } else {
        // Unfollow
        const response = await API.graphql(
          graphqlOperation(removeFollowerCanale, {
            canale: profileInfo.PK,
            user: user.current.attributes.sub,
          })
        );

        const updatedProfile = { ...profileInfo };
        updatedProfile.followers = response.data.removeFollowerCanale;
        setProfileInfo(updatedProfile);
        setIsFollowing(false);
      }
      setUpdate(!update);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  // Filter medias by locale
  const localeMedias = medias?.filter((x) => x.lingua === locale) || [];

  if (!profileInfo) {
    return (
      <div className="channel-not-found">
        <h2>Canale non trovato</h2>
        <p>Il canale che stai cercando non esiste o non è più disponibile.</p>
      </div>
    );
  }

  return (
    <>
      <div className="channel-profile-page">
        {/* Hero Section with Cover */}
        <section className="channel-hero">
          <div className="hero-gradient"></div>
          <div className="container">
            <div className="hero-content">
              {/* Profile Image */}
              <div className="profile-image-wrapper">
                <Image
                  className="profile-image"
                  preview={false}
                  src={
                    profileInfo.immagine
                      ? `${CLOUDFRONT_URL}/images/profile/${profileInfo.immagine}?random=${random}`
                      : `${CLOUDFRONT_URL}/images/profile/blank-profile.png`
                  }
                  alt={profileInfo.channelTitle}
                />
              </div>

              {/* Channel Info */}
              <div className="channel-info">
                <h1 className="channel-title">{profileInfo.channelTitle}</h1>
                {profileInfo.channelDescription && (
                  <p className="channel-description">{profileInfo.channelDescription}</p>
                )}

                {/* Stats */}
                <ChannelStats profileInfo={profileInfo} medias={medias} />
              </div>

              {/* Follow Button */}
              <div className="follow-section">
                <div className="follow-control">
                  <span className="follow-label">
                    <IntlMessage id="channel.follow" />
                  </span>
                  <Switch
                    checked={isFollowing}
                    onChange={handleFollowToggle}
                    className="follow-switch"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Media Content Section */}
        <section className="channel-content">
          <div className="container">
            <div className="content-header">
              <h2 className="content-title">
                <i className="fa fa-music"></i>
                <IntlMessage id="channel.publish.content" />
                <span className="content-count">({localeMedias.length})</span>
              </h2>
            </div>

            {localeMedias.length > 0 ? (
              <div className="media-grid">
                {localeMedias.map((media, i) => (
                  <MediaItemCard key={`media-item-${i}`} media={media} />
                ))}
              </div>
            ) : (
              <div className="no-content">
                <i className="fa fa-folder-open"></i>
                <p>Nessun contenuto disponibile per questa lingua</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        .channel-profile-page {
          min-height: 100vh;
          background: #f5f7fa;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero Section */
        .channel-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 60px 0 40px;
          position: relative;
          overflow: hidden;
        }

        .hero-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 100%
          );
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-start;
          gap: 32px;
        }

        .profile-image-wrapper {
          flex-shrink: 0;
        }

        :global(.profile-image) {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          object-fit: cover;
          border: 6px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .channel-info {
          flex: 1;
          min-width: 0;
        }

        .channel-title {
          font-size: 42px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 12px 0;
          line-height: 1.2;
        }

        .channel-description {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        .follow-section {
          flex-shrink: 0;
          display: flex;
          align-items: flex-start;
        }

        .follow-control {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .follow-label {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        :global(.follow-switch.ant-switch-checked) {
          background: #ffffff;
        }

        :global(.follow-switch.ant-switch-checked .ant-switch-handle::before) {
          background: #667eea;
        }

        /* Content Section */
        .channel-content {
          padding: 48px 0;
        }

        .content-header {
          margin-bottom: 32px;
        }

        .content-title {
          font-size: 28px;
          font-weight: 700;
          color: #2c3e50;
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
        }

        .content-title i {
          font-size: 24px;
          color: #667eea;
        }

        .content-count {
          font-size: 20px;
          color: #6c757d;
          font-weight: 500;
        }

        .media-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .no-content {
          text-align: center;
          padding: 80px 20px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .no-content i {
          font-size: 64px;
          color: #d1d5db;
          margin-bottom: 16px;
        }

        .no-content p {
          font-size: 16px;
          color: #6c757d;
          margin: 0;
        }

        .channel-not-found {
          text-align: center;
          padding: 100px 20px;
        }

        .channel-not-found h2 {
          font-size: 32px;
          color: #2c3e50;
          margin-bottom: 12px;
        }

        .channel-not-found p {
          font-size: 16px;
          color: #6c757d;
        }

        @media (max-width: 992px) {
          .hero-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          :global(.profile-image) {
            width: 150px;
            height: 150px;
          }

          .channel-title {
            font-size: 32px;
          }

          .follow-section {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .channel-hero {
            padding: 40px 0 30px;
          }

          :global(.profile-image) {
            width: 120px;
            height: 120px;
            border: 4px solid rgba(255, 255, 255, 0.3);
          }

          .channel-title {
            font-size: 28px;
          }

          .channel-description {
            font-size: 15px;
          }

          .content-title {
            font-size: 24px;
          }

          .follow-control {
            padding: 12px 20px;
          }

          .follow-label {
            font-size: 15px;
          }
        }
      `}</style>
    </>
  );
};

export default ChannelProfile;
