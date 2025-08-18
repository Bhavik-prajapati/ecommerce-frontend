import { useDispatch, useSelector } from "react-redux";
import "./common.css";
import { useEffect } from "react";
import { fetchCart } from "../store/cartSlice";
import { Link } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    // fetch only if items are empty
    if (items.length === 0) {
      dispatch(fetchCart());
    }
  }, [dispatch, items.length]); // <-- depend on length only

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header>
      <div className="logo">
       <Link to="/dashboard"><h1>Shop</h1></Link>
      </div>

      <ul className="navlinks">
        <li><Link to="/dashboard">Fresh</Link></li>
        <li><Link to="/dashboard">Today's Deal</Link></li>
        <li><Link to="/dashboard">Bestsellers</Link> </li>
      </ul>

      <ul className="user-links">
        <li><a href="#">User</a></li>
        <li>
          <Link to="/cart">Cart - {totalItems}</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
