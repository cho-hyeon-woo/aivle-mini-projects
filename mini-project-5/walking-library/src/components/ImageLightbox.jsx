import { X } from "lucide-react";

export default function ImageLightbox({ src, onClose }) {
  if (!src) return null;

  return (
    <div className="image-lightbox-overlay" onClick={onClose}>
      <button className="image-lightbox-close" onClick={onClose} aria-label="닫기">
        <X size={20} aria-hidden="true" />
      </button>
      <img
        src={src}
        alt="확대 이미지"
        className="image-lightbox-img"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}