import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product, parentPage }) => {
  const formattedPrice = product.price.toLocaleString("id-ID");

  const containerStyle =
    parentPage === "Home"
      ? "w-full p-3 small-product"
      : "p-3 md:w-1/3 lg:w-1/4";
  const imageStyle = "h-auto rounded";

  return (
    <div className={containerStyle}>
      <div className="relative">
        <img src={product.image} alt={product.name} className={imageStyle} />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div>{product.name}</div>
            <span className="bg-red-300 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300">
              Rp {formattedPrice}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
