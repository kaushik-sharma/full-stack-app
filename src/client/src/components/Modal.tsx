import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  overlayColor?: string;
  backgroundColor?: string;
}> = ({ open, onClose, children, overlayColor = '#00000080', backgroundColor = '#ffffff' }) => {
  // Lazy‑create a div to mount the modal contents
  const el = React.useMemo(() => document.createElement('div'), []);

  useEffect(() => {
    const modalRoot = document.getElementById('modal-root')!;
    modalRoot.appendChild(el);
    return () => {
      modalRoot.removeChild(el);
    };
  }, [el]);

  if (!open) return null;

  // The portal renders its children into `el` instead of in-place
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: overlayColor,
      }}
      onClick={onClose}
    >
      <div
        className="rounded-[1.5rem]"
        style={{
          backgroundColor: backgroundColor,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    el
  );
};
