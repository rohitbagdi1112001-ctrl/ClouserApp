import { useEffect, useMemo, useState } from "react";
import Modal from "../common/Modal";
import VideoPlayer from "./VideoPlayer";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import CommentSection from "./CommentSection";
import type { Video } from "../../types/video";

interface Props {
  videos: Video[];
  selectedVideo: number;
  close: () => void;
}

const InnerCarousel = ({ videos, selectedVideo, close }: Props) => {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    return videos.findIndex((video) => video.id === selectedVideo);
  });

  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    // initialize loadedIndices to contain 5 videos starting at currentIndex
    if (videos.length === 0) return;
    const slideCountLocal = videos.length;
    const indices = new Set<number>();
    for (let i = 0; i < Math.min(5, slideCountLocal); i++) {
      const idx = ((currentIndex + i) % slideCountLocal + slideCountLocal) % slideCountLocal;
      indices.add(idx);
    }
    setLoadedIndices(indices);
  }, [videos]);

  useEffect(() => {
    const selectedIndex = videos.findIndex((video) => video.id === selectedVideo);
    if (selectedIndex >= 0) {
      setCurrentIndex(selectedIndex);
    }
  }, [selectedVideo, videos]);

  const slideCount = videos.length;

  const getWrappedIndex = (index: number) => {
    return ((index % slideCount) + slideCount) % slideCount;
  };

  const activeIndices = useMemo(() => {
    if (slideCount <= 5) {
      return videos.map((_, index) => index);
    }

    return [
      getWrappedIndex(currentIndex - 2),
      getWrappedIndex(currentIndex - 1),
      getWrappedIndex(currentIndex),
      getWrappedIndex(currentIndex + 1),
      getWrappedIndex(currentIndex + 2),
    ];
  }, [currentIndex, slideCount, videos]);

  const addLoaded = (index: number) =>
    setLoadedIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });

  const goPrevious = () => {
    setCurrentIndex((previous) => {
      const next = getWrappedIndex(previous - 1);
      addLoaded(next);
      return next;
    });
  };

  const goNext = () => {
    setCurrentIndex((previous) => {
      const next = getWrappedIndex(previous + 1);
      addLoaded(next);
      return next;
    });
  };

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
    setTouchEndX(null);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) {
      setTouchStartX(null);
      setTouchEndX(null);
      return;
    }

    const delta = touchStartX - touchEndX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        goNext();
      } else {
        goPrevious();
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  if (slideCount === 0) {
    return null;
  }

  return (
    <Modal onClose={close}>
      <div className="inner-carousel-modal">
        <div className="inner-carousel-header">
          <div>
            <h2>{videos[currentIndex]?.title}</h2>
            <p>{videos[currentIndex]?.description}</p>
          </div>
          <div className="inner-carousel-actions">
            <button className="nav-button" onClick={goPrevious}>
              Previous
            </button>
            <button className="nav-button" onClick={goNext}>
              Next
            </button>
            <button className="close-button" onClick={close}>
              Close
            </button>
          </div>
        </div>

        <div
          className="carousel-track"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {activeIndices.map((index) => {
            const video = videos[index];
            const isCurrent = index === currentIndex;
            const allowLoad = loadedIndices.has(index);
            return (
              <div
                key={video.id}
                className={`slide ${isCurrent ? "slide-current" : "slide-inactive"}`}
              >
                <VideoPlayer video={video} allowLoad={allowLoad} />
                <div className="video-meta-actions">
                  <LikeButton videoId={video.id} initialLikes={video.likes} />
                  <ShareButton video={video} />
                </div>
                {isCurrent && (
                  <CommentSection
                    videoId={video.id}
                    comments={video.comments ?? []}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default InnerCarousel;
