import styles from "./ProductMobile.module.css";
import { ToastContainer, toast } from "react-toastify";
import MobileNavFooter from "../../../components/MobileNavFooter/MobileNavFooter";
import Header from "../../../components/Header/Header";
import starImage from "../../../assets/star.svg";
import next from "../../../assets/next.svg";
import previous from "../../../assets/prev.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  getProductDetails,
  addToCart,
  getCartProduct,
} from "../../../apis/product";
import backIcon from "../../../assets/backIcon.svg";

const ProductMobile = () => {
  const redirect = useNavigate();
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [slideCounter, setSlideCounter] = useState(0);
  const [products, setProducts] = useState(null);
  const [login, setLogin] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [cartLength, setCartLength] = useState(0);

  useEffect(() => {
    getProductDetails(id).then((data) => {
      setProductDetails(data.data);
    });
  }, []);

  const updateCartLength = async () => {
    try {
      const data = await getCartProduct();
      if (data.status === "SUCCESS") {
        setCartLength(data.data.length);
      }
    } catch (error) {
      console.error("Error fetching cart length:", error);
    }
  };

  let stars = [];
  if (productDetails) {
    for (let i = 0; i < productDetails.rating; i++) {
      stars.push(i);
    }
  }

  const handleCart = async () => {
    if (!productDetails || !productDetails._id) {
      console.error("Product details are not available.");
      return;
    }

    try {
      const result = await addToCart([
        { id: productDetails._id, quantity: 1, replaceQuantity: false },
      ]);
      console.log("Product add result:", result);

      if (result.status === "SUCCESS") {
        toast.success("Added To Cart");
        updateCartLength();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const goToNextImg = () => {
    slideCounter < 3 ? setSlideCounter(slideCounter + 1) : setSlideCounter(0);
  };

  const goToPrevImg = () => {
    slideCounter > 0 ? setSlideCounter(slideCounter - 1) : setSlideCounter(3);
  };

  const startX = useRef(null);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!startX.current) return;

    const currentX = e.touches[0].clientX;
    const diff = startX.current - currentX;

    if (diff > 0) {
      goToNextImg();
    } else if (diff < -0) {
      goToPrevImg();
    }

    startX.current = null;
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
        {login ? (
          <button
            className={styles.buyNowButton}
            onClick={() => {
              redirect(`/checkout/${productDetails._id}`);
            }}
          >
            Buy Now
          </button>
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
        {productDetails === null ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <div className={styles.productImgSlider}>
              <div
                className={styles.productImages}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                {productDetails.image.map((item, index) => {
                  return (
                    <img
                      key={index}
                      src={item.url}
                      alt={`headphoneImg${index}`}
                      style={{
                        left: `${index * 100}%`,
                        transform: `translateX(-${slideCounter * 100}%)`,
                      }}
                    />
                  );
                })}
              </div>
              <div className={styles.imageNoShow}>
                <img src={previous} alt="previcon" onClick={goToPrevImg} />
                <div
                  style={{
                    backgroundColor:
                      slideCounter === 0 ? "rgba(46, 0, 82, 1)" : "",
                  }}
                ></div>
                <div
                  style={{
                    backgroundColor:
                      slideCounter === 1 ? "rgba(46, 0, 82, 1)" : "",
                  }}
                ></div>
                <div
                  style={{
                    backgroundColor:
                      slideCounter === 2 ? "rgba(46, 0, 82, 1)" : "",
                  }}
                ></div>
                <div
                  style={{
                    backgroundColor:
                      slideCounter === 3 ? "rgba(46, 0, 82, 1)" : "",
                  }}
                ></div>
                <img src={next} alt="previcon" onClick={goToNextImg} />
              </div>
            </div>
            <div className={styles.porductDetails}>
              <h1 className={styles.productTitle}>
                {productDetails.brand} {productDetails.heading}
              </h1>
              <div className={styles.ratingBox}>
                {stars.map((item) => {
                  return <img key={item} src={starImage} alt="star icon" />;
                })}
                <span>({productDetails.reviewCount} Customer reviews)</span>
              </div>
              <div className={styles.productDescriptionHeader}>
                {productDetails.shortDescription}
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
                  {productDetails.aboutThisItem.map((item, index) => {
                    return <li key={index}>{item}</li>;
                  })}
                </ul>
              </div>
              <div className={styles.availableAndBrand}>
                <div>
                  <span>Available - In Stock</span>
                  <span> {productDetails.available}</span>
                </div>
                <div>
                  <span>Brand -</span>
                  <span> {productDetails.brand}</span>
                </div>
              </div>
            </div>
          </>
        )}
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
      <MobileNavFooter
        component={"home"}
        cartLength={cartLength}
        updateCartLength={updateCartLength}
      />
    </>
  );
};

export default ProductMobile;
