import { useMemo } from "react";
import usePokemonIndex from "../hooks/usePokemonIndex";
import SearchControls from "../components/SearchControls";
import PokemonList from "../components/PokemonList";
import { useSearchCtx } from "../context/SearchContext";
import styles from "./SearchPage.module.css";

/**
 * SearchPage
 * - Shows a search box + sort controls
 * - List remains empty until user types
 * - Updates SearchContext.resultIds so Details can do prev/next
 */
export default function SearchPage() {
  const { data: index, loading, error } = usePokemonIndex();
  const { query, sortBy, order, setResultIds } = useSearchCtx();

  const namesById = useMemo(() => {
    const m = new Map<number, string>();
    index.forEach((p) => m.set(p.id, p.name));
    return m;
  }, [index]);

  const filteredSortedIds = useMemo(() => {
    let items = index;
    const q = query.trim().toLowerCase();
    if (q.length > 0) {
      items = items.filter((p) => p.name.includes(q) || String(p.id) === q);
    } else {
      items = []; // ← empty until user types
    }
    items.sort((a, b) => {
      let cmp = sortBy === "name" ? a.name.localeCompare(b.name) : a.id - b.id;
      return order === "asc" ? cmp : -cmp;
    });
    return items.map((p) => p.id);
  }, [index, query, sortBy, order]);

  // Keep DetailsPage in sync for prev/next
  setResultIds(filteredSortedIds);

  return (
    <div className={styles.wrap}>
      <SearchControls onSearchChange={() => { /* controlled by context */ }} />

      {loading && <p className={styles.status}>Loading Pokédex…</p>}
      {error && <p className={styles.status} style={{ color: "crimson" }}>{error}</p>}

      {query.trim().length === 0 ? (
        <div className={styles.empty}>Start typing to search the Gen-1 Pokédex (1–151)…</div>
      ) : (
        <PokemonList ids={filteredSortedIds} namesById={namesById} />
      )}
    </div>
  );
}
