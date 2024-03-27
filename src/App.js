import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Homepage/Home";
import Login from "./pages/Login/Login";
import Product from "./pages/ProductDetails/ProductDetails/Product";
import Cart from "./pages/Cart/cartHome/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderSuccess from "./pages/OrderMessage/OrderSuccess";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/:productname/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/:orderfrom" element={<Checkout />} />
          <Route path="/ordersuccess" element={<OrderSuccess />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
