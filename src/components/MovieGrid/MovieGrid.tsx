import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './MovieGrid.module.css';
import type { Movie } from '../../types/movie';

type Props = {
  items: Movie[];
  onSelect?: (m: Movie) => void;
  resetKey?: string;
};

const PAGE_SIZE = 15;

export default function MovieGrid({ items, onSelect, resetKey }: Props) {
  const [count, setCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setCount(PAGE_SIZE); }, [resetKey, items]);

  const visible = useMemo(() => items.slice(0, count), [items, count]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCount((c) => Math.min(c + PAGE_SIZE, items.length));
        }
      },
      { rootMargin: '300px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [items.length]);

  if (!items || items.length === 0) {
    return <p className={styles.empty}>Nothing found yet.</p>;
  }

  return (
    <>
      { }
      <div
        className={styles.grid}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 16,
        }}
      >
        {visible.map((m) => (
          <div key={m.id} className={styles.card} onClick={() => onSelect?.(m)}>
            {m.poster && (
              <img
                className={styles.poster}
                src={m.poster}
                alt={m.title}
                loading="lazy"
              />
            )}
            <div className={styles.title}>{m.title}</div>
            {m.year && <div className={styles.meta}>{m.year}</div>}
          </div>
        ))}
      </div>

      { }
      <div ref={sentinelRef} className={styles.sentinel} />
    </>
  );
}
