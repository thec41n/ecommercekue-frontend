import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Produk Favorit</h1>

      <div className="flex flex-wrap justify-center">
        {favorites.length === 0 ? (
          <p className="text-center">Tidak ada produk favorit.</p>
        ) : (
          favorites.map((product) => (
            <div key={product._id} className="w-full sm:w-1/2 md:w-1/3">
              <Product product={product} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;