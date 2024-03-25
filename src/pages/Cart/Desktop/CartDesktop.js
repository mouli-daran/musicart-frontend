import styles from "./CartDesktop.module.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import musicIcon from "../../../assets/musicIcon.svg";
import bag from "../../../assets/bag.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCartProduct, addToCart } from "../../../apis/product";
import { ToastContainer, toast } from "react-toastify";

const CartDesktop = () => {
  const redirect = useNavigate();
  const [products, setProducts] = useState(null);

  useEffect(() => {
    getCartProduct().then((data) => {
      if (data.status === "SUCCESS") {
        setProducts(data.data);
      }
    });
  }, []);
  console.log("products from cart is ---", products);

  const handleQuantityChange = async (id, newQuantity) => {
    try {
      const updatedProducts = products.map((item) => {
        if (item.productId._id === id) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setProducts(updatedProducts); // Update the state with the new quantity

      const result = await addToCart([
        { id, quantity: newQuantity, replaceQuantity: true },
      ]);
      if (result.status !== "SUCCESS") {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const handlePlaceOrder = async () => {
    redirect("/checkout/cart");
  };

  return (
    <>
      <section className={styles.header}>
        <Header />
      </section>
      <main className={styles.container}>
        <section className={styles.firstBox}>
          <div className={styles.titleNav}>
            <img src={musicIcon} alt="musicIcon" />
            <span>Musicart</span>
            <Link to="/">Home/</Link>
            <Link to="/productid">Productname</Link>
          </div>
        </section>
        <button
          className={styles.backToProductBtn}
          onClick={() => {
            redirect("/");
          }}
        >
          Back to products
        </button>
        <section className={styles.CartProductsBox}>
          <title className={styles.cartTitle}>
            <img src={bag} alt="cartbagicon" />
            <span>My Cart</span>
          </title>
          {products === null || products.length === 0 ? (
            <center
              style={{ marginTop: "10vh", fontWeight: "500", fontSize: "3vw" }}
            >
              <h1>Cart Empty</h1>
            </center>
          ) : (
            <div className={styles.cartContainer}>
              <div className={styles.allProducts}>
                {products.map((item, index) => {
                  return (
                    <div className={styles.ProductDetails} key={index}>
                      <div>
                        <img
                          src={item?.productId?.image[0].url}
                          alt="productImage"
                        />
                        <div>
                          <span>
                            {item.productId.brand} {item.productId.heading}
                          </span>
                          <span>Clour:{item.productId.colour}</span>
                          <span>{item.productId.available}</span>
                        </div>
                        <div>
                          <span>Price</span>
                          <span>₹{item.productId.price}</span>
                        </div>
                        <div className={styles.quantity}>
                          <span>Quantity</span>
                          <select
                            name="quantity"
                            onChange={(e) => {
                              handleQuantityChange(
                                item.productId._id,
                                e.target.value
                              );
                            }}
                          >
                            <option value={item.quantity} selected hidden>
                              {item.quantity}
                            </option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                          </select>
                        </div>
                        <div className={styles.total}>
                          <span>Total</span>
                          <span>₹{item.productId.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.totalAmount}>
                <div>
                  <h5>PRICE DETAILS</h5>
                  <div className={styles.totalMRP}>
                    <span>Total MRP</span>
                    <span>
                      ₹
                      {products.reduce((acc, item) => {
                        return (acc += item.productId.price * item.quantity);
                      }, 0)}
                    </span>
                  </div>
                  <div className={styles.discounts}>
                    <span>Discounts on MRP</span>
                    <span>₹0</span>
                  </div>
                  <div className={styles.conveinceFee}>
                    <span>Convenience Fee</span>
                    <span>₹45</span>
                  </div>
                </div>
                <div className={styles.totalAmoutAndPlaceOrder}>
                  <div>
                    <span>Total Amount</span>
                    <span>
                      ₹
                      {products.reduce((acc, item) => {
                        return (acc += item.productId.price * item.quantity);
                      }, 0) + 45}
                    </span>
                  </div>
                  <button onClick={handlePlaceOrder}>PLACE ORDER</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <section className={styles.footer}>
        <Footer />
      </section>
    </>
  );
};

export default CartDesktop;
