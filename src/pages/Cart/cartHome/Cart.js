import CartDesktop from "../Desktop/CartDesktop";
import CartMobile from "../Mobile/CartMobile";

import React from "react";

const Cart = () => {
  return (
    <div>
      <CartDesktop />
      <CartMobile />
    </div>
  );
};

export default Cart;
