import styles from "./Signup.module.css";
import musicIcon from "../../assets/musicIcon.svg";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
// import { register, login } from "../../apis/user";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // console.log("user from frontend----", user);

  const validateForm = () => {
    const { name, mobile, email, password } = user;
    const errors = {};

    if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(name) || name === "") {
      errors.name = "Invalid Name";
    }

    if (!/^(?!0)[0-9]{10}$/.test(mobile) || mobile === "") {
      errors.mobile = "Enter Valid mobile number";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter valid email";
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

    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      try {
        const response = await axios.post(`${backendUrl}/register`, user);
        const result = response.data;

        console.log("response from frontend----", result);

        if (result) {
          toast.success("Registered Successfully");
          localStorage.setItem("token", result.token); // Corrected from result.jwtToken
          setTimeout(() => {
            navigate("/");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
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
          <h1>Create Account</h1>
          <div>
            <span>Your name</span>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
            />
            {errors.name && (
              <span style={{ color: "red", fontSize: "0.8em" }}>
                *{errors.name}
              </span>
            )}
          </div>
          <div>
            <span>Mobile number</span>
            <input
              type="text"
              name="mobile"
              value={user.mobile}
              onChange={handleChange}
            />
            {errors.mobile && (
              <span style={{ color: "red", fontSize: "0.8em" }}>
                *{errors.mobile}
              </span>
            )}
          </div>
          <div>
            <span>Email id</span>
            <input
              type="text"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span style={{ color: "red", fontSize: "0.8em" }}>
                *{errors.email}
              </span>
            )}
          </div>
          <div>
            <span>Password</span>
            <input
              type="text"
              name="password"
              value={user.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span style={{ color: "red", fontSize: "0.8em" }}>
                *{errors.password}
              </span>
            )}
          </div>
          <span>
            By enrolling your mobile phone number, you consent to receive
            automated security notifications via text message from Musicart.
            Message and data rates may apply.
          </span>
          <button onClick={handleSubmit}>Continue</button>
          <span>
            By continuing, you agree to Musicart privacy notice and conditions
            of use.
          </span>
        </div>
        <aside className={styles.bottomPart}>
          <span>Already have an account?</span>
          <Link to="/login">Sign In</Link>
        </aside>
      </div>
      <Footer />
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

export default Signup;
