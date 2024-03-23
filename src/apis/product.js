import axios from "axios";
const backendURL = process.env.REACT_APP_BACKEND_URL;

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
    const requrl = `${backendURL}/addToCart`;
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
