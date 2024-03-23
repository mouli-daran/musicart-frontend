import styles from "./ProductDesktop.module.css";
import { ToastContainer, toast } from "react-toastify";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import musicIcon from "../../../assets/musicIcon.svg";
import cart from "../../../assets/cart.svg";
import starImage from "../../../assets/star.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  getProductDetails,
  addToCart,
  getCartProduct,
} from "../../../apis/product";

const ProductDetailsDesktop = () => {
  const redirect = useNavigate();
  const { id } = useParams();
  const imgRef = useRef(null);
  const [productDetails, setProductDetails] = useState(null);
  const [cartLength, setCartLength] = useState(0);
  const [login, setLogin] = useState(
    localStorage.getItem("musicArtToken") ? true : false
  );

  useEffect(() => {
    getProductDetails(id).then((data) => {
      setProductDetails(data.data);
    });
    getCartProduct().then((data) => {
      if (data.status === "SUCCESS") {
        setCartLength(data.data.length);
      }
    });
  }, []);

  let stars = [];
  if (productDetails) {
    for (let i = 0; i < productDetails.rating; i++) {
      stars.push(i);
    }
  }

  const handleCart = async () => {
    const result = await addToCart(id, 1, false);
    if (result.status === "SUCCESS") {
      toast.success("Added To Cart");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <>
      <section className={styles.header}>
        <Header />
      </section>
      <div className={styles.container}>
        <section className={styles.firstBox}>
          <div className={styles.titleNav}>
            <img src={musicIcon} alt="musicIcon" />
            <span>Musicart</span>
            <Link to="/">Home/</Link>
            {productDetails === null ? (
              <a href="#"></a>
            ) : (
              <a>
                {productDetails.brand}
                {productDetails.model}
              </a>
            )}
          </div>
          <div
            className={styles.cart}
            onClick={() => {
              redirect("/cart");
            }}
          >
            <img src={cart} alt="cartIcon" />
            <span>{cartLength}</span>
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
        {productDetails === null ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <div className={styles.productDescriptionHeader}>
              {productDetails.shortDescription}
            </div>
            <section className={styles.fullProductDetails}>
              <div className={styles.imageBox}>
                <img
                  ref={imgRef}
                  src={productDetails.image[0].url}
                  alt="headphoneicon"
                />
                <div className={styles.smallImages}>
                  <img
                    src={productDetails.image[0].url}
                    alt="headphoneicon"
                    onClick={(e) => {
                      imgRef.current.src = e.target.src;
                    }}
                  />
                  <img
                    src={productDetails.image[1].url}
                    alt="headphoneicon"
                    onClick={(e) => {
                      imgRef.current.src = e.target.src;
                    }}
                  />
                  <img
                    src={productDetails.image[2].url}
                    alt="headphoneicon"
                    onClick={(e) => {
                      imgRef.current.src = e.target.src;
                    }}
                  />
                </div>
              </div>
              <div className={styles.productTextDetail}>
                <h1 className={styles.productTitle}>
                  {productDetails.brand} {productDetails.model}
                </h1>
                <div className={styles.ratingBox}>
                  {stars.map((item) => {
                    return <img key={item} src={starImage} alt="star icon" />;
                  })}
                  <span>({productDetails.reviewCount} Customer reviews)</span>
                </div>
                <span className={styles.price}>
                  Price-₹{productDetails.price}
                </span>
                <span className={styles.colorType}>
                  {productDetails.color} | {productDetails.headphoneType}
                </span>
                <div className={styles.aboutProduct}>
                  <span>About this item</span>
                  <ul>
                    {productDetails.about.map((item, index) => {
                      return <li key={index}>{item}</li>;
                    })}
                  </ul>
                </div>
                <div className={styles.availableAndBrand}>
                  <div>
                    <span>Available -</span>
                    <span> {productDetails.available}</span>
                  </div>
                  <div>
                    <span>Brand -</span>
                    <span> {productDetails.brand}</span>
                  </div>
                </div>
                {login ? (
                  <div className={styles.buttons}>
                    <button onClick={handleCart}>Add to cart</button>
                    <button
                      onClick={() => {
                        redirect(`/checkout/${productDetails._id}`);
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                ) : (
                  <div className={styles.buttons}>
                    <div>
                      <span
                        onClick={() => {
                          redirect("/signin");
                        }}
                      >
                        Login
                      </span>
                      /
                      <span
                        onClick={() => {
                          redirect("/signup");
                        }}
                      >
                        Sign Up
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
      <section className={styles.footer}>
        <Footer />
      </section>
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

export default ProductDetailsDesktop;
