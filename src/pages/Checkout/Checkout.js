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
  const [products, setProducts] = useState([]);
  const [amount, setAmount] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFromViewCart, setIsFromViewCart] = useState(false); // Track the source of products

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
          setIsFromViewCart(true); // Set the source of products
        }
      });
    } else {
      getProductDetails(orderfrom).then((data) => {
        if ((data.status = "SUCCESS")) {
          setProducts([data.data]);
          setAmount(data.data.price);
          setIsFromViewCart(false); // Set the source of products
        }
      });
    }
  }, [orderfrom]);

  console.log("products in checkout is==---", products);

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
        toast.success("Order created successfully");
        setTimeout(() => {
          redirect("/ordersuccess");
        }, 2000);
      } else {
        toast.error(result.message);
      }
      console.log("result from order is ---", result);
    } catch (error) {
      toast.error("Failed to create order..");
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
                <option value="UPI">pay on delivery</option>
                <option value="UPI">upi</option>
                <option value="card">card</option>
              </select>
            </div>
            <div className={styles.reviewItems}>
              <span>3. Review items and delivery</span>
              <div className={styles.productGrid}>
                <div>
                  {products === null || products === undefined ? (
                    <h1>Loading...</h1>
                  ) : products.length === 0 ? (
                    <h1>No products found</h1>
                  ) : (
                    products.map((product, index) => (
                      <div key={index} className={styles.productItem}>
                        {isFromViewCart
                          ? // Render product images for products from view cart
                            product.productId.image &&
                            product.productId.image[0] &&
                            product.productId.image[0].url && (
                              <img
                                src={product.productId.image[0].url}
                                alt={`product-${index}`}
                                className={styles.productImage}
                                onClick={() => handleProductClick(product)}
                              />
                            )
                          : // Render product images for products from buy now
                            product.image &&
                            product.image[0] &&
                            product.image[0].url && (
                              <img
                                src={product.image[0].url}
                                alt={`product-${index}`}
                                className={styles.productImage}
                              />
                            )}
                      </div>
                    ))
                  )}
                </div>
                <div className={styles.productText}>
                  {products.map((product, index) => (
                    <div key={index} className={styles.selectedProductDetails}>
                      <span>
                        {isFromViewCart
                          ? product.productId.brand
                          : product.brand}
                      </span>
                      <span>
                        {isFromViewCart
                          ? product.productId.heading
                          : product.heading}
                      </span>
                      <span>
                        Colour:{" "}
                        {isFromViewCart
                          ? product.productId.colour
                          : product.colour}
                      </span>
                      <span>
                        {isFromViewCart ? product.availale : product.available}
                      </span>
                      <span>Estimated delivery:</span>
                      <span>Monday-FREE Standard Delivery</span>
                    </div>
                  ))}
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default Checkout;
