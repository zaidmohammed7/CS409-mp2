import { useNavigate } from "react-router-dom";
import { spriteUrl } from "../api/pokeapi";
import styles from "./PokemonList.module.css";

export default function PokemonList({ ids, namesById }:{
  ids:number[]; namesById: Map<number,string>;
}) {
  const nav = useNavigate();
  if (ids.length === 0) return null;
  return (
    <div className={styles.list}>
      {ids.map(id => (
        <div key={id} className={styles.item} onClick={() => nav(`/details/${id}`)}>
          <img className={styles.img} src={spriteUrl(id)} alt={`${namesById.get(id)} sprite`} />
          <div>
            <div className={styles.name}>{namesById.get(id)}</div>
            <div className={styles.meta}>ID: {id}</div>
          </div>
        </div>
      ))}
    </div>
  );
}