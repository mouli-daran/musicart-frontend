import styles from "./Header.module.css";
import phoneIcon from "../../assets/phoneIcon.svg";
import musicIcon from "../../assets/musicIcon.svg";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const redirect = useNavigate();
  const [login, setLogin] = useState();

  return (
    <header className={styles.desktopHeader}>
      <div className={styles.leftBox}>
        <img src={phoneIcon} alt="phoneIcon" />
        <span>912121131313</span>
      </div>
      <div className={styles.middleBox}>
        <span>Get 50% off on selected items | Shop Now</span>
      </div>
      <div className={styles.rightBox}>
        {login ? (
          <button
            onClick={() => {
              setLogin(false);
              localStorage.removeItem("token");
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login </Link> | <Link to="/signup">Sign Up </Link>
          </>
        )}
      </div>
      <div
        className={styles.mobileHeader}
        onClick={() => {
          redirect("/");
        }}
      >
        <img src={musicIcon} alt="musicIcon" />
        <span>Musicart</span>
      </div>
    </header>
  );
};

export default Header;
