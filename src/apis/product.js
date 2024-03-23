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

export const addToCart = async (id, quantity, replaceQuantity) => {
  try {
    const requrl = `${backendUrl}/addToCart`;
    const storedToken = localStorage.getItem("musicArtToken");
    const config = {
      headers: {
        token: storedToken,
      },
    };
    let payLoad = { id, quantity, replaceQuantity: false };
    if (replaceQuantity) {
      payLoad = { id, quantity, replaceQuantity: true };
    }
    const response = await axios.put(requrl, payLoad, config);
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
    const storedToken = localStorage.getItem("musicArtToken");
    const config = {
      headers: {
        token: storedToken,
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
