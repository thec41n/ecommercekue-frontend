import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <div className="relative">
      {favoriteCount > 0 && (
        <span className="favorites-count">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;