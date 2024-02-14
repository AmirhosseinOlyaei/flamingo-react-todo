import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import style from "./TodoListItem.module.css";
import SvgLogo from "./SvgLogo";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        <SvgLogo height="50px" width="50px" />
        <h1 className={styles.navTitle}>Task Minder</h1>
      </div>
      <div className={styles.navLinks}>
        <Link to="/home" className={style.button}>
          Home
        </Link>
        {/* Add more navigation links here if needed */}
        <Link to="/" className={style.button}>
          Log out
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
