import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const [paymentMethod, setPaymentMethod] = useState("Midtrans");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [province, setProvince] = useState(shippingAddress.province || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, province }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto -mt-3 px-4">
      <div className="hidden md:block">
        <ProgressSteps step1 step2 />
      </div>
      <div className="mt-4 flex flex-col items-center overflow-hidden">
        <form
          onSubmit={submitHandler}
          className="w-full md:w-[40rem] px-4 md:px-0"
        >
          <h1 className="text-2xl font-semibold mb-4">Form Pengiriman</h1>
          <div className="mb-4">
            <label className="block text-black mb-2">Alamat</label>
            <input
              type="text"
              className="w-full p-3 border rounded"
              placeholder="Masukkan alamat"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2">Kota</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Masukkan kota"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2">Kode Pos</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Masukkan kode pos"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2">Provinsi</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Masukkan provinsi"
              value={province}
              required
              onChange={(e) => setProvince(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Metode Pembayaran</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-orange-600"
                  name="paymentMethod"
                  value="Midtrans"
                  checked={paymentMethod === "Midtrans"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <span className="ml-2">Midtrans</span>
              </label>
            </div>
          </div>

          <button
            className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-5 rounded-full text-lg w-full mt-4"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
