import { useEffect, useRef, useState } from "react";
import useIntersection from "../../hooks/useIntersection";

import { getVideos } from "../../api/videoApi";

import VideoCard from "./VideoCard";
import VerticalCarousel from "../shorts/VerticalCarousel";

import type { Video } from "../../types/video";

const PAGE_LIMIT = 12;

const OuterCarousel = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const sentinelVisible = useIntersection(sentinelRef, 0.1);

  // Fetch videos
  useEffect(() => {
    const fetchPage = async () => {
      if (loading) return;

      setLoading(true);

      try {
        const response = await getVideos(page, PAGE_LIMIT);

        // SAFETY CHECK
        const data = Array.isArray(response)
          ? response
          : response?.videos || [];

        if (data.length === 0) {
          setHasMore(false);
          return;
        }

        setVideos((prev) => {
          const merged = [...prev, ...data];

          const uniqueVideos = merged.filter(
            (video, index, self) =>
              index === self.findIndex((v) => v.id === video.id)
          );

          return uniqueVideos;
        });
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [page]);

  // Infinite scroll trigger
  useEffect(() => {
    if (sentinelVisible && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [sentinelVisible, hasMore, loading]);

  return (
    <div className="outer-carousel-container">
      <div className="outer-carousel" role="list">
        {videos.map((video, i) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={() => setSelectedIndex(i)}
          />
        ))}

        {/* Sentinel Element */}
        <div
          ref={sentinelRef}
          style={{ width: "1px", height: "1px" }}
        />
      </div>

      {selectedIndex !== null && (
        <VerticalCarousel
          videos={videos}
          startIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          loadMore={(neededIndex) => {
            if (
              neededIndex >= videos.length - 1 &&
              hasMore &&
              !loading
            ) {
              setPage((prev) => prev + 1);
            }
          }}
        />
      )}
    </div>
  );
};

export default OuterCarousel;