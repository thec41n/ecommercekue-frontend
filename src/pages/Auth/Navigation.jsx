import { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineShop,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import logo from "../../img/logo.png";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.addEventListener("click", closeDropdown);

    return () => {
      window.removeEventListener("click", closeDropdown);
    };
  });

  const dropdownClickHandler = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="top-nav" id="navigation-container">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center nav-left">
          <img src={logo} alt="Logo" className="w-12 h-12" />
          <span className="ml-2 text-xl font-bold">KUE YANTI</span>
        </div>
        <div className="nav-links hidden md:flex">
          <Link to="/" className="nav-link">
            <AiOutlineHome size={26} />
            <span>HOME</span>
          </Link>
          <Link to="/about" className="nav-link">
            <IoIosInformationCircleOutline size={26} />
            <span>ABOUT US</span>
          </Link>
          <Link to="/shop" className="nav-link">
            <AiOutlineShopping size={26} />
            <span>SHOP</span>
          </Link>
          <Link to="/cart" className="nav-link relative">
            <AiOutlineShoppingCart size={26} />
            <span>KERANJANG</span>
            {cartItems.length > 0 && (
              <span className="cart-count">
                {cartItems.reduce((a, c) => a + Number(c.qty), 0)}
              </span>
            )}
          </Link>
          <Link to="/favorite" className="nav-link relative">
            <FaHeart size={20} />
            <span>FAVORITES</span>
            <FavoritesCount />
          </Link>
        </div>
        <div className="nav-auth-links hidden md:flex">
          {!userInfo && (
            <>
              <Link to="/login" className="nav-link">
                <AiOutlineLogin size={26} />
                <span>LOGIN</span>
              </Link>
              <Link to="/register" className="nav-link">
                <AiOutlineUserAdd size={26} />
                <span>REGISTER</span>
              </Link>
            </>
          )}
          {userInfo && (
            <div className="relative" onClick={dropdownClickHandler}>
              <button
                onClick={toggleDropdown}
                className="flex items-center text-white focus:outline-none"
              >
                <span>{userInfo.username}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1 ${
                    dropdownOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      dropdownOpen
                        ? "M5 15l7-7 7 7"
                        : "M19 9l-7 7-7-7"
                    }
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <ul
                  className={`dropdown-menu ${
                    !userInfo.isAdmin
                      ? "-top-0.1"
                      : "-top-0.1"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {userInfo.isAdmin && (
                    <>
                      <li>
                        <Link to="/admin/dashboard" className="flex w-full hover:bg-gray-100">Dashboard</Link>
                      </li>
                      <li>
                        <Link to="/admin/productlist" className="flex w-full hover:bg-gray-100">
                          Tambah Jajanan
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/allproductslist" className="flex w-full hover:bg-gray-100">
                          Daftar Jajanan
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/categorylist" className="flex w-full hover:bg-gray-100">
                          Kategori Makanan
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/orderlist" className="flex w-full hover:bg-gray-100">Pesanan</Link>
                      </li>
                      <li>
                        <Link to="/admin/userlist" className="flex w-full hover:bg-gray-100">Users</Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link to="/profile" className="flex w-full hover:bg-gray-100">Profile</Link>
                  </li>
                  <li>
                    <Link onClick={logoutHandler} className="flex w-full hover:bg-gray-100">Logout</Link>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
        <button className="md:hidden" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden flex flex-col mt-2 space-y-2 nav-links">
          <Link to="/" className="nav-link">
            <AiOutlineHome size={26} />
            <span>HOME</span>
          </Link>
          <Link to="/about" className="nav-link">
            <IoIosInformationCircleOutline size={26} />
            <span>ABOUT US</span>
          </Link>
          <Link to="/shop" className="nav-link">
            <AiOutlineShopping size={26} />
            <span>SHOP</span>
          </Link>
          <Link to="/cart" className="nav-link relative">
            <AiOutlineShoppingCart size={26} />
            <span>KERANJANG</span>
            {cartItems.length > 0 && (
              <span className="cart-count">
                {cartItems.reduce((a, c) => a + Number(c.qty), 0)}
              </span>
            )}
          </Link>
          <Link to="/favorite" className="nav-link relative">
            <FaHeart size={20} />
            <span>FAVORITES</span>
            <FavoritesCount />
          </Link>
          {!userInfo && (
            <>
              <Link to="/login" className="nav-link">
                <AiOutlineLogin size={26} />
                <span>LOGIN</span>
              </Link>
              <Link to="/register" className="nav-link">
                <AiOutlineUserAdd size={26} />
                <span>REGISTER</span>
              </Link>
            </>
          )}
          {userInfo && (
            <div className="relative" onClick={dropdownClickHandler}>
              <button
                onClick={toggleDropdown}
                className="flex items-center text-white focus:outline-none"
              >
                <span>{userInfo.username}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1 ${
                    dropdownOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      dropdownOpen
                        ? "M5 15l7-7 7 7"
                        : "M19 9l-7 7-7-7"
                    }
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <ul
                  className={`dropdown-menu ${
                    !userInfo.isAdmin
                      ? "-top-20"
                      : "-top-80 -mt-11"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {userInfo.isAdmin && (
                    <>
                      <li>
                        <Link to="/admin/dashboard" className="flex w-full hover:bg-gray-100">Dashboard</Link>
                      </li>
                      <li>
                        <Link to="/admin/productlist" className="flex w-full hover:bg-gray-100">
                          Tambah Jajanan
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/allproductslist" className="flex w-full hover:bg-gray-100">
                          Daftar Jajanan
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/categorylist" className="flex w-full hover:bg-gray-100">
                          Kategori Makanan
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/orderlist" className="flex w-full hover:bg-gray-100">Pesanan</Link>
                      </li>
                      <li>
                        <Link to="/admin/userlist" className="flex w-full hover:bg-gray-100">Users</Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link to="/profile" className="flex w-full hover:bg-gray-100">Profile</Link>
                  </li>
                  <li>
                    <Link onClick={logoutHandler} className="flex w-full hover:bg-gray-100">Logout</Link>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navigation;