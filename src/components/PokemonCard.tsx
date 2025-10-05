import { spriteUrl } from "../api/pokeapi";

export default function PokemonCard({ id, name, onClick }: { id: number; name: string; onClick: () => void; }) {
  return (
    <div className="card" onClick={onClick} style={{ cursor: "pointer" }}>
      <img className="gallery-img" src={spriteUrl(id)} alt={`${name} sprite`} />
      <div style={{ marginTop: 8, textAlign: "center", fontWeight: 600 }}>{name}</div>
      <div style={{ textAlign: "center", opacity: 0.7 }}>#{id}</div>
    </div>
  );
}
