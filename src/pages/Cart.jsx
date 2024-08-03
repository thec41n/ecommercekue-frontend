import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (item, qty) => {
    dispatch(addToCart({ ...item, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  return (
    <>
      <div className="container flex flex-col mx-auto mt-8 px-4 md:px-0">
        {cartItems.length === 0 ? (
          <div className=" flex mx-auto mt-8 px-4 md:px-0">
            Keranjangmu kosong,<Link to="/shop" className="ml-1">ayo belanja!</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-4">Keranjang</h1>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row items-center mb-4"
              >
                <div className="w-full md:w-1/4 mb-2 md:mb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-auto object-cover rounded"
                  />
                </div>

                <div className="flex-1 ml-4">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-lg font-semibold"
                  >
                    {item.name}
                  </Link>
                  <div className="text-gray-500 text-sm">{item.brand}</div>
                  <div className="text-lg font-bold">
                    Rp {item.price.toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    className="p-1 border rounded text-black"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeFromCartHandler(item._id)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4 p-4 border-t border-gray-300">
              <h2 className="text-lg font-semibold">
                Jumlah Barang (
                {cartItems.reduce((acc, item) => acc + Number(item.qty), 0)})
              </h2>
              <div className="text-2xl font-bold">
                Rp{" "}
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toLocaleString("id-ID")}
              </div>

              <button
                onClick={checkoutHandler}
                className="mt-4 bg-orange-600 hover:bg-orange-700 py-2 px-4 text-white rounded-full w-full"
                disabled={cartItems.length === 0}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;