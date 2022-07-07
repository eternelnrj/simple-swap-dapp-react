import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
        <li>
            <Link to="/"> Home </Link>
          </li>
          <li>
            <Link to="/main_page"> Main Page </Link>
          </li>
          <li>
            <Link to="/second_page"> Second Page </Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;