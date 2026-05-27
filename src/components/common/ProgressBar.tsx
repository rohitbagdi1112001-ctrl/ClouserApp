interface Props {
  progress: number;
}

const ProgressBar = ({ progress }: Props) => {
  return (
    <div className="progress-container">
      <div
        className="progress-fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;