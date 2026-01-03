import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Modal } from 'antd';
import {
  AudioOutlined,
  AudioMutedOutlined,
  BorderOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import AudioPlayer from './AudioPlayer';
import IntlMessage from '../util-components/IntlMessage';

let Mp3Recorder = null;

const RecordAudioWidget2 = ({ audioFile, onFileCreated, onAudioDelete, primary }) => {
  const [recStartTime, setRecStartTime] = useState(null);
  const [recfilename, setRecfilename] = useState('');
  const [timer, setTimer] = useState('00:00:00');
  const [isRecording, setIsRecording] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState(audioFile);
  const [isBlocked, setIsBlocked] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [timerObject, setTimerObject] = useState(null);
  const [timerDateStart, setTimerDateStart] = useState(null);
  const [ascoltoAudio, setAscoltoAudio] = useState(audioFile ? true : false);
  const [errorFileIsShort, setErrorFileIsShort] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    // Initialize mic recorder on client side only
    const initRecorder = async () => {
      if (typeof window !== 'undefined') {
        const MicRecorder = (await import('mic-recorder-to-mp3')).default;
        Mp3Recorder = new MicRecorder({ bitRate: 128 });
      }
    };

    initRecorder();

    // Request microphone permission
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setIsBlocked(false);
        })
        .catch(() => {
          console.log('Mic Permission Denied');
          setIsBlocked(true);
        });
    }
  }, []);

  useEffect(() => {
    if (audioFile !== fileUrl) {
      setFileUrl(audioFile);
      setAscoltoAudio(audioFile ? true : false);
    }
  }, [audioFile]);

  const formatNumber = (number) => {
    return number < 10 ? '0' + number.toString() : number.toString();
  };

  const startTimer = () => {
    const startTime = new Date().getTime();
    setTimerDateStart(startTime);

    const t = setInterval(() => {
      const now = new Date().getTime();
      const totalSec = (now - startTime) / 1000;
      const h = Math.floor(totalSec / (60 * 60));
      const m = Math.floor((totalSec - h * 60 * 60) / 60);
      const s = Math.floor(totalSec - h * 3600 - m * 60);
      const timerStr = formatNumber(h) + ':' + formatNumber(m) + ':' + formatNumber(s);
      setTotalSeconds(totalSec);
      setTimer(timerStr);
    }, 1000);

    setTimerObject(t);
  };

  const start = () => {
    if (isBlocked) {
      console.log('Permission denied');
    } else if (Mp3Recorder) {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
          startTimer();
        })
        .catch((e) => console.error(e));
    }
  };

  const stop = async () => {
    if (!Mp3Recorder) return;

    Mp3Recorder.stop()
      .getMp3()
      .then(async ([buffer, blob]) => {
        if (timerObject) {
          clearInterval(timerObject);
        }

        if (primary && totalSeconds < 30) {
          setErrorFileIsShort(true);
          setFileUrl('');
          setFileName(null);
          setIsRecording(false);
          setAscoltoAudio(false);
          return;
        }

        const s3Key = uuidv4();
        const fname = s3Key + '.mp3';
        const blobFileS3 = new File([blob], fname);

        try {
          const { Storage } = await import('aws-amplify');
          await Storage.put('audio/' + fname, blobFileS3, {
            contentType: 'audio/mp3',
          });

          if (onFileCreated) {
            onFileCreated(fname);
          }

          setFileUrl(fname);
          setFileName(fname);
          setIsRecording(false);
          setAscoltoAudio(true);
        } catch (error) {
          console.log('S3 - KO salvataggio', s3Key, error);
          alert('Errore salvataggio file');
          setFileUrl('');
          setFileName(null);
          setIsRecording(false);
          setAscoltoAudio(false);
        }
      })
      .catch((e) => console.log(e));
  };

  const startStopRec = () => {
    if (isRecording) {
      stop();
    } else {
      start();
    }
  };

  const eliminaAudio = () => {
    setDeleteModal(true);
  };

  let icon = null;
  let controlli = null;

  if (isBlocked) {
    icon = <AudioMutedOutlined />;
  } else if (isRecording) {
    icon = <BorderOutlined />;
  } else {
    icon = <AudioOutlined />;
  }

  if (ascoltoAudio) {
    icon = <DeleteOutlined />;
    controlli = <AudioPlayer fileUrl={fileUrl} onCancel={eliminaAudio} />;
  } else {
    controlli = (
      <Row align="middle">
        <Col xs={18} className="rec-timer">
          {timer}
        </Col>
        <Col xs={6} align="right">
          <Button shape="circle" disabled={isBlocked} onClick={startStopRec}>
            {icon}
          </Button>
        </Col>
      </Row>
    );
  }

  return (
    <>
      {controlli}
      <Modal
        title="Eliminazione Audio"
        open={deleteModal}
        onOk={() => {
          setAscoltoAudio(false);
          setTotalSeconds(0);
          setTimer('00:00:00');
          setFileUrl('');
          setDeleteModal(false);
          if (onAudioDelete) onAudioDelete();
        }}
        onCancel={() => {
          setDeleteModal(false);
        }}
      >
        <p>
          <IntlMessage id="recordaudiowidjet2.vuoi.eliminare.audio" />
        </p>
      </Modal>
      <Modal
        title="Audio troppo breve"
        open={errorFileIsShort}
        onOk={() => {
          setAscoltoAudio(false);
          setTotalSeconds(0);
          setTimer('00:00:00');
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

export default RecordAudioWidget2;
