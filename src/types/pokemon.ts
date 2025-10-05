export interface PokemonIndexItem {
  id: number;
  name: string;
}

export interface PokemonTypeRef { type: { name: string; url: string; } }

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other?: { ["official-artwork"]?: { front_default: string | null } };
  };
  types: PokemonTypeRef[];
  abilities: { ability: { name: string } }[];
  height: number;
  weight: number;
  stats: { base_stat: number; stat: { name: string } }[];
}
