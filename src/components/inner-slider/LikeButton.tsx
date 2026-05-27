import { useEffect, useState } from "react";
import { likeVideo } from "../../api/videoApi";

interface Props {
  videoId: number;
  initialLikes: number;
}

const STORAGE_KEY = "clouser-liked-videos";

const getStoredLikes = (): number[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setStoredLikes = (items: number[]) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const LikeButton = ({ videoId, initialLikes }: Props) => {
  const [count, setCount] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const storedLikes = getStoredLikes();
    setLiked(storedLikes.includes(videoId));
  }, [videoId]);

  useEffect(() => {
    const storedLikes = getStoredLikes();
    const updatedLikes = liked
      ? Array.from(new Set([...storedLikes, videoId]))
      : storedLikes.filter((id) => id !== videoId);

    setStoredLikes(updatedLikes);
  }, [liked, videoId]);

  const handleLike = async () => {
    if (pending) return;

    const nextLiked = !liked;
    const delta = nextLiked ? 1 : -1;
    setLiked(nextLiked);
    setCount((current) => Math.max(0, current + delta));
    setPending(true);

    try {
      await likeVideo(videoId, nextLiked ? "like" : "unlike");
    } catch {
      setLiked(!nextLiked);
      setCount((current) => Math.max(0, current - delta));
    } finally {
      setPending(false);
    }
  };

  return (
    <button className="like-button" onClick={handleLike} disabled={pending}>
      {liked ? "💖" : "🤍"} {count}
    </button>
  );
};

export default LikeButton;
