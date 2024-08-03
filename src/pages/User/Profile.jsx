import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import "../App.css";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password tidak sesuai!");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile berhasil diupdate!");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 mt-10 max-h-screen overflow-y-auto">
      <div className="flex flex-col md:flex-row items-start justify-center md:space-x-4">
        <div className="w-full md:w-1/2 lg:w-1/3 p-2">
          <h2 className="text-2xl font-semibold mb-4">Update Profil</h2>
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-black mb-1">Nama</label>
              <input
                type="text"
                placeholder="Masukkan username"
                className="form-input mt-1 p-2 border rounded w-full"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-black mb-1">Alamat Email</label>
              <input
                type="email"
                placeholder="Masukkan email"
                className="form-input mt-1 p-2 border rounded w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <label className="block text-black mb-1">Kata Sandi</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi"
                className="form-input mt-1 p-2 border rounded w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 top-7 right-0 px-3 flex items-center text-sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>

            <div className="relative">
              <label className="block text-black mb-1">
                Konfirmasi Kata Sandi
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi kata sandi"
                className="form-input mt-1 p-2 border rounded w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 top-7 right-0 px-3 flex items-center text-sm"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>

            <div className="flex justify-between space-x-4">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded"
              >
                Perbarui
              </button>
              <Link
                to="/user-orders"
                className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded"
              >
                Pesanan Saya
              </Link>
            </div>
          </form>
          {loadingUpdateProfile && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
