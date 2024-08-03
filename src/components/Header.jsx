import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      <ProductCarousel />

      <div className="mt-8 flex justify-around flex-wrap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((product) => (
            <SmallProduct
              key={product._id}
              product={product}
              parentPage="Home"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
