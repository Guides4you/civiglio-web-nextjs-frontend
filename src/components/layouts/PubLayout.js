import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Componenti migrati e SSR-safe
import HeaderNew from '../layoutpub-components/HeaderNew';
import Footer from '../layoutpub-components/Footer';

// Dynamic import per componenti che richiedono browser APIs
const AudioPlayerPublic = dynamic(() => import('../shared-components/AudioPlayerPublic'), { ssr: false });

export const CiviglioContext = React.createContext();
export const CiviglioConsumer = CiviglioContext.Consumer;
const CiviglioProvider = CiviglioContext.Provider;

export const PubLayout = ({ children, locale }) => {
  const router = useRouter();
  const { mobile } = router.query;
  const isMobile = mobile === 'true';

  const audioPlayerRef = useRef(null);
  const loginDivRef = useRef(null);
  const audioPauseArray = useRef([]);
  const audioEndedFn = useRef(null);
  const audioPauseFn = useRef(null);
  const audioPlayFn = useRef(null);

  const mounted = useRef(false);
  const user = useRef(undefined);

  const mapObj = f => obj =>
    Object.keys(obj).reduce((acc, key) => ({ ...acc, [key]: f(obj[key]) }), {});
  const toArrayOfStrings = value => [`${value}`];
  const mapToArrayOfStrings = mapObj(toArrayOfStrings);

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
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

    return audioPlayerRef.current?.setPlayObject(poi);
  };

  const pauseAudio = () => {
    audioPlayerRef.current?.pauseAudio();
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

  return (
    <div id="wrapper" className="listeo">
      <SignInDiv />
      {/* Header migrato e SSR-safe */}
      {isMobile === false && <HeaderNew />}
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
            }}
          >
            {children}
            {/* Audio Player - sticky bottom player */}
            <AudioPlayerPublic
              ref={audioPlayerRef}
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
      {isMobile === false && <Footer />}
    </div>
  );
};

const mapStateToProps = ({ theme }) => {
  const { locale } = theme;
  return { locale };
};

export default connect(mapStateToProps)(React.memo(PubLayout));
