import axios from "axios";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const register = async (name, mobile, email, password) => {
  try {
    const reqUrl = `http://localhost:4000/api/v1/register`;
    const reqPayload = {
      name: name,
      mobile: mobile,
      email: email,
      password: password,
    };
    const response = await axios.post(reqUrl, reqPayload);
    console.log("resister response ----", response);
    return response.data;
  } catch (error) {
    if (error) {
      return error.response.data;
    }
  }
};

export const login = async (name, mobile, email, password) => {
  try {
    const reqUrl = `${backendUrl}/login`;
    const reqPayload = {
      email: email,
      password: password,
    };
    const response = await axios.post(reqUrl, reqPayload);
    console.log("resister response ----", response);
    return response.data;
  } catch (error) {
    if (error) {
      return error.response.data;
    }
  }
};
