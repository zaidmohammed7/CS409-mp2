import { useSearchCtx } from "../context/SearchContext";
import styles from './SearchControls.module.css';

export default function SearchControls({ onSearchChange }: { onSearchChange: (q: string) => void }) {
  const { query, setQuery, sortBy, setSortBy, order, setOrder } = useSearchCtx();
  return (
    <div className={`${styles.card} ${styles.controls}`} aria-label="search controls">
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); onSearchChange(e.target.value); }}
        placeholder="Search for Pokémon"
        aria-label="Search"
      />
      <div className={styles.inline}>
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="name">Name</option>
          <option value="id">ID</option>
        </select>
        <label className={styles.radio}>
          <input type="radio" name="ord" checked={order === "asc"} onChange={() => setOrder("asc")} /> ascending
        </label>
        <label className={styles.radio}>
          <input type="radio" name="ord" checked={order === "desc"} onChange={() => setOrder("desc")} /> descending
        </label>
      </div>
    </div>
  );
}