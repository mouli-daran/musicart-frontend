import styles from "./Login.module.css";
import musicIcon from "../../assets/musicIcon.svg";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../apis/user";
import axios from "axios";

const Login = () => {
  const redirect = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const validateForm = (email, password) => {
    let errors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email";
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      errors.password =
        "Password should contain at least one uppercase, one lowercase, one number, and one special character";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    const validate = validateForm(user.email, user.password);
    if (validate) {
      try {
        const response = await axios.post(
          `http://localhost:4000/api/v1/login`,
          user
        );

        const result = response.data;
        console.log("result from login  is ---", result);

        if (result) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("username", result?.user?.name);
          toast.success(result.message);
          setTimeout(() => {
            redirect("/");
          }, 2000);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Internal server error");
      }
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.titleDesktop}>
          <img src={musicIcon} alt="musicIcon" />
          <span>Musicart</span>
        </div>
        <div className={styles.titleMobile}>
          <Header />
        </div>
        <span>Welcome</span>
        <div className={styles.form}>
          <h1>Sign in</h1>
          <div>
            <span>Enter your email or mobile number</span>
            <input
              type="text"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            {errors.email && (
              <span style={{ color: "red", fontSize: "0.8em" }}>
                * {errors.email}
              </span>
            )}
          </div>
          <div>
            <span>Password</span>
            <input
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            {errors.password && (
              <span style={{ color: "red", fontSize: "0.8em" }}>
                * {errors.password}
              </span>
            )}
          </div>
          <button onClick={handleSumbit}>Continue</button>
          <span>
            By continuing, you agree to Musicart privacy notice and conditions
            of use.
          </span>
        </div>
        <div className={styles.newToMusic}>
          <div></div>
          <span>New to Musicart?</span>
          <div></div>
        </div>
        <button
          className={styles.button}
          onClick={() => {
            redirect("/signup");
          }}
        >
          Create your Musicart account
        </button>
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
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

export default Login;
