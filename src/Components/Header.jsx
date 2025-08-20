import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";

const Header = () => {
  // We only read from the store, no dispatching here.
  const { items } = useSelector((state) => state.cart);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">
          Shop
        </Link>

        {/* Menus */}
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <Link to="/dashboard" className="hover:text-indigo-600">Fresh</Link>
          <Link to="/dashboard" className="hover:text-indigo-600">Today's Deal</Link>
          <Link to="/dashboard" className="hover:text-indigo-600">Bestsellers</Link>
        </nav>

        {/* User + Cart */}
        <div className="flex items-center space-x-6">
          <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
            <User className="w-5 h-5" />
            <span>User</span>
          </Link>

          <Link to="/cart" className="relative flex items-center text-gray-700 hover:text-indigo-600">
            <ShoppingCart className="w-5 h-5" />
            <span className="ml-1">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;