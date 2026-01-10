import React, { useRef, useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { onLocaleChange } from '../../redux/actions/Theme';
import langData from '../../assets/data/language.data.json';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Componenti migrati e SSR-safe
import HeaderNew from '../layoutpub-components/HeaderNew';
import Footer from '../layoutpub-components/Footer';

// Dynamic import per componenti che richiedono browser APIs con forwardRef support
const AudioPlayerPublic = dynamic(
  () => import('../shared-components/AudioPlayerPublic'),
  {
    ssr: false,
    loading: () => null
  }
);

const AppDownloadBanner = dynamic(
  () => import('../util-components/AppDownloadBanner'),
  {
    ssr: false,
    loading: () => null
  }
);

export const CiviglioContext = React.createContext();
export const CiviglioConsumer = CiviglioContext.Consumer;
const CiviglioProvider = CiviglioContext.Provider;

export const PubLayout = ({ children, locale }) => {
  const router = useRouter();
  const { mobile } = router.query;

  const audioPlayerInstance = useRef(null);
  const loginDivRef = useRef(null);
  const audioPauseArray = useRef([]);
  const audioEndedFn = useRef(null);
  const audioPauseFn = useRef(null);
  const audioPlayFn = useRef(null);

  const mounted = useRef(false);
  const user = useRef(undefined);
  const [authChanged, setAuthChanged] = useState(0); // Trigger re-render on auth change
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [avatarPopupOpen, setAvatarPopupOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const currentLocale = useSelector(state => state.theme?.locale) || 'it';

  // Persistent mobile mode: save to sessionStorage when detected
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!router.isReady) return; // Wait for router to be ready on SSG pages

    // Check if mobile=true in URL query
    if (mobile === 'true') {
      sessionStorage.setItem('civiglio_mobile_mode', 'true');
      setIsMobileMode(true);
    } else {
      // Check if mobile mode was previously set in session
      const storedMobileMode = sessionStorage.getItem('civiglio_mobile_mode');
      if (storedMobileMode === 'true') {
        setIsMobileMode(true);
      }
    }
  }, [router.isReady, mobile]);

  // Detect mobile device
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobileDevice(mobileCheck);
    }
  }, []);

  // Load user info for avatar
  useEffect(() => {
    const loadUserInfo = async () => {
      if (typeof window === 'undefined') return;

      try {
        const { Auth } = await import('aws-amplify');
        const currentUser = await Auth.currentAuthenticatedUser();

        if (currentUser) {
          const { attributes } = currentUser;
          setUserInfo({
            name: attributes.name || attributes.email?.split('@')[0] || 'User',
            email: attributes.email,
            username: currentUser.username
          });
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        setUserInfo(null);
      }
    };

    loadUserInfo();
  }, [authChanged]);

  const handlePlayerReady = (playerMethods) => {
    audioPlayerInstance.current = playerMethods;
  };

  const mapObj = f => obj =>
    Object.keys(obj).reduce((acc, key) => ({ ...acc, [key]: f(obj[key]) }), {});
  const toArrayOfStrings = value => [`${value}`];
  const mapToArrayOfStrings = mapObj(toArrayOfStrings);

  useEffect(() => {
    mounted.current = true;

    // Setup Auth listener
    let hubListener;
    const setupAuthListener = async () => {
      if (typeof window === 'undefined') return;

      const { Hub } = await import('aws-amplify');
      const { Auth } = await import('aws-amplify');

      // Check current auth state
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        user.current = currentUser;
        setAuthChanged(prev => prev + 1);
      } catch (err) {
        user.current = undefined;
      }

      // Listen to auth events
      hubListener = Hub.listen('auth', async (data) => {
        const { payload } = data;
        console.log('PubLayout: Auth event received:', payload.event);

        if (payload.event === 'signIn') {
          try {
            const currentUser = await Auth.currentAuthenticatedUser();
            user.current = currentUser;
            setAuthChanged(prev => prev + 1);
            console.log('PubLayout: User signed in:', currentUser.username);
          } catch (err) {
            console.error('Error getting current user:', err);
          }
        } else if (payload.event === 'signOut') {
          user.current = undefined;
          setAuthChanged(prev => prev + 1);
          console.log('PubLayout: User signed out');
        }
      });
    };

    setupAuthListener();

    return () => {
      mounted.current = false;
      if (hubListener) {
        import('aws-amplify').then(({ Hub }) => {
          Hub.remove('auth', hubListener);
        });
      }
    };
  }, []);

  const handleAuthStateChange = async (nextAuthState, authData) => {
    if (typeof window === 'undefined') return;

    const { AuthState } = await import('@aws-amplify/ui-components');

    if (nextAuthState === AuthState.SignedIn) {
      if (mounted.current) {
        user.current = authData;
        if (loginDivRef?.current) {
          loginDivRef.current.classList.remove('active');
        }
      }

      try {
        const { attributes } = authData;
        const userAttributes = mapToArrayOfStrings(attributes);
        // Analytics può essere aggiunto dopo se necessario
      } catch (error) {
        console.log(error);
      }
    }
  };

  // SignInDiv temporaneamente disabilitato - usiamo le pagine dedicate /auth/login
  // Verrà riabilitato quando migreremo gli stili CSS
  const SignInDiv = () => {
    return null; // Modal di login disabilitato - usa /auth/login invece
  };

  const setPlayedObjectFn = (poi) => {
    if (audioPauseArray.current.length > 0) {
      const f = audioPauseArray.current.pop();
      f();
    }

    if (audioPauseFn.current) {
      audioPauseArray.current.push(audioPauseFn.current);
    }

    return audioPlayerInstance.current?.setPlayObject(poi);
  };

  const pauseAudio = () => {
    audioPlayerInstance.current?.pauseAudio();
  };

  const audioEnd = () => {
    if (audioEndedFn.current) audioEndedFn.current();
  };

  const audioPause = () => {
    if (audioPauseFn.current) {
      audioPauseArray.current.push(audioPauseFn.current);
      audioPauseFn.current();
    }
  };

  const audioPlay = () => {
    if (audioPlayFn.current) audioPlayFn.current();
  };

  const setAudioEndFn = (fn) => {
    audioEndedFn.current = fn;
  };

  const setAudioPauseFn = (fn) => {
    audioPauseFn.current = fn;
  };

  const setAudioPlayFn = (fn) => {
    audioPlayFn.current = fn;
  };

  const showLoginFn = () => {
    // Redirect a pagina login dedicata invece di mostrare modal
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };

  const getUserFn = () => {
    return user;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleAvatarLogout = async () => {
    try {
      const { Auth } = await import('aws-amplify');
      await Auth.signOut();
      setUserInfo(null);
      setAvatarPopupOpen(false);
      sessionStorage.removeItem('civiglio_mobile_mode');
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const shouldDisableZoom = isMobileMode || isMobileDevice;

  return (
    <div id="wrapper" className="listeo">
      <Head>
        {shouldDisableZoom ? (
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        ) : (
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        )}
      </Head>
      <SignInDiv />
      {/* Header migrato e SSR-safe */}
      {isMobileMode === false && <HeaderNew />}
      <div>
        <div style={{ overflow: 'hidden' }}>
          <CiviglioProvider
            value={{
              setPlayedObject: setPlayedObjectFn,
              pauseAudio: pauseAudio,
              setAudioEndFn: setAudioEndFn,
              setAudioPauseFn: setAudioPauseFn,
              setAudioPlayFn: setAudioPlayFn,
              showLogin: showLoginFn,
              getUser: getUserFn,
              authChanged: authChanged, // Added to trigger re-renders on auth change
            }}
          >
            {children}
            {/* Audio Player - sticky bottom player */}
            <AudioPlayerPublic
              onPlayerReady={handlePlayerReady}
              locale={locale}
              onAudioEnded={audioEnd}
              onPauseAudio={audioPause}
              onPlayAudio={audioPlay}
              showLogin={showLoginFn}
            />
          </CiviglioProvider>
        </div>
      </div>
      {/* Footer migrato e SSR-safe */}
      {isMobileMode === false && <Footer />}
      {/* App Download Banner - shown only on mobile devices */}
      {isMobileMode === false && <AppDownloadBanner />}

      {/* Avatar Floating Button - Mobile Mode Only */}
      {isMobileMode && (
        <>
          <button
            className={`avatar-floating-button ${userInfo ? 'logged-in' : 'logged-out'}`}
            onClick={() => setAvatarPopupOpen(!avatarPopupOpen)}
            aria-label={userInfo ? "Menu utente" : "Accedi"}
            style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}
          >
            {userInfo ? (
              <>
                <span className="avatar-initials">{getInitials(userInfo.name)}</span>
                <span className="avatar-badge"></span>
              </>
            ) : (
              <i className="fa fa-user"></i>
            )}
          </button>

          {/* Avatar Popup */}
          {avatarPopupOpen && (
            <>
              <div
                className="avatar-popup-overlay"
                onClick={() => setAvatarPopupOpen(false)}
              ></div>
              <div className="avatar-popup">
                <button
                  className="avatar-popup-close"
                  onClick={() => setAvatarPopupOpen(false)}
                  aria-label="Chiudi"
                >
                  <i className="fa fa-times"></i>
                </button>
                {userInfo ? (
                  <>
                    <div className="avatar-popup-header">
                      <span className="avatar-greeting">Ciao {userInfo.name.split(' ')[0]}! ✨</span>
                    </div>
                    <div className="avatar-popup-actions">
                      <a
                        href="/app/home"
                        className="avatar-action-link"
                        onClick={() => setAvatarPopupOpen(false)}
                      >
                        <i className="fa fa-home"></i>
                        <span>Area Personale</span>
                      </a>

                      {/* Language Selector */}
                      <div className="avatar-lang-section">
                        <span className="avatar-lang-label">Lingua</span>
                        <div className="avatar-lang-options">
                          {langData.map((lang) => (
                            <button
                              key={lang.langId}
                              className={`avatar-lang-btn ${currentLocale === lang.langId ? 'active' : ''}`}
                              onClick={() => dispatch(onLocaleChange(lang.langId))}
                            >
                              <img src={`/img/flags/${lang.icon}.png`} alt={lang.langName} />
                              <span>{lang.lang}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        className="avatar-action-button logout"
                        onClick={handleAvatarLogout}
                      >
                        <i className="fa fa-sign-out"></i>
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="avatar-popup-login">
                    <p className="avatar-login-text">Accedi per gestire i tuoi contenuti</p>
                    <a
                      href="/auth/login"
                      className="avatar-login-button"
                      onClick={() => setAvatarPopupOpen(false)}
                    >
                      <i className="fa fa-sign-in"></i>
                      <span>Accedi</span>
                    </a>

                    {/* Language Selector */}
                    <div className="avatar-lang-section" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                      <span className="avatar-lang-label">Lingua</span>
                      <div className="avatar-lang-options">
                        {langData.map((lang) => (
                          <button
                            key={lang.langId}
                            className={`avatar-lang-btn ${currentLocale === lang.langId ? 'active' : ''}`}
                            onClick={() => dispatch(onLocaleChange(lang.langId))}
                          >
                            <img src={`/img/flags/${lang.icon}.png`} alt={lang.langName} />
                            <span>{lang.lang}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <style jsx>{`
            /* ========== Avatar Floating Button ========== */
            .avatar-floating-button {
              position: fixed;
              top: 20px;
              right: 20px;
              width: 50px;
              height: 50px;
              border-radius: 50%;
              color: white;
              border: none;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              cursor: pointer;
              z-index: 1000;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 600;
              transition: all 0.3s ease;
              position: relative;
            }

            .avatar-floating-button.logged-in {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              font-size: 18px;
            }

            .avatar-floating-button.logged-out {
              background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
              font-size: 20px;
            }

            .avatar-floating-button:hover {
              transform: scale(1.1);
              box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
            }

            .avatar-floating-button:active {
              transform: scale(0.95);
            }

            .avatar-initials {
              font-size: 18px;
              font-weight: 700;
              letter-spacing: 0.5px;
            }

            .avatar-badge {
              position: absolute;
              bottom: 2px;
              right: 2px;
              width: 14px;
              height: 14px;
              background: #48bb78;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            /* ========== Avatar Popup Overlay ========== */
            .avatar-popup-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.3);
              z-index: 1999;
              animation: fadeIn 0.2s ease;
            }

            /* ========== Avatar Popup ========== */
            .avatar-popup {
              position: fixed;
              top: 70px;
              right: 10px;
              background: white;
              border-radius: 16px;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
              min-width: 260px;
              z-index: 2000;
              animation: slideDown 0.3s ease;
              overflow: hidden;
            }

            .avatar-popup-close {
              position: absolute;
              top: 12px;
              right: 12px;
              width: 28px;
              height: 28px;
              border: none;
              background: rgba(255, 255, 255, 0.2);
              border-radius: 50%;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
              transition: background 0.2s ease;
              z-index: 1;
            }

            .avatar-popup-close:hover {
              background: rgba(255, 255, 255, 0.3);
            }

            /* Stile per popup senza header (utente non loggato) */
            .avatar-popup-login .avatar-popup-close,
            .avatar-popup:not(:has(.avatar-popup-header)) .avatar-popup-close {
              background: #f0f0f0;
              color: #4a5568;
            }

            .avatar-popup-login .avatar-popup-close:hover,
            .avatar-popup:not(:has(.avatar-popup-header)) .avatar-popup-close:hover {
              background: #e2e8f0;
            }

            .avatar-popup-header {
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }

            .avatar-greeting {
              font-size: 16px;
              font-weight: 600;
              display: block;
            }

            .avatar-popup-actions {
              padding: 12px;
            }

            .avatar-action-link,
            .avatar-action-button {
              width: 100%;
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 14px 16px;
              border: none;
              background: transparent;
              text-decoration: none;
              color: #2d3748;
              font-size: 15px;
              font-weight: 500;
              border-radius: 10px;
              cursor: pointer;
              transition: background 0.2s ease;
              margin-bottom: 6px;
            }

            .avatar-action-link:hover,
            .avatar-action-button:hover {
              background: #f7fafc;
            }

            .avatar-action-link i,
            .avatar-action-button i {
              width: 24px;
              text-align: center;
              font-size: 18px;
              color: #667eea;
            }

            .avatar-action-button.logout i {
              color: #f56565;
            }

            .avatar-action-button:last-child {
              margin-bottom: 0;
            }

            /* ========== Language Selector ========== */
            .avatar-lang-section {
              padding: 12px 16px;
              border-top: 1px solid #e2e8f0;
              margin-top: 6px;
            }

            .avatar-lang-label {
              display: block;
              font-size: 12px;
              font-weight: 600;
              color: #718096;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 10px;
            }

            .avatar-lang-options {
              display: flex;
              gap: 8px;
            }

            .avatar-lang-btn {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              padding: 10px 12px;
              border: 2px solid #e2e8f0;
              border-radius: 8px;
              background: white;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .avatar-lang-btn img {
              width: 20px;
              height: 14px;
              object-fit: cover;
              border-radius: 2px;
            }

            .avatar-lang-btn span {
              font-size: 13px;
              font-weight: 500;
              color: #4a5568;
            }

            .avatar-lang-btn:hover {
              border-color: #667eea;
              background: #f7fafc;
            }

            .avatar-lang-btn.active {
              border-color: #667eea;
              background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            }

            .avatar-lang-btn.active span {
              color: #667eea;
              font-weight: 600;
            }

            /* ========== Login State ========== */
            .avatar-popup-login {
              padding: 24px;
              text-align: center;
            }

            .avatar-login-text {
              color: #4a5568;
              font-size: 14px;
              margin-bottom: 16px;
              line-height: 1.5;
            }

            .avatar-login-button {
              display: inline-flex;
              align-items: center;
              gap: 10px;
              padding: 12px 24px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              border-radius: 10px;
              font-size: 15px;
              font-weight: 600;
              text-decoration: none;
              cursor: pointer;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .avatar-login-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .avatar-login-button:active {
              transform: translateY(0);
            }

            .avatar-login-button i {
              font-size: 16px;
            }

            /* ========== Animations ========== */
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            /* ========== Responsive ========== */
            @media (max-width: 575px) {
              .avatar-popup {
                right: 10px;
                left: 10px;
                min-width: auto;
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

const mapStateToProps = ({ theme }) => {
  const { locale } = theme;
  return { locale };
};

export default connect(mapStateToProps)(React.memo(PubLayout));
