export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100);
};

export const updateCart = (state) => {
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  state.shippingPrice = Math.round(state.itemsPrice > 100000 ? 0 : 2000);

  state.taxPrice = Math.round(Number((0.11 * state.itemsPrice)));

  state.totalPrice = Math.round(
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  );

  // Save the cart to localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};