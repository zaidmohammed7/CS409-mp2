// src/pages/DetailsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePokemonIndex from "../hooks/usePokemonIndex";
import { fetchPokemon } from "../api/pokeapi";
import type { PokemonDetails } from "../types/pokemon";
import { useSearchCtx } from "../context/SearchContext";
import styles from "./DetailsPage.module.css";

export default function DetailsPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const numericId = Number(id);
  const isGen1 = Number.isFinite(numericId) && numericId >= 1 && numericId <= 151;

  // Hooks must be called every render, unconditionally:
  const [poke, setPoke] = useState<PokemonDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { resultIds } = useSearchCtx();
  const { data: index } = usePokemonIndex();

  // Effect is always declared; we branch *inside* it.
  useEffect(() => {
    let cancel = false;

    // reset state whenever the ID changes
    setError(null);
    setPoke(null);

    // Only fetch if Gen-1 and a valid number
    if (!isGen1) return;

    (async () => {
      try {
        const d = await fetchPokemon(numericId);
        if (!cancel) setPoke(d);
      } catch (e: any) {
        if (!cancel) setError(e.message || "Failed to load");
      }
    })();

    return () => {
      cancel = true;
    };
  }, [numericId, isGen1]);

  // Use context list if present; otherwise fall back to full Gen-1 index
  const listForNav = useMemo(() => {
    if (resultIds && resultIds.length > 0) return resultIds;
    return [...index.map(p => p.id)].sort((a, b) => a - b);
  }, [resultIds, index]);

  const { prevId, nextId } = useMemo(() => {
    const i = listForNav.indexOf(numericId);
    return {
      prevId: i > 0 ? listForNav[i - 1] : undefined,
      nextId: i >= 0 && i < listForNav.length - 1 ? listForNav[i + 1] : undefined,
    };
  }, [listForNav, numericId]);

  // Now it’s safe to conditionally return different UI
  if (!isGen1) {
    return <div className={styles.warning}>Only Generation-1 is supported in this Pokédex.</div>;
  }

  if (error) return <p style={{ color: "crimson", textAlign: "center" }}>{error}</p>;
  if (!poke) return <p style={{ textAlign: "center" }}>Loading…</p>;

  const art = poke.sprites.other?.["official-artwork"]?.front_default ?? poke.sprites.front_default;

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <button className={styles.btn} onClick={() => nav(-1)}>← Back</button>
        <div style={{ display: "flex", gap: 8 }}>
          <button className={styles.btn} disabled={!prevId} onClick={() => prevId && nav(`/details/${prevId}`)}>‹ Prev</button>
          <button className={styles.btn} disabled={!nextId} onClick={() => nextId && nav(`/details/${nextId}`)}>Next ›</button>
        </div>
      </div>

      <div className={styles.row}>
        {art && <img className={styles.art} src={art} alt={poke.name} />}
        <div>
          <h2 className={styles.name}>
            {poke.name} <span style={{ opacity: 0.7 }}>#{poke.id}</span>
          </h2>
          <div className={styles.badges}>
            {poke.types.map((t) => (<span key={t.type.name} className={styles.badge}>{t.type.name}</span>))}
          </div>
          <p className={styles.meta}>Height: {poke.height} &nbsp;|&nbsp; Weight: {poke.weight}</p>
          <div className={styles.badges}>
            {poke.abilities.map((a) => (<span key={a.ability.name} className={styles.badge}>{a.ability.name}</span>))}
          </div>
        </div>
      </div>

      <h3 className={styles.stats}>Stats</h3>
      <ul>
        {poke.stats.map(s => (
          <li key={s.stat.name}>{s.stat.name}: {s.base_stat}</li>
        ))}
      </ul>
    </div>
  );
}
