import { useState, FormEvent } from 'react';
import styles from './SearchBar.module.css';

type Props = { onSubmit: (q: string) => void };

export default function SearchBar({ onSubmit }: Props) {
  const [q, setQ] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    onSubmit(value);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Search movies..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
      />
      <button type="submit" className={styles.button}>Search</button>
    </form>
  );
}
