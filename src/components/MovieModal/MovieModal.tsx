import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './MovieModal.module.css';
import type { Movie } from '../../types/movie';
import { imgUrl } from '../../services/movieService';

export interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const modalRoot = document.getElementById('modal-root')!;

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const bigSrc =
    movie.backdrop ||
    (movie.poster ? movie.poster.replace('/w300', '/w500') : '') ||
    imgUrl(movie.backdrop_path, 'original') ||
    imgUrl(movie.poster_path, 'w500');

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={onBackdropClick}>
      <div className={css.modal}>
        <button className={css.closeButton} aria-label="Close modal" onClick={onClose}>
          &times;
        </button>

        {bigSrc ? (
          <img src={bigSrc} alt={movie.title} className={css.image} />
        ) : (
          <div className={css.content} style={{ padding: 20 }}>
            <h2>{movie.title}</h2>
          </div>
        )}

        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview || 'No overview available.'}</p>
          <p>
            <strong>Release Date:</strong> {movie.releaseDate || '—'}
          </p>
          <p>
            <strong>Rating:</strong> {typeof movie.rating === 'number' ? movie.rating.toFixed(1) : '—'}/10
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
