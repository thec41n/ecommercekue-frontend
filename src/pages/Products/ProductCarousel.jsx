import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768, // Target devices smaller than 768px
        settings: {
          arrows: false, // Disable arrows on small devices
          dots: true, // Enable dots for navigation
        }
      }
    ]
  };

  return (
    <div className="mb-4">
      <style>{`
        .slick-prev:before, .slick-next:before {
          color: black;
        }
      `}</style>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="w-full md:w-[60rem] mx-auto">
          {products.map((product) => {
            const {
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            } = product;
            const formattedPrice = price.toLocaleString('id-ID');
            return (
              <div key={_id} className="p-4">
                <img
                  src={image}
                  alt={name}
                  className="w-full rounded-lg object-cover h-[20rem] md:h-[30rem]"
                />
                <div className="mt-4 flex flex-col md:flex-row justify-between">
                  <div className="flex-1 md:mr-4">
                    <h2>{name}</h2>
                    <p>Rp {formattedPrice}</p>
                    <p className="hidden md:block">{description.substring(0, 170)}...</p>
                  </div>
                  <div className="flex-1 mt-4 md:mt-0">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex-1">
                        <h1 className="flex items-center mb-2">
                          <FaStore className="mr-2 text-black" /> Merk: {brand}
                        </h1>
                        <h1 className="flex items-center mb-2">
                          <FaClock className="mr-2 text-black" /> Ditambahkan: <br />
                          {formatDate(createdAt)}
                        </h1>
                        <h1 className="flex items-center mb-2">
                          <FaStar className="mr-2 text-black" /> Ulasan: {numReviews}
                        </h1>
                      </div>
                      <div className="flex-1 mt-4 md:mt-0">
                        <h1 className="flex items-center mb-2">
                          <FaStar className="mr-2 text-black" /> Rating: {Math.round(rating)}
                        </h1>
                        <h1 className="flex items-center mb-2">
                          <FaShoppingCart className="mr-2 text-black" /> Kuantitas: {quantity}
                        </h1>
                        <h1 className="flex items-center mb-2">
                          <FaBox className="mr-2 text-black" /> Stok Barang: {countInStock}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;