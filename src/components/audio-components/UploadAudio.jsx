import React, { useState, useEffect } from 'react';
import { Upload, Button, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import AudioPlayer from './AudioPlayer';
import IntlMessage from '../util-components/IntlMessage';

const UploadAudio = ({ name, title, audioFile, onFileCreated, primary }) => {
  const [ascoltoAudio, setAscoltoAudio] = useState(audioFile ? true : false);
  const [audioSrc, setAudioSrc] = useState(audioFile);
  const [errorFileIsShort, setErrorFileIsShort] = useState(false);

  useEffect(() => {
    setAscoltoAudio(audioFile ? true : false);
    setAudioSrc(audioFile);
  }, [audioFile]);

  const eliminaAudio = () => {
    setAudioSrc('');
    setAscoltoAudio(false);
    if (onFileCreated) {
      onFileCreated('');
    }
  };

  const storeAudio = async (file) => {
    try {
      const { Storage } = await import('aws-amplify');
      const s3Key = uuidv4();
      const fname = s3Key + '.mp3';

      if (onFileCreated) {
        onFileCreated(fname);
      }

      await Storage.put('audio/' + fname, file, {
        contentType: file.type,
      });

      setAudioSrc(fname);
      setAscoltoAudio(true);

      if (onFileCreated) {
        onFileCreated(fname);
      }
    } catch (error) {
      console.error('S3 - KO salvataggio', error);
      alert('Errore salvataggio file');
      setAudioSrc('');
      setAscoltoAudio(false);
    }

    return false;
  };

  let controlli = null;
  if (ascoltoAudio) {
    controlli = (
      <AudioPlayer
        fileUrl={audioSrc}
        onCancel={eliminaAudio}
        onLoad={(duration) => {
          if (primary && duration < 30) {
            setAudioSrc('');
            setAscoltoAudio(false);
            setErrorFileIsShort(true);
          }
        }}
      />
    );
  } else {
    controlli = (
      <Upload name={name} beforeUpload={storeAudio}>
        <Button icon={<UploadOutlined />} style={{ width: '100%' }}>
          {title}
        </Button>
      </Upload>
    );
  }

  return (
    <>
      {controlli}
      <Modal
        title="Audio troppo breve"
        open={errorFileIsShort}
        onOk={() => {
          setErrorFileIsShort(false);
        }}
        onCancel={() => {
          setErrorFileIsShort(false);
        }}
      >
        <p>
          <IntlMessage id="recordaudiowidjet2.audio.breve" />
        </p>
      </Modal>
    </>
  );
};

export default UploadAudio;
