import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useGetTopProductsQuery,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import SmallProduct from "./SmallProduct";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState(1);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { data: topProducts, isLoading: isLoadingTopProducts } = useGetTopProductsQuery();

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review berhasil dibuat!");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const formatDate = (date) => {
    if (!date) return "Tidak tersedia";
    return new Date(date).toLocaleString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <>
      <div className="text-center sm:text-left mb-4">
        <Link to="/" className="text-black font-semibold hover:underline ml-4 md:ml-[2.5rem]">
          Kembali
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : (
        <div className="mx-4 md:mx-10 mt-4">
          <div className="flex flex-col md:flex-row items-start justify-between mb-8">
            <div className="w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto"
              />
              <HeartIcon product={product} />
            </div>

            <div className="flex flex-col w-full md:w-1/2 lg:w-2/3 mt-4 md:mt-0 px-4 md:px-10">
              <h2 className="text-2xl font-semibold text-center md:text-left">{product.name}</h2>
              <p className="my-2 text-justify">{product.description}</p>
              <p className="text-3xl font-bold mb-4">Rp {product.price.toLocaleString("id-ID")}</p>

              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h1 className="flex items-center mb-2">
                    <FaStore className="mr-2" /> Merk: {product.brand}
                  </h1>
                  <h1 className="flex items-center mb-2">
                    <FaClock className="mr-2" /> Ditambahkan pada: {formatDate(product.createdAt)}
                  </h1>
                  <h1 className="flex items-center">
                    <FaStar className="mr-2" /> Ulasan: {product.numReviews}
                  </h1>
                </div>
                <div>
                  <h1 className="flex items-center mb-2">
                    <FaStar className="mr-2" /> Rating: {Math.round(product.rating)}
                  </h1>
                  <h1 className="flex items-center">
                    <FaShoppingCart className="mr-2" /> Kuantitas: {product.quantity}
                  </h1>
                  <h1 className="flex items-center">
                    <FaBox className="mr-2" /> Jumlah Stok: {product.countInStock}
                  </h1>
                </div>
              </div>

              <Ratings value={product.rating} text={`${product.numReviews} ulasan`} />

              {product.countInStock > 0 && (
                <select
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="form-select p-2 w-full md:w-auto rounded-lg text-black mt-2"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 w-full md:w-auto"
              >
                Tambah Ke Keranjang
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-start mt-8">
            <section className="w-full md:w-1/4">
              <div
                className={`p-4 cursor-pointer text-lg ${
                  activeTab === 1 ? "font-bold" : ""
                }`}
                onClick={() => handleTabClick(1)}
              >
                Tambahkan Ulasan
              </div>
              <div
                className={`p-4 cursor-pointer text-lg ${
                  activeTab === 2 ? "font-bold" : ""
                }`}
                onClick={() => handleTabClick(2)}
              >
                Semua Ulasan
              </div>
              <div
                className={`p-4 cursor-pointer text-lg ${
                  activeTab === 3 ? "font-bold" : ""
                }`}
                onClick={() => handleTabClick(3)}
              >
                Produk Serupa
              </div>
            </section>

            <section className="w-full md:w-3/4 p-4">
              {activeTab === 1 && (
                userInfo ? (
                  <form onSubmit={submitHandler}>
                    <label htmlFor="rating" className="block text-xl mb-2">
                      Rating
                    </label>
                    <select
                      id="rating"
                      required
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="p-2 border rounded-lg w-full"
                    >
                      <option value="">Pilih Rating</option>
                      <option value="1">Kurang Baik</option>
                      <option value="2">Cukup Baik</option>
                      <option value="3">Baik</option>
                      <option value="4">Sangat Baik</option>
                      <option value="5">Sempurna</option>
                    </select>

                    <label htmlFor="comment" className="block text-xl mb-2 mt-4">
                      Komentar
                    </label>
                    <textarea
                      id="comment"
                      rows="3"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="p-2 border rounded-lg w-full"
                    ></textarea>
                    <button
                      type="submit"
                      disabled={loadingProductReview}
                      className="mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg w-full"
                    >
                      Kirim Ulasan
                    </button>
                  </form>
                ) : (
                  <Message variant="info">
                    Silahkan <Link to="/login">log in</Link> untuk menulis ulasan.
                  </Message>
                )
              )}

              {activeTab === 2 && (
                <section>
                  {product.reviews.length === 0 ? (
                    <p>Tidak ada ulasan.</p>
                  ) : (
                    product.reviews.map((review) => (
                      <div
                        key={review._id}
                        className="bg-[#ffd4d4] p-4 rounded-lg mb-5"
                      >
                        <div className="flex justify-between">
                          <strong>{review.name}</strong>
                          <p>{review.createdAt.substring(0, 10)}</p>
                        </div>
                        <p className="my-4">{review.comment}</p>
                        <Ratings value={review.rating} />
                      </div>
                    ))
                  )}
                </section>
              )}

              {activeTab === 3 && (
                <section className="flex flex-wrap">
                  {isLoadingTopProducts ? (
                    <Loader />
                  ) : (
                    topProducts.map((product) => (
                      <SmallProduct key={product._id} product={product} parentPage="ProductDetail" />
                    ))
                  )}
                </section>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;