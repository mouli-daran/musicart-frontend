import axios from "axios";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getProduct = async (filterQuery) => {
  try {
    const requrl = `http://localhost:4000/api/v1/product`;
    const queryParameters = {
      ...filterQuery,
    };
    const response = await axios.get(requrl, {
      params: queryParameters,
    });

    return response.data;
  } catch (error) {
    if (error) {
      return error.response.data;
    }
  }
};

export const addToCart = async (products) => {
  try {
    const requrl = `${backendUrl}/cart`;
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.put(requrl, { products }, config);
    console.log("add to cart response form api frontend is ---", response);
    return response.data;
  } catch (error) {
    if (error) {
      return error.response.data;
    }
  }
};

export const getProductDetails = async (id) => {
  try {
    const requrl = `${backendUrl}/product/${id}`;
    const response = await axios.get(requrl);
    return response.data;
  } catch (error) {
    if (error) {
      return error.response.data;
    }
  }
};

export const getCartProduct = async () => {
  try {
    const requrl = `${backendUrl}/cartproducts`;
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(requrl, config);
    return response.data;
  } catch (error) {
    if (error) {
      return error.response.data;
    }
  }
};
