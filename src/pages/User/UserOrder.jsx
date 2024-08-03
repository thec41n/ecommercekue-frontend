import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Pesanan Saya</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <div className="w-full overflow-x-auto">
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="py-2">GAMBAR</th>
                  <th className="py-2">ID</th>
                  <th className="py-2">TANGGAL</th>
                  <th className="py-2">TOTAL</th>
                  <th className="py-2">STATUS TRANSAKSI</th>
                  <th className="py-2">STATUS ANTAR</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="py-2">
                      <img
                        src={order.orderItems[0].image}
                        alt={order.user}
                        className="w-20 h-20 object-cover"
                      />
                    </td>
                    <td className="py-2">{order._id}</td>
                    <td className="py-2">
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-2">
                      Rp {order.totalPrice.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2">
                      <p
                        className={`p-1 text-center rounded-full w-24 ${
                          order.isPaid ? "bg-green-400" : "bg-red-400"
                        }`}
                      >
                        {order.isPaid ? "Berhasil" : "Pending"}
                      </p>
                    </td>
                    <td className="py-2">
                      <p
                        className={`p-1 text-center rounded-full w-24 ${
                          order.isDelivered ? "bg-green-400" : "bg-red-400"
                        }`}
                      >
                        {order.isDelivered ? "Berhasil" : "Pending"}
                      </p>
                    </td>
                    <td className="py-2">
                      <Link to={`/order/${order._id}`}>
                        <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded">
                          Lihat Detail
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view */}
          <div className="md:hidden">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-4 rounded-lg shadow mb-4"
              >
                <div className="flex items-center space-x-4 mb-3">
                  <img
                    src={order.orderItems[0].image}
                    alt={order.user}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Order ID: {order._id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tanggal:{" "}
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
                <p>Total: Rp {order.totalPrice.toLocaleString("id-ID")}</p>
                <div className="flex justify-between mt-3">
                  <p
                    className={`p-1 text-center text-white rounded-full w-36 ${
                      order.isPaid ? "bg-green-400" : "bg-red-400"
                    }`}
                  >
                    {order.isPaid ? "Sudah Dibayar" : "Belum Dibayar"}
                  </p>
                  <p
                    className={`p-1 text-center text-white rounded-full w-36 ${
                      order.isDelivered ? "bg-green-400" : "bg-red-400"
                    }`}
                  >
                    {order.isDelivered ? "Sudah Diantar" : "Belum Diantar"}
                  </p>
                </div>
                <Link to={`/order/${order._id}`}>
                  <button className="mt-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded w-full">
                    Lihat Detail
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
