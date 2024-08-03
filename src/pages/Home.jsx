import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="mt-8 overflow-hidden">
            <div className="flex justify-center items-center mx-4">
              <h1 className="text-2xl md:text-3xl mr-12">Special Products</h1>
              <Link
                to="/shop"
                className="bg-orange-600 text-white hover:bg-orange-700 font-bold rounded-full py-2 px-4 md:py-2 md:px-10"
              >
                Shop
              </Link>
            </div>

            <div>
              <div className="flex justify-center flex-wrap mt-[2rem] special-products">
                {data.products.map((product) => (
                  <div key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;