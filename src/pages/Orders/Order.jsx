import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const handlePayment = () => {
    if (order && !order.isPaid && order.paymentResult && order.paymentResult.token) {
      window.snap.pay(order.paymentResult.token, {
        onSuccess: async (result) => {
          try {
            await payOrder({ orderId, details: result });
            refetch();
            toast.success("Pesanan sudah dibayar");
          } catch (error) {
            console.error("Payment error:", error);
            toast.error(error?.data?.message || error.message);
          }
        },
        onPending: function(result) {
          console.log("Payment pending:", result);
        },
        onError: function(result) {
          console.log("Payment error:", result);
          toast.error("Pembayaran gagal");
        },
        onClose: function() {
          console.log("Customer closed the popup without finishing the payment");
        }
      });
    }
  };

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
  
    return new Date(date).toLocaleString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  }

  useEffect(() => {
    if (order && order.isPaid) {
      refetch();
    }
  }, [order?.isPaid, refetch]);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Message>Pesanan Kosong</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead>
                  <tr>
                    <th className="p-2">Gambar</th>
                    <th className="p-2">Produk</th>
                    <th className="p-2 text-center">Kuantitas</th>
                    <th className="p-2">Harga</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 pl-20">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>

                      <td className="p-2 pl-20">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>

                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">Rp {item.price.toLocaleString("id-ID")}</td>
                      <td className="p-2 text-center">
                        Rp {(item.qty * item.price).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Pengiriman</h2>
          <p className="mb-4 mt-4">
            <strong className="text-black-500">Pesanan:</strong> {order._id}
          </p>

          <p className="mb-4">
            <strong className="text-black-500">Nama:</strong>{" "}
            {order.user.username}
          </p>

          <p className="mb-4">
            <strong className="text-black-500">Email:</strong>{" "}
            {order.user.email}
          </p>

          <p className="mb-4">
            <strong className="text-black-500">Alamat:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.province}
          </p>

          <p className="mb-4">
            <strong className="text-black-500">Metode Pembayaran:</strong>{" "}
            {order.paymentMethod}
          </p>

          {order.isPaid ? (
            <Message variant="success">Dibayarkan pada {formatDate(order.paidAt)}</Message>
          ) : (
            <Message variant="danger">Belum dibayar</Message>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Rincian Pembelian</h2>
        <div className="flex justify-between mb-2">
          <span>Barang</span>
          <span>Rp {order.itemsPrice.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Ongkos Kirim</span>
          <span>Rp {order.shippingPrice.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>Rp {order.taxPrice.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>Rp {order.totalPrice.toLocaleString("id-ID")}</span>
        </div>

        {!order.isPaid && (
          <div>
            <button
              type="button"
              className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
              onClick={handlePayment}
            >
              Checkout
            </button>
          </div>
        )}

        {loadingDeliver && <Loader />}
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <div>
            <button
              type="button"
              className="bg-orange-600 hover:bg-orange-700 text-white w-full py-2"
              onClick={deliverHandler}
            >
              Tandai Sudah Diantar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;