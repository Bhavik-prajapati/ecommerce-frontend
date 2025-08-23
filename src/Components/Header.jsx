import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { items } = useSelector((state) => state.cart);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left: Logo + Mobile Menu */}
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500">
            ShopEase
          </Link>
        </div>

        {/* Right: User + Cart */}
        <div className="flex items-center space-x-6">
          <Link
            to="/profile"
            className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition"
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Account</span>
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center text-gray-700 hover:text-orange-500 transition"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="ml-1 hidden sm:inline font-medium">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-3">
          <Link to="/" className="block text-gray-700 hover:text-orange-500 font-medium">
            Fresh
          </Link>
          <Link to="/" className="block text-gray-700 hover:text-orange-500 font-medium">
            Today’s Deals
          </Link>
          <Link to="/myorders" className="block text-gray-700 hover:text-orange-500 font-medium">
            My Orders
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
