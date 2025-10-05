import { PokemonDetails, PokemonIndexItem } from "../types/pokemon";

const API = "https://pokeapi.co/api/v2";

const idFromUrl = (url: string) => parseInt(url.split("/").filter(Boolean).pop()!, 10);

const GEN1_TYPES = [
  "normal", "fighting", "flying", "poison", "ground", "rock", 
  "bug", "ghost", "steel", "fire", "water", "grass", 
  "electric", "psychic", "ice", "dragon", "fairy"
];


export async function fetchPokemonIndex(): Promise<PokemonIndexItem[]> {
  // species avoids variants; then we trim to 1..151 (Kanto)
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species?limit=20000&offset=0`);
  if (!res.ok) throw new Error("Failed to fetch species index");
  const data = await res.json();
  return data.results
    .map((r: { name: string; url: string }) => ({ name: r.name, id: idFromUrl(r.url) }))
    .filter((p: PokemonIndexItem) => p.id >= 1 && p.id <= 151)      // ← Gen-1 filter
    .sort((a: PokemonIndexItem, b: PokemonIndexItem) => a.id - b.id);
}


export async function fetchPokemon(idOrName: string | number): Promise<PokemonDetails> {
  const res = await fetch(`${API}/pokemon/${idOrName}`);
  if (!res.ok) throw new Error("Pokemon not found");
  return res.json();
}

export async function fetchTypeListGen1(): Promise<string[]> {
  // You can skip the API call entirely and just return GEN1_TYPES,
  // but this keeps future-proofing if you ever want to cross-check.
  return GEN1_TYPES;
}

// IDs for all Pokémon of a given type
export async function fetchPokemonIdsByType(typeName: string): Promise<number[]> {
  const res = await fetch(`${API}/type/${typeName}`);
  if (!res.ok) throw new Error("Failed to fetch type members");
  const data = await res.json();
  return data.pokemon.map((p: { pokemon: { url: string } }) => {
    const url = p.pokemon.url as string;
    return parseInt(url.split("/").filter(Boolean).pop()!, 10);
  });
}

// sprite helper
export function spriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export async function fetchDefaultPokemonIdsByTypeGen1(typeName: string): Promise<number[]> {
  const res = await fetch(`${API}/type/${typeName}`);
  if (!res.ok) throw new Error("Failed to fetch type members");
  const data = await res.json();

  // 1) Keep only ids 1..151
  const ids = data.pokemon
    .map((p: { pokemon: { url: string } }) => idFromUrl(p.pokemon.url))
    .filter((id: number) => id >= 1 && id <= 151);

  // 2) Keep only default varieties (avoid gmax/alola/etc.)
  const uniqDefault: number[] = [];
  const seen = new Set<number>();

  for (const id of ids) {
    const det = await fetch(`${API}/pokemon/${id}`).then(r => r.json());
    if (det.is_default && !seen.has(id)) {
      seen.add(id);
      uniqDefault.push(id);
    }
  }
  return uniqDefault.sort((a, b) => a - b);
}