import { useState } from "react";
import type { Video } from "../../types/video";

interface Props {
  video: Video;
}

const ShareButton = ({ video }: Props) => {
  const [shareLabel, setShareLabel] = useState("Share");

  const handleShare = async () => {
    const shareText = `${video.title} - ${video.description}`;
    const url = video.videoUrl;

    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, text: shareText, url });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${url}`);
        setShareLabel("Copied");
        setTimeout(() => setShareLabel("Share"), 2000);
      }
    } catch {
      setShareLabel("Failed");
      setTimeout(() => setShareLabel("Share"), 2000);
    }
  };

  return (
    <button className="share-button" onClick={handleShare}>
      {shareLabel}
    </button>
  );
};

export default ShareButton;