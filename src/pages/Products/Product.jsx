import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import "./Product.css";

const Product = ({ product }) => {
  const formattedPrice = product.price.toLocaleString('id-ID');

  return (
    <div className="product p-3">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
        />
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

export default Product;