import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "../pages/Products/ProductCard"; // Import ProductCard component

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            // Check if the product price includes the entered price filter value
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter.replace(/\./g, ""), 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const formatNumber = (number) => {
    return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatNumber(value);
    setPriceFilter(formattedValue);
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="flex md:flex-row">
          <div className="bg-[#faa4a2] p-3 mt-2 mb-2 rounded">
            <h2 className="h4 text-center py-2 bg-white rounded-full mb-2">
              Filter berdasarkan Kategori
            </h2>

            <div className="p-5 w-[15rem]">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <label className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={`checkbox-${c._id}`}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span
                      htmlFor={`checkbox-${c._id}`}
                      className="ml-2 text-sm font-medium text-black dark:text-gray-300 cursor-pointer"
                    >
                      {c.name}
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-white rounded-full mb-2">
              Filter berdasarkan Merk
            </h2>

            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <div key={brand} className="flex items-center mr-4 mb-5">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      id={`radio-${brand}`}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span
                      htmlFor={`radio-${brand}`}
                      className="ml-2 text-sm font-medium text-black dark:text-gray-300 cursor-pointer"
                    >
                      {brand}
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-white rounded-full mb-2">
              Filter berdasarkan Harga
            </h2>

            <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Masukkan Harga"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-orange-300"
              />
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full my-4 bg-orange-600 hover:bg-orange-700 text-white rounded-full"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="p-3">
            <h2 className="h4 text-center mb-2 font-bold">{products?.length} Produk</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => <ProductCard key={p._id} p={p} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
