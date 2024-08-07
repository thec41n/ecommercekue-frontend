import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="hidden md:block">
        <ProgressSteps step1 step2 />
      </div>

      <div className="container mx-auto mt-8">
        {cart.cartItems.length === 0 ? (
          <Message>Keranjangmu Kosong</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <td className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Gambar</td>
                  <td className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Produk</td>
                  <td className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Kuantitas</td>
                  <td className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Harga</td>
                  <td className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</td>
                </tr>
              </thead>

              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover object-center"
                      />
                    </td>

                    <td className="p-2">
                      <Link to={`/product/Rp{item.product}`}>{item.name}</Link>
                    </td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">
                      Rp {item.price.toLocaleString("id-ID")}
                    </td>
                    <td className="p-2">
                      Rp {(item.qty * item.price).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 px-4 py-2">
          <h2 className="text-2xl font-semibold mb-5">Rincian Pembelian</h2>
          <div className="flex justify-between rounded-xl flex-wrap p-8 bg-[#faa4a2]">
            <ul className="text-sm">
              <li>
                <span className="font-semibold mb-4">Barang:</span> Rp{" "}
                {cart.itemsPrice.toLocaleString("id-ID")}
              </li>
              <li>
                <span className="font-semibold mb-4">Ongkos Kirim:</span> Rp{" "}
                {cart.shippingPrice.toLocaleString("id-ID")}
              </li>
              <li>
                <span className="font-semibold mb-4">Pajak:</span> Rp{" "}
                {(cart.taxPrice).toLocaleString("id-ID")}
              </li>
              <li>
                <span className="font-semibold mb-4">Total:</span> Rp{" "}
                {(cart.totalPrice).toLocaleString("id-ID")}
              </li>
            </ul>

            {error && <Message variant="danger">{error.data.message}</Message>}

            <div>
              <h2 className="mt-5 text-xl font-semibold mb-3">Pengiriman</h2>
              <p className="text-sm">
                <strong>Alamat:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.province}
              </p>
            </div>

            <div>
              <h2 className="mt-5 text-xl font-semibold mb-3">Metode Pembayaran</h2>
              <strong className="text-sm">Method:</strong> {cart.paymentMethod}
            </div>
          </div>

          <button
            type="button"
            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
            disabled={cart.cartItems === 0}
            onClick={placeOrderHandler}
          >
            Buat Pesanan
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;