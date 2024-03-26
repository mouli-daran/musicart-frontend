import styles from "./Checkout.module.css";
import { ToastContainer, toast } from "react-toastify";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MobileNavFooter from "../../components/MobileNavFooter/MobileNavFooter";
import musicIcon from "../../assets/musicIcon.svg";
import backIcon from "../../assets/backIcon.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import headPhone from "../../assets/headphone.png";
import { useState, useEffect } from "react";
import {
  getCartProduct,
  getProductDetails,
  orderPlace,
} from "../../apis/product";

const Checkout = () => {
  const redirect = useNavigate();
  const { orderfrom } = useParams();
  const [products, setProducts] = useState(null);
  const [amount, setAmount] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const username = localStorage.getItem("username");

  useEffect(() => {
    if (orderfrom === "cart") {
      getCartProduct().then((data) => {
        if ((data.status = "SUCCESS")) {
          setProducts(data.data);
          const totalAmount = data.data.reduce((acc, item) => {
            return (acc += item.productId.price * item.quantity);
          }, 0);
          setAmount(totalAmount);
        }
      });
    } else {
      getProductDetails(orderfrom).then((data) => {
        if ((data.status = "SUCCESS")) {
          setProducts(data.data);
          setAmount(data.data.price);
        }
      });
    }
  }, []);

  console.log("products in review cart is==---", products);

  const handleOrderPlace = async () => {
    // Convert name, address, and paymentMethod to lowercase
    const lowerCaseName = username.toLowerCase();
    const lowerCaseAddress = deliveryAddress.toLowerCase();
    const lowerCasePaymentMethod = paymentMethod.toLowerCase();

    try {
      let result;
      if (orderfrom === "cart") {
        result = await orderPlace(
          lowerCaseName,
          lowerCaseAddress,
          lowerCasePaymentMethod,
          null,
          true
        );
      } else {
        result = await orderPlace(
          lowerCaseName,
          lowerCaseAddress,
          lowerCasePaymentMethod,
          orderfrom,
          false
        );
      }

      if (result.status === "SUCCESS") {
        toast.success(result.message);
        setTimeout(() => {
          redirect("/ordersuccess");
        }, 2000);
      } else {
        toast.error(result.message);
      }
      console.log("result from order is ---", result);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again later.");
    }
  };

  const handleProductClick = (product) => {
    console.log("clicked product is---", product.productId.heading);
    setSelectedProduct(product);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <section className={styles.desktoptitleNav}>
          <img src={musicIcon} alt="musicIcon" />
          <span>Musicart</span>
          <Link to="/">Home/</Link>
          <Link to="/productid">checkout</Link>
        </section>
        <button
          className={styles.backToProductBtnDesktop}
          onClick={() => {
            redirect("/");
          }}
        >
          Back to products
        </button>
        <div className={styles.backButtonMobile}>
          <img
            src={backIcon}
            alt="backArrow"
            onClick={() => {
              redirect("/");
            }}
          />
        </div>
        <h2 className={styles.checkoutTitle}>Checkout</h2>
        <main className={styles.checkoutContainer}>
          <div className={styles.detailsContainer}>
            <div className={styles.deliveryAddress}>
              <span>1. Delivery address</span>
              <div className={styles.deliveryTxtArea}>
                <span>{username}</span>
                <input
                  className={styles.deliveryAddressInput}
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter recipient address..."
                />
              </div>
            </div>
            <div className={styles.paymentMethod}>
              <span>2. Payment method</span>
              {/* Select input for payment method */}
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="CashOnDelivery">pay on delivery</option>
                <option value="UPI">upi</option>
                <option value="Card">card</option>
              </select>
            </div>
            <div className={styles.reviewItems}>
              <span>3. Review items and delivery</span>
              <div className={styles.productGrid}>
                <div>
                  {products === null ? (
                    <h1>Loading...</h1>
                  ) : (
                    products.map((product, index) => (
                      <div
                        key={index}
                        className={styles.productItem}
                        onClick={() => handleProductClick(product)}
                      >
                        {product.productId.image &&
                          product.productId.image[0] &&
                          product.productId.image[0].url && (
                            <img
                              src={product.productId.image[0].url}
                              alt={`product-${index}`}
                              className={styles.productImage}
                            />
                          )}
                      </div>
                    ))
                  )}
                </div>
                <div className={styles.productText}>
                  {selectedProduct && (
                    <div className={styles.selectedProductDetails}>
                      <span>{selectedProduct.productId.brand}</span>
                      <span>{selectedProduct.productId.heading}</span>
                      <span>Colour: {selectedProduct.productId.colour}</span>
                      <span>{selectedProduct.availale}</span>
                      <span>Estimated delivery:</span>
                      <span>Monday-FREE Standard Delivery</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.orderPlaceSideSection}>
            <button onClick={handleOrderPlace}>Place your order</button>
            <span>
              By placing your order, you agree to Musicart privacy notice and
              conditions of use.
            </span>
            <div>
              <h5>Order Summary</h5>
              <div>
                <span>Item:</span>
                <span>₹{amount !== null ? amount.toFixed(2) : ""}</span>
              </div>
              <div>
                <span>Delivery:</span>
                <span>₹45.00</span>
              </div>
              <div>
                <span>Order Total:</span>
                <span>₹{amount !== null ? (amount + 45).toFixed(2) : ""}</span>
              </div>
            </div>
          </div>
        </main>
        <div className={styles.orderSummaryBottomSide}>
          <button onClick={handleOrderPlace}>Place your order</button>
          <div>
            <span>
              Order Total : ₹{amount !== null ? (amount + 45).toFixed(2) : ""}
            </span>
            <span>
              By placing your order, you agree to Musicart privacy notice and
              conditions of use.
            </span>
          </div>
        </div>
      </div>
      <section className={styles.desktopFooter}>
        <Footer />
      </section>
      <MobileNavFooter component={"cart"} />
    </>
  );
};

export default Checkout;
