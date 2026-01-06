import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import IntlMessage from '../../util-components/IntlMessage';
import { message } from 'antd';
import { CiviglioContext } from '../../layouts/PubLayout';

/**
 * NewContent Component - Call-to-action for users to share new content
 *
 * Displays an invitation card encouraging users to contribute audio guides
 * to the POI. Redirects to the content creation page if user is authenticated,
 * otherwise shows login page.
 */
const NewContent = () => {
  const router = useRouter();
  const context = useContext(CiviglioContext);
  const [messageApi, contextHolder] = message.useMessage();
  const isMobile = JSON.parse(router.query.mobile || 'false');

  const handleClick = (e) => {
    e.preventDefault();

    // Check if user is authenticated
    const user = context.getUser();
    if (!user || !user.current) {
      console.log('NewContent: User not authenticated, showing login');
      // Show login page if user is not authenticated
      context.showLogin();
      return;
    }

    console.log('NewContent: User authenticated, redirecting to /app/home');

    // Optional: Show error message for mobile users
    // Currently disabled - mobile users can also create content
    // if (isMobile) {
    //   messageApi.open({
    //     type: 'error',
    //     content: <IntlMessage id="poidetail.newcontent.error" />,
    //     duration: 5,
    //   });
    //   return;
    // }

    // Redirect to content creation page (now protected by AppLayoutSimple)
    router.push('/app/home');
  };

  return (
    <>
      {contextHolder}
      <div className="new-content-card">
        <div className="card-inner">
          {/* Icon */}
          <div className="icon-wrapper">
            <div className="icon-circle">
              <i className="fa fa-plus"></i>
            </div>
          </div>

          {/* Content */}
          <div className="content-wrapper">
            <h3 className="card-title">
              <IntlMessage id="poidetail.newcontent" />
            </h3>
            <p className="card-description">
              <IntlMessage id="poidetail.newcontent.description" />
            </p>
          </div>

          {/* CTA Button */}
          <button className="cta-button" onClick={handleClick}>
            <i className="fa fa-upload"></i>
            <span>
              <IntlMessage id="poidetail.newcontent.buttom" />
            </span>
            <i className="fa fa-arrow-right"></i>
          </button>
        </div>

        <style jsx>{`
          .new-content-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 20px 24px;
            margin-bottom: 24px;
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
            position: relative;
            overflow: hidden;
          }

          .new-content-card::before {
            content: '';
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

          .card-inner {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .icon-wrapper {
            flex-shrink: 0;
          }

          .icon-circle {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .icon-circle i {
            font-size: 24px;
            color: #ffffff;
          }

          .content-wrapper {
            flex: 1;
            min-width: 0;
          }

          .card-title {
            font-size: 18px;
            font-weight: 700;
            color: #ffffff;
            margin: 0 0 6px 0;
            line-height: 1.3;
          }

          .card-description {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.5;
            margin: 0;
          }

          .cta-button {
            flex-shrink: 0;
            padding: 10px 20px;
            background: #ffffff;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #667eea;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            white-space: nowrap;
          }

          .cta-button:hover {
            background: #f8f9ff;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          }

          .cta-button:active {
            transform: translateY(0);
          }

          .cta-button i {
            font-size: 18px;
            transition: transform 0.3s ease;
          }

          .cta-button:hover .fa-arrow-right {
            transform: translateX(4px);
          }

          .cta-button span {
            flex: 1;
          }

          @media (max-width: 768px) {
            .new-content-card {
              padding: 16px 20px;
            }

            .card-inner {
              gap: 16px;
            }

            .icon-circle {
              width: 48px;
              height: 48px;
            }

            .icon-circle i {
              font-size: 20px;
            }

            .card-title {
              font-size: 16px;
              margin-bottom: 4px;
            }

            .card-description {
              font-size: 13px;
            }

            .cta-button {
              padding: 8px 16px;
              font-size: 13px;
              gap: 6px;
            }

            .cta-button i {
              font-size: 14px;
            }
          }

          @media (max-width: 576px) {
            .card-inner {
              flex-direction: column;
              text-align: center;
              gap: 12px;
            }

            .cta-button {
              width: 100%;
              justify-content: center;
            }

            .cta-button span {
              flex: 0;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default NewContent;
