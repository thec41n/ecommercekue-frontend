import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();

  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
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

      {/* Second Part */}
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
                Submit
              </button>
            </form>
          ) : (
            <p>
              Silahkan <Link to="/login">log in</Link> untuk menulis ulasan.
            </p>
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
            {data.map((product) => (
              <SmallProduct key={product._id} product={product} parentPage="ProductDetail" />
            ))}
          </section>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;