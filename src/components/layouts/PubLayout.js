import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
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

  // Persistent mobile mode: save to sessionStorage when detected
  useEffect(() => {
    if (typeof window === 'undefined') return;

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
  }, [mobile]);

  // Detect mobile device
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobileDevice(mobileCheck);
    }
  }, []);

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
    </div>
  );
};

const mapStateToProps = ({ theme }) => {
  const { locale } = theme;
  return { locale };
};

export default connect(mapStateToProps)(React.memo(PubLayout));
