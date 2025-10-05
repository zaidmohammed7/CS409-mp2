import { useEffect, useMemo, useState } from "react";
import usePokemonIndex from "../hooks/usePokemonIndex";
import { useNavigate } from "react-router-dom";
import { fetchDefaultPokemonIdsByTypeGen1, fetchTypeListGen1, spriteUrl } from "../api/pokeapi";
import { useSearchCtx } from "../context/SearchContext";
import styles from "./GalleryPage.module.css";

const PAGE = 60;

/**
 * GalleryPage
 * - Shows All Gen-1 in a grid (paginated "Load more")
 * - Type filter: filters to default forms inside Gen-1
 * - Pushes full list into context so Details prev/next work
 */
export default function GalleryPage() {
  const { data: index, loading, error } = usePokemonIndex();
  const [types, setTypes] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [typeIds, setTypeIds] = useState<number[] | null>(null);
  const [page, setPage] = useState(1);
  const nav = useNavigate();
  const { setResultIds } = useSearchCtx();

  useEffect(() => { setTypes([]); fetchTypeListGen1().then(setTypes); }, []);

  useEffect(() => {
    setPage(1);
    if (filter === "all") { setTypeIds(null); return; }
    let cancel = false;
    fetchDefaultPokemonIdsByTypeGen1(filter)
      .then(ids => { if (!cancel) setTypeIds(ids); })
      .catch(() => { if (!cancel) setTypeIds([]); });
    return () => { cancel = true; };
  }, [filter]);

  // FULL ordered list for current filter (used for context + prev/next)
  const allIdsSorted = useMemo(() => {
    const base = filter === "all" ? index.map(x => x.id) : (typeIds ?? []);
    return [...base].sort((a, b) => a - b);
  }, [filter, index, typeIds]);

  // Keep DetailsPage prev/next in sync
  useEffect(() => {
    setResultIds(allIdsSorted);
  }, [allIdsSorted, setResultIds]);

  // Rendered subset (pagination)
  const idsToShow = useMemo(() => {
    return allIdsSorted.slice(0, PAGE * page);
  }, [allIdsSorted, page]);

  const nameById = useMemo(() => {
    const m = new Map<number, string>();
    index.forEach(p => m.set(p.id, p.name));
    return m;
  }, [index]);

  return (
    <div>
      <div className={styles.toolbar} role="toolbar" aria-label="Type filter">
        <button className={styles.btn} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All</button>
        {types.map((t) => (
          <button key={t} className={styles.btn} aria-pressed={filter === t} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>

      {loading && <p className={styles.status}>Loading Pokédex…</p>}
      {error && <p className={styles.status} style={{ color: "crimson" }}>{error}</p>}

      <div className={styles.grid}>
        {idsToShow.map((id) => (
          <div key={id} className={styles.card} onClick={() => nav(`/details/${id}`)}>
            <img className={styles.art} src={spriteUrl(id)} alt={nameById.get(id) ?? `#${id}`} />
            <div className={styles.title}>{nameById.get(id) ?? `#${id}`}</div>
            <div className={styles.sub}>#{id}</div>
          </div>
        ))}
      </div>

      {idsToShow.length < allIdsSorted.length && (
        <div className={styles.center}>
          <button className={styles.btn} onClick={() => setPage((p) => p + 1)}>Load more</button>
        </div>
      )}
    </div>
  );
}
