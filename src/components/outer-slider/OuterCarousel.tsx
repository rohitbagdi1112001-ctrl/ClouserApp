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
  const [loading, setLoading] = useState(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const sentinelVisible = useIntersection(sentinelRef, 0.1);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const data = await getVideos(page, PAGE_LIMIT);
        if (!data || data.length === 0) {
          setHasMore(false);
          return;
        }
        setVideos((prev) => [...prev, ...data]);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [page]);

  useEffect(() => {
    if (sentinelVisible && hasMore && !loading) {
      setPage((p) => p + 1);
    }
  }, [sentinelVisible, hasMore, loading]);

  return (
    <div className="outer-carousel-container">
      <div className="outer-carousel" role="list">
        {videos.map((video, i) => (
          <VideoCard key={video.id} video={video} onClick={() => setSelectedIndex(i)} />
        ))}
        <div ref={sentinelRef as any} style={{ width: 1, height: 1 }} />
      </div>

      {selectedIndex !== null && (
        <VerticalCarousel
          videos={videos}
          startIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          loadMore={(neededIndex) => {
            // if the needed index is beyond loaded videos, advance page until we have it
            if (neededIndex >= videos.length && hasMore) {
              setPage((p) => p + 1);
            }
          }}
        />
      )}
    </div>
  );
};

export default OuterCarousel;