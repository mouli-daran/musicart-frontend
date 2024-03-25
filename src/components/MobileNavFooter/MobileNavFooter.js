import homeIcon from "../../assets/homeIcon.svg";
import logoutIcon from "../../assets/logout.svg";
import loginIcon from "../../assets/loginIcon.svg";
import cartIcon from "../../assets/cartIcon.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MobileNavFooter.module.css";
import { getCartProduct } from "../../apis/product";

const MobileNavFooter = (prop) => {
  const redirect = useNavigate();
  const [login, setLogin] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [selected, setSelected] = useState(prop.component);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    getCartProduct().then((data) => {
      if (data.status === "SUCCESS") {
        setProducts(data.data.length);
      }
    });
  }, []);

  console.log("navfooter length is ---", products);
  return (
    <div className={styles.footerNav}>
      <div onClick={() => setSelected("home")}>
        {selected === "home" ? <div></div> : ""}
        <img
          src={homeIcon}
          alt="homeicon"
          onClick={() => {
            redirect("/");
          }}
        />
        <span>Home</span>
      </div>
      <div onClick={() => setSelected("cart")}>
        {selected === "cart" ? <div></div> : ""}
        <img
          src={cartIcon}
          alt="carticon"
          onClick={() => {
            redirect("/cart");
          }}
        />
        <span>Cart</span>
        <p className={styles.carLength}>{products}</p>
      </div>
      <div
        onClick={() => {
          if (!login) {
            redirect("/login");
          }
          if (login) {
            localStorage.removeItem("token");
          }
        }}
      >
        <img
          src={login ? logoutIcon : loginIcon}
          alt="homeicon"
          onClick={(prev) => {
            setLogin(!prev);
          }}
        />
        <span>{login ? "Logout" : "Login"}</span>
      </div>
    </div>
  );
};

export default MobileNavFooter;
