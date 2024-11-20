import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useId } from "react"; // Tambahkan import ini

export default function Navbar({ onSearchChange }) {
  const inputId = useId();
  const { isLoggedIn, login, logout } = useUser();

  const handleSearchInput = (e) => {
    onSearchChange(e.target.value);
  };

  return (
    <nav className="grid grid-cols-3 justify-between px-24 py-4 bg-[#8091FF] items-center">
      <ul>
        <li>
          <Link to="/" className="text-white">
            Home
          </Link>
        </li>
      </ul>
      <ul className="flex justify-center items-center">
        <li className="w-full">
          <input type="text" className="text-black px-4 py-2 w-full" id={inputId} placeholder="Search product..." onChange={handleSearchInput} />
        </li>
      </ul>
      {!isLoggedIn ? (
        <ul className="flex gap-2 justify-end">
          <li>
            <button onClick={login} className="text-[#F2F4FF]">
              Sign in
            </button>
          </li>
          <li>
            <Link to="/signup" className="text-[#F2F4FF]">
              Sign up
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="flex gap-2 justify-end">
          <li>
            <Link to="/cart" className="text-[#F2F4FF]">
              Cart
            </Link>
          </li>
          <li>
            <Link to="/orders" className="text-[#F2F4FF]">
              My Orders
            </Link>
          </li>
          <li>
            <button onClick={logout} className="text-[#F2F4FF]">
              Sign out
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}
