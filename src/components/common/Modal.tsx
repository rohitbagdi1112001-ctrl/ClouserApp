import React from "react";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: Props) => {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;