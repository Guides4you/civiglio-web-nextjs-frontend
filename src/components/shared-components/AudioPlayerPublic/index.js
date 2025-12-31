import React, { useState, useRef, useEffect } from 'react';
import { CLOUDFRONT_URL } from '../../../constants/ApiConstant';

const AudioPlayerPublic = ({ locale, onAudioEnded, onPauseAudio, onPlayAudio, showLogin, onPlayerReady }) => {
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  const audioRef = useRef(null);

  const setPlayObject = (audioObject) => {
    if (!audioObject) return false;

    // For premium content without purchase:
    // - If audioExtract exists, play the extract
    // - Otherwise, show login
    if (audioObject.price > 0 && !audioObject.purchased) {
      if (!audioObject.audioExtract) {
        showLogin();
        return false;
      }
      // Will play audioExtract instead
    }

    setCurrentAudio(audioObject);
    setIsVisible(true);
    setIsPlaying(true);
    return true;
  };

  const pauseAudio = () => {
    setIsPlaying(false);
  };

  // Expose player methods to parent via callback
  useEffect(() => {
    if (onPlayerReady) {
      onPlayerReady({
        setPlayObject,
        pauseAudio
      });
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current || !currentAudio) return;

    const audio = audioRef.current;

    if (isPlaying) {
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
      if (onPlayAudio) onPlayAudio();
    } else {
      audio.pause();
      if (onPauseAudio) onPauseAudio();
    }
  }, [isPlaying, currentAudio]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!currentAudio || !audioRef.current) return;

    // Use audioExtract for unpurchased premium content, otherwise use full audioFile
    const audioFileName = (currentAudio.price > 0 && !currentAudio.purchased && currentAudio.audioExtract)
      ? currentAudio.audioExtract
      : currentAudio.audioFile;

    const audioUrl = `${CLOUDFRONT_URL}/media/${audioFileName}`;
    console.log('Loading audio from:', audioUrl);
    audioRef.current.src = audioUrl;
    audioRef.current.load();

    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
    }
  }, [currentAudio]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onAudioEnded) onAudioEnded();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleClose = () => {
    setIsPlaying(false);
    setIsVisible(false);
    setCurrentAudio(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible || !currentAudio) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="audio-player-container">
        <div className="audio-player">
          {/* Left: Audio Info */}
          <div className="player-info">
            <div className="audio-thumbnail">
              {currentAudio.immagine && (
                <img
                  src={`${CLOUDFRONT_URL}/images/${currentAudio.immagine}`}
                  alt={currentAudio.audioTitle || currentAudio.titolo}
                />
              )}
            </div>
            <div className="audio-details">
              <div className="audio-title">
                {currentAudio.audioTitle || currentAudio.titolo}
              </div>
              <div className="audio-author">
                {currentAudio.owner?.channelTitle || 'Channel'}
              </div>
            </div>
          </div>

          {/* Center: Controls */}
          <div className="player-controls">
            <button
              className="control-btn play-btn"
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <i className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>

            <div className="progress-container">
              <span className="time-current">{formatTime(currentTime)}</span>
              <div className="progress-bar" onClick={handleSeek}>
                <div className="progress-fill" style={{ width: `${progress}%` }}>
                  <div className="progress-handle"></div>
                </div>
              </div>
              <span className="time-duration">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Volume & Close */}
          <div className="player-actions">
            <div className="volume-control">
              <i className="fa fa-volume-up"></i>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
            <button className="control-btn close-btn" onClick={handleClose} aria-label="Close">
              <i className="fa fa-times"></i>
            </button>
          </div>
        </div>

        <style jsx>{`
          .audio-player-container {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 9999;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
            animation: slideUp 0.3s ease-out;
          }

          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          .audio-player {
            max-width: 1400px;
            margin: 0 auto;
            padding: 16px 24px;
            display: flex;
            align-items: center;
            gap: 24px;
          }

          .player-info {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 0 0 280px;
            min-width: 0;
          }

          .audio-thumbnail {
            width: 56px;
            height: 56px;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;
            background: rgba(255, 255, 255, 0.1);
          }

          .audio-thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .audio-details {
            flex: 1;
            min-width: 0;
          }

          .audio-title {
            font-size: 15px;
            font-weight: 600;
            color: #ffffff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 4px;
          }

          .audio-author {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.8);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .player-controls {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 16px;
            min-width: 0;
          }

          .control-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            color: #ffffff;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            flex-shrink: 0;
          }

          .control-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.05);
          }

          .control-btn:active {
            transform: scale(0.95);
          }

          .play-btn {
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.95);
            color: #667eea;
          }

          .play-btn:hover {
            background: #ffffff;
          }

          .progress-container {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
          }

          .time-current,
          .time-duration {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            min-width: 40px;
            text-align: center;
          }

          .progress-bar {
            flex: 1;
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            cursor: pointer;
            position: relative;
            min-width: 0;
          }

          .progress-fill {
            height: 100%;
            background: #ffffff;
            border-radius: 3px;
            position: relative;
            transition: width 0.1s linear;
          }

          .progress-handle {
            position: absolute;
            right: -6px;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            background: #ffffff;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transition: opacity 0.2s;
          }

          .progress-bar:hover .progress-handle {
            opacity: 1;
          }

          .player-actions {
            display: flex;
            align-items: center;
            gap: 16px;
            flex: 0 0 200px;
          }

          .volume-control {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
          }

          .volume-control i {
            color: #ffffff;
            font-size: 16px;
          }

          .volume-slider {
            flex: 1;
            height: 4px;
            -webkit-appearance: none;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            outline: none;
          }

          .volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 12px;
            background: #ffffff;
            border-radius: 50%;
            cursor: pointer;
          }

          .volume-slider::-moz-range-thumb {
            width: 12px;
            height: 12px;
            background: #ffffff;
            border-radius: 50%;
            border: none;
            cursor: pointer;
          }

          .close-btn {
            flex-shrink: 0;
          }

          @media (max-width: 992px) {
            .player-info {
              flex: 0 0 220px;
            }

            .player-actions {
              flex: 0 0 160px;
            }
          }

          @media (max-width: 768px) {
            .audio-player {
              gap: 16px;
              padding: 12px 16px;
            }

            .player-info {
              flex: 0 0 180px;
            }

            .audio-thumbnail {
              width: 48px;
              height: 48px;
            }

            .audio-title {
              font-size: 14px;
            }

            .audio-author {
              font-size: 12px;
            }

            .control-btn {
              width: 40px;
              height: 40px;
              font-size: 14px;
            }

            .play-btn {
              width: 44px;
              height: 44px;
            }

            .volume-control {
              display: none;
            }

            .player-actions {
              flex: 0 0 auto;
            }
          }

          @media (max-width: 480px) {
            .audio-player {
              gap: 12px;
            }

            .player-info {
              flex: 1;
              min-width: 0;
            }

            .time-current,
            .time-duration {
              font-size: 11px;
              min-width: 35px;
            }

            .player-controls {
              gap: 12px;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default AudioPlayerPublic;
