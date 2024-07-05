import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="ml-[10rem]">
      <h1 className="text-lg font-bold ml-[3rem] mt-[3rem]">
        Produk Favorit
      </h1>

      <div className="flex flex-wrap">
        {favorites.map((product) => (
          <div key={product._id} className="w-1/3">
            <Product product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;