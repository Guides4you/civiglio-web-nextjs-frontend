import React, { useRef, useState, useEffect } from 'react';
import { PlayCircleOutlined, DeleteOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { Button, Row, Col, Slider } from 'antd';
import { CLOUDFRONT_URL } from '../../constants/CiviglioConstants';

const AudioPlayer = ({ fileUrl, onCancel, onLoad, autoPlay = true }) => {
  const audioRef = useRef(null);
  const [playaudioduration, setPlayaudioduration] = useState(0);
  const [playaudioprogressstring, setPlayaudioprogressstring] = useState('00:00');
  const [playaudioprogress, setPlayaudioprogress] = useState(0);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const formatNumber = (number) => {
    return number < 10 ? '0' + number.toString() : number.toString();
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setPlayaudioduration(audioRef.current.duration);
      if (onLoad) onLoad(audioRef.current.duration);

      // Auto-play when metadata is loaded
      if (autoPlay) {
        setAudioPlayed(true);
        audioRef.current.play().catch(err => {
          console.error('Auto-play failed:', err);
          setAudioPlayed(false);
        });
      }
    }
  };

  const onEnded = () => {
    setAudioPlayed(false);
  };

  const audioProgress = () => {
    if (audioRef.current) {
      const seconds = audioRef.current.currentTime;
      const m = formatNumber(Math.floor(seconds / 60));
      const s = formatNumber(Math.floor(seconds - m * 60));
      setPlayaudioprogressstring(m + ':' + s);
      setPlayaudioprogress(seconds);
    }
  };

  const eliminaAudio = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const startAudio = () => {
    setAudioPlayed(true);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setAudioPlayed(false);
  };

  // Auto-play when component mounts or fileUrl changes
  useEffect(() => {
    if (autoPlay && audioRef.current && fileUrl) {
      // Wait for audio to be ready
      const tryPlay = () => {
        if (audioRef.current && audioRef.current.readyState >= 2) {
          setAudioPlayed(true);
          audioRef.current.play().catch(err => {
            console.error('Auto-play failed:', err);
            setAudioPlayed(false);
          });
        } else {
          // Retry after a short delay
          setTimeout(tryPlay, 100);
        }
      };

      // Small delay to ensure audio element is ready
      setTimeout(tryPlay, 50);
    }
  }, [fileUrl, autoPlay]);

  return (
    <Row align="middle">
      <Col xs={18} className="rec-timer">
        {fileUrl && (
          <audio
            ref={audioRef}
            onLoadedMetadata={onLoadedMetadata}
            onTimeUpdate={audioProgress}
            onEnded={onEnded}
          >
            <source src={`${CLOUDFRONT_URL}/audio/${fileUrl}`} type="audio/mp3" />
          </audio>
        )}

        <Row>
          <Col xs={18}>
            <Slider
              value={(playaudioprogress / playaudioduration) * 100}
              tooltip={{ formatter: null }}
              onChange={(value) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = (playaudioduration * value) / 100;
                }
              }}
            />
          </Col>
          <Col xs={6} style={{ paddingTop: '12px' }}>
            <span>{playaudioprogressstring}</span>
          </Col>
        </Row>
      </Col>
      <Col xs={6} align="right">
        <Row>
          {!audioPlayed && (
            <Col xs={12} align="right">
              <Button shape="circle" onClick={startAudio}>
                <PlayCircleOutlined />
              </Button>
            </Col>
          )}
          {audioPlayed && (
            <Col xs={12} align="right">
              <Button shape="circle" onClick={pauseAudio}>
                <PauseCircleOutlined />
              </Button>
            </Col>
          )}
          <Col xs={12} align="right">
            <Button shape="circle" onClick={eliminaAudio} style={{ color: 'red' }}>
              <DeleteOutlined />
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default AudioPlayer;
