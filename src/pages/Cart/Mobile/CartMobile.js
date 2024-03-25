import styles from "./CartMobile.module.css";
import Header from "../../../components/Header/Header";
import MobileNavFooter from "../../../components/MobileNavFooter/MobileNavFooter";
import backIcon from "../../../assets/backIcon.svg";
import headPhone from "../../../assets/headphone.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCartProduct } from "../../../apis/product";

const CartMobile = () => {
  const redirect = useNavigate();
  const [products, setProducts] = useState(null);

  useEffect(() => {
    getCartProduct().then((data) => {
      if (data.status === "SUCCESS") {
        setProducts(data.data);
      }
    });
  }, []);

  const handlePlaceOrder = async () => {
    redirect("/checkout/cart");
  };
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.backButton}>
          <img
            src={backIcon}
            alt="backArrow"
            onClick={() => {
              redirect("/");
            }}
          />
        </div>
        {products === null || products.length === 0 ? (
          <center
            style={{ marginTop: "30vh", fontWeight: "500", fontSize: "3vw" }}
          >
            <h1>Cart Empty</h1>
          </center>
        ) : (
          <>
            <div className={styles.allCartProduct}>
              {products.map((item, index) => {
                return (
                  <div>
                    <img src={item.productId.image[0].url} alt="headphoneimg" />
                    <div className={styles.productDetails}>
                      <span>
                        {item.productId.brand} {item.productId.heading}
                      </span>
                      <span>₹{item.productId.price}</span>
                      <span>Clour : {item.productId.colour}</span>
                      <span>In Stock</span>
                      <span className={styles.conevienceFee}>
                        Convenience Fee <span>₹45</span>
                      </span>
                    </div>
                  </div>
                );
              })}
              <span className={styles.conevienceFee}>
                Convenience Fee <span>₹45</span>
              </span>
              <summary>
                <span>Total:</span>
                <span>
                  ₹
                  {products.reduce((acc, item) => {
                    return (acc += item.quantity * item.productId.price);
                  }, 0) + 45}
                </span>
              </summary>
            </div>
            <div className={styles.totalAmountAndOrderBtn}>
              <div>
                <span>Total Amount</span>
                <span>
                  ₹
                  {products.reduce((acc, item) => {
                    return (acc += item.quantity * item.productId.price);
                  }, 0) + 45}
                </span>
              </div>
              <button onClick={handlePlaceOrder}>PLACE ORDER</button>
            </div>
          </>
        )}
      </div>

      <MobileNavFooter component={"cart"} />
    </>
  );
};

export default CartMobile;
