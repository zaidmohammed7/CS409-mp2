import { useEffect, useState } from "react";
import { PokemonIndexItem } from "../types/pokemon";
import { fetchPokemonIndex } from "../api/pokeapi";

export default function usePokemonIndex() {
  const [data, setData] = useState<PokemonIndexItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const cached = localStorage.getItem("poke_index_v1");
        if (cached) {
          const parsed: PokemonIndexItem[] = JSON.parse(cached);
          setData(parsed);
          setLoading(false);
          // refresh silently
          fetchPokemonIndex().then((fresh) => {
            if (!cancelled) {
              setData(fresh);
              localStorage.setItem("poke_index_v1", JSON.stringify(fresh));
            }
          });
          return;
        }
        const index = await fetchPokemonIndex();
        if (cancelled) return;
        setData(index);
        localStorage.setItem("poke_index_v1", JSON.stringify(index));
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
