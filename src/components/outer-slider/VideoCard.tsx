import { memo } from "react";
import type { Video } from "../../types/video";

interface Props {
  video: Video;
  onClick: () => void;
}

const VideoCard = ({ video, onClick }: Props) => {
  return (
    <div
      className="video-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onClick();
        }
      }}
      style={{ flex: "0 0 33.3333%", maxWidth: "33.3333%" }}
    >
      <div className="video-card-thumb" style={{ width: "100%", height: 280, overflow: "hidden" }}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div className="video-card-body">
        <h3>{video.title}</h3>
        <p>{video.description}</p>
        <span className="video-card-meta">
          {video.type === "youtube" ? "YouTube" : "MP4"}
        </span>
      </div>
    </div>
  );
};

export default memo(VideoCard);