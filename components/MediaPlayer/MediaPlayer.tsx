// src/components/MediaPlayer.jsx

import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import styles from "../../styles/MediaPlayer.module.css";
import Comment from "../Comment/Comment";

const MediaPlayer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const playerRef = useRef(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    if (!isExpanded) return;
    setPlayed(state.played);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSeekChange = (e) => {
    const seekTo = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.seekTo(seekTo);
      setPlayed(seekTo);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const openComments = (e) => {
    e.stopPropagation(); // Prevent triggering expand/collapse
    setShowComments(true);
  };

  const closeComments = () => {
    setShowComments(false);
  };

  return (
    <>
      <div
        className={`${styles.mediaPlayer} ${
          isExpanded ? styles.expanded : styles.collapsed
        }`}
      >
        {/* Close Button for Expanded State */}
        {isExpanded && (
          <button className={styles.closeButton} onClick={toggleExpand}>
            &times;
          </button>
        )}

        {/* Header */}
        <div
          className={styles.header}
          onClick={!isExpanded ? toggleExpand : undefined}
        >
          <div className={styles.songInfo}>
            <img
              src="/images/cover-art.jpg" // Replace with the actual cover art image
              alt="Cover Art"
              className={styles.coverArt}
            />
            <div className={styles.songDetails}>
              <h1 className={styles.songTitle}>She Bad</h1>
              <h2 className={styles.artistName}>Khantrast</h2>
              {isExpanded && <span className={styles.genre}>Genre: Hip-Hop</span>}
            </div>
          </div>
          {!isExpanded && (
            <div className={styles.toggleButton}>
              {isExpanded ? "▲" : "▼"}
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className={styles.expandedContent}>
            {/* Player Wrapper */}
            <div className={styles.playerWrapper}>
              <ReactPlayer
                ref={playerRef}
                className={styles.reactPlayer}
                url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" // Replace with actual media URL
                playing={playing}
                controls={false}
                volume={volume}
                onProgress={handleProgress}
                onDuration={handleDuration}
                width="100%"
                height="100%"
              />
              {/* Overlay Controls */}
              <div
                className={styles.overlayControls}
                onClick={(e) => e.stopPropagation()} // Prevent clicking overlay controls from toggling expand
              >
                <button onClick={() => alert("Liked!")}>👍</button>
                <button onClick={() => alert("Disliked!")}>👎</button>
                <button onClick={openComments}>💬</button>
                <button onClick={() => alert("Shared!")}>🔗</button>
              </div>
            </div>

            {/* Playback Controls */}
            <div className={styles.controls}>
              <button
                className={styles.controlButton}
                onClick={() => {
                  if (playerRef.current) {
                    playerRef.current.seekTo(0);
                  }
                }}
                aria-label="Rewind"
              >
                ⏮
              </button>
              <button
                className={styles.controlButton}
                onClick={handlePlayPause}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? "⏸" : "▶️"}
              </button>
              <button
                className={styles.controlButton}
                onClick={() => {
                  if (playerRef.current) {
                    playerRef.current.seekTo(duration);
                  }
                }}
                aria-label="Forward"
              >
                ⏭
              </button>
              <input
                type="range"
                className={styles.progressBar}
                min={0}
                max={1}
                step="0.001"
                value={played}
                onChange={handleSeekChange}
                onClick={(e) => e.stopPropagation()} // Prevent seeking from collapsing
                aria-label="Progress Bar"
              />
              <span className={styles.time}>
                {formatTime(played * duration)} / {formatTime(duration)}
              </span>
            </div>

            {/* Additional Controls */}
            <div className={styles.additionalControls}>
              <div className={styles.volumeControl}>
                <span>🔊</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  onClick={(e) => e.stopPropagation()} // Prevent volume change from collapsing
                  aria-label="Volume Control"
                />
              </div>
              {/* Add more controls as needed */}
            </div>
          </div>
        )}
      </div>

      {/* Comment Popup */}
      {showComments && <Comment onClose={closeComments} />}
    </>
  );
};

export default MediaPlayer;
