import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductUpdate = () => {
  const params = useParams();

  const { data: productData } = useGetProductByIdQuery(params._id);
  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category?._id || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);

  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price.toLocaleString("id-ID")); // Format price
      setCategory(productData.category);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setStock(productData.countInStock || 0);
      setImage(productData.image);
    }
  }, [productData]);

  const formatNumber = (number) => {
    return number.toLocaleString("id-ID");
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters
    const formattedValue = formatNumber(Number(rawValue));
    setPrice(formattedValue);
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !image ||
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !brand ||
      !stock
    ) {
      toast.error("Produk gagal ditambahkan, coba lagi!.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price.replace(/\./g, ""));
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      // Update product using the RTK Query mutation
      const data = await updateProduct({ productId: params._id, formData });

      if (data.error) {
        toast.error("Produk gagal ditambahkan, coba lagi!");
      } else {
        toast.success(`${name} berhasil diupdate!`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      toast.error("Produk gagal diupdate, coba lagi!");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm("Apakah kamu yakin ingin menghapus?");
      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      console.log("Delete response data:", data);
      toast.success(`${name} berhasil dihapus`);
      navigate("/admin/allproductslist");
    } catch (error) {
      console.log(error);
      toast.error("Gagal menghapus, coba lagi");
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12 font-bold">Tambahkan Produk</div>

          {image && (
            <div className="text-center">
              <img
                src={image}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="border border-black text-black px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {image ? image.name : "Upload Gambar"}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className={!image ? "hidden" : "text-black"}
              />
            </label>
          </div>

          <div className="p-3">
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name">Nama Produk</label> <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] border rounded-lg text-black"
                  placeholder="co: Kue Bolu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="two ml-10 ">
                <label htmlFor="name block">Harga</label> <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] border rounded-lg text-black"
                  placeholder="co: 15.000"
                  value={price}
                  onChange={handlePriceChange}
                />
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name block">Kuantitas</label> <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[30rem] border rounded-lg text-black"
                  placeholder="co: 10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="two ml-10 ">
                <label htmlFor="name block">Merk</label> <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] border rounded-lg text-black"
                  placeholder="co: Sangkuriang"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="" className="my-5">
              Deskripsi
            </label>
            <textarea
              type="text"
              className="p-2 mb-3 border rounded-lg w-[95%] text-black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="flex justify-between">
              <div>
                <label htmlFor="name block">Jumlah Stok Barang</label> <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] border rounded-lg text-black"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="category">Kategori</label> <br />
                <select
                  id="category"
                  placeholder="Choose Category"
                  className="p-4 mb-3 w-[30rem] border rounded-lg text-black"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Pilih Kategori</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className="py-4 px-10 mt-5 rounded-lg text-lg text-white font-bold bg-green-600 hover:bg-green-700 mr-6"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="py-4 px-10 mt-5 rounded-lg text-lg text-white font-bold bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
