import { NavLink } from "react-router-dom";
import styles from './NavBar.module.css';

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <NavLink
        to="/"
        end
        className={({isActive}) => `${styles.link} ${isActive ? styles.active : ''}`}
      >
        Search
      </NavLink>
      <NavLink
        to="/gallery"
        className={({isActive}) => `${styles.link} ${isActive ? styles.active : ''}`}
      >
        Gallery
      </NavLink>
    </nav>
  );
}
