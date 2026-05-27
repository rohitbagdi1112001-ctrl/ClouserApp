import { useEffect, useRef, useState } from "react";
import type { Video } from "../../types/video";
import useLazyVideo from "../../hooks/useLazyVideo";

interface Props {
  video: Video;
  allowLoad?: boolean;
  active?: boolean;
}

const getYouTubeEmbedUrl = (url: string) => {
  try {
    if (url.includes("shorts/")) {
      const id = url.split("shorts/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    return url;
  } catch {
    return url;
  }
};

const VideoPlayer = ({ video, allowLoad = true, active = false }: Props) => {
  const { ref, isIntersecting } = useLazyVideo<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const canLoad = (isIntersecting || isReady) && allowLoad;

  useEffect(() => {
    if (!isIntersecting && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isIntersecting]);

  useEffect(() => {
    // auto-play when this player is active and loaded
    if (active && canLoad && videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
    if (!active && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, canLoad]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoaded = () => setIsReady(true);

    element.addEventListener("play", handlePlay);
    element.addEventListener("pause", handlePause);
    element.addEventListener("loadeddata", handleLoaded);

    return () => {
      element.removeEventListener("play", handlePlay);
      element.removeEventListener("pause", handlePause);
      element.removeEventListener("loadeddata", handleLoaded);
    };
  }, [canLoad]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleLoadedData = () => {
    setIsReady(true);
  };

  const handleTimeUpdate = () => {
    const currentTime = videoRef.current?.currentTime ?? 0;
    const duration = videoRef.current?.duration ?? 0;
    setProgress(duration > 0 ? (currentTime / duration) * 100 : 0);
  };

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted((current) => !current);
  };

  const handleIframeLoad = () => {
    setIsReady(true);
  };

  const baseEmbed = getYouTubeEmbedUrl(video.videoUrl);
  const iframeSrc = `${baseEmbed}${baseEmbed.includes("?") ? "&" : "?"}rel=0&autoplay=1${isMuted ? "&mute=1" : ""}`;

  return (
    <div className="video-player-panel" ref={ref}>
      <div className="video-player-frame">
        {video.type === "youtube" ? (
          canLoad ? (
            <iframe
              src={iframeSrc}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleIframeLoad}
              className="video-iframe"
            />
          ) : (
            <div className="video-placeholder">
              <img src={video.thumbnailUrl} alt={video.title} />
              <span>Scroll to load</span>
            </div>
          )
        ) : (
          <div className="video-element-wrap">
            {!canLoad && (
              <div className="video-placeholder">
                <img src={video.thumbnailUrl} alt={video.title} />
                <span>Scroll to load</span>
              </div>
            )}
            {canLoad && (
              <video
                ref={videoRef}
                className="video-element"
                poster={video.thumbnailUrl}
                muted={isMuted}
                onLoadedData={handleLoadedData}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                controls={false}
              >
                <source src={video.videoUrl} type="video/mp4" />
              </video>
            )}
            {!isReady && canLoad && (
              <div className="video-spinner">Loading video…</div>
            )}
          </div>
        )}
      </div>

      <div className="video-controls-bar">
        <button className="video-control-button" onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button className="video-control-button" onClick={handleMuteToggle}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
