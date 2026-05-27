import { useState } from "react";

const useVideoControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  return {
    isPlaying,
    muted,
    togglePlay,
    toggleMute
  };
};

export default useVideoControls;