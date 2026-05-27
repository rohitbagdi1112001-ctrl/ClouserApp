interface Props {
  isPlaying: boolean;
  muted: boolean;
  onPlayPause: () => void;
  onMute: () => void;
}

const VideoControls = ({
  isPlaying,
  muted,
  onPlayPause,
  onMute
}: Props) => {
  return (
    <div>
      <button onClick={onPlayPause}>
        {isPlaying ? "Pause" : "Play"}
      </button>

      <button onClick={onMute}>
        {muted ? "Unmute" : "Mute"}
      </button>
    </div>
  );
};

export default VideoControls;