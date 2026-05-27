import { useEffect, useRef, useState, type TouchEvent } from "react";
import type { Video } from "../../types/video";
import VideoPlayer from "../inner-slider/VideoPlayer";
import LikeButton from "../inner-slider/LikeButton";
import ShareButton from "../inner-slider/ShareButton";
import CommentSection from "../inner-slider/CommentSection";
import "./verticalCarousel.css";

interface Props {
  videos: Video[];
  startIndex: number;
  onClose: () => void;
  loadMore?: (neededIndex: number) => void;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const VerticalCarousel = ({ videos, startIndex, onClose, loadMore }: Props) => {
  const [current, setCurrent] = useState(startIndex);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    setCurrent(startIndex);
  }, [startIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goNext();
      if (e.key === "ArrowUp") goPrev();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const goPrev = () => {
    setCurrent((c) => clamp(c - 1, 0, videos.length - 1));
  };

  const goNext = () => {
    setCurrent((c) => clamp(c + 1, 0, videos.length - 1));
  };

  useEffect(() => {
    // request more pages if needed
    if (loadMore && current >= videos.length - 2) {
      loadMore(current + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const prev = videos[current - 1];
  const active = videos[current];
  const next = videos[current + 1];

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current == null) return;
    const end = e.changedTouches[0].clientY;
    const delta = end - touchStartY.current;
    const threshold = 40;
    if (delta > threshold) {
      goPrev();
    } else if (delta < -threshold) {
      goNext();
    }
    touchStartY.current = null;
  };

  return (
    <div className="vc-modal" role="dialog" aria-modal="true">
      <button className="vc-close" onClick={onClose} aria-label="Close">✕</button>
      <div
        className="vc-viewport"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="vc-slide vc-prev" aria-hidden={prev ? "false" : "true"}>
          {prev && <VideoPlayer video={prev} allowLoad={true} active={false} />}
        </div>

        <div className="vc-slide vc-active">
          {active && <VideoPlayer video={active} allowLoad={true} active={true} />}
          {active && (
            <div className="vc-actions-panel">
              <div className="vc-actions-row">
                <LikeButton videoId={active.id} initialLikes={active.likes ?? 0} />
                <ShareButton video={active} />
              </div>
              <CommentSection videoId={active.id} comments={active.comments ?? []} />
            </div>
          )}
        </div>

        <div className="vc-slide vc-next" aria-hidden={next ? "false" : "true"}>
          {next && <VideoPlayer video={next} allowLoad={true} active={false} />}
        </div>
      </div>

      <div className="vc-controls">
        <button onClick={goPrev} disabled={current === 0} aria-label="Previous video">▲</button>
        <span className="vc-index">{current + 1} / {videos.length}</span>
        <button onClick={goNext} disabled={current >= videos.length - 1} aria-label="Next video">▼</button>
      </div>
    </div>
  );
};

export default VerticalCarousel;
