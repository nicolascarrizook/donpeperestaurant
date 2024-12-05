import React, { useContext } from "react";

/// React router dom
import { Outlet, Route, Routes } from "react-router-dom";

/// Css
import "./chart.css";
import "./index.css";
import "./step.css";

/// Layout
import Footer from "./layouts/Footer";
import Nav from "./layouts/nav";
//import Main from './layouts/Main';

import ScrollToTop from "./layouts/ScrollToTop";
/// Dashboard
import Bill from "./components/Dashboard/Bill";
import DashboardDark from "./components/Dashboard/DashboardDark";
import FavoriteMenu from "./components/Dashboard/FavoriteMenu";
import Home from "./components/Dashboard/Home";
import Message from "./components/Dashboard/Message";
import Notification from "./components/Dashboard/Notification";
import OrderHistory from "./components/Dashboard/OrderHistory";
import HomeSetting from "./components/Dashboard/Setting";

//Restaurant
import CustomerReviews from "./components/Dashboard/Restaurant/CustomerReviews";
import Menu from "./components/Dashboard/Restaurant/Menu";
import Orders from "./components/Dashboard/Restaurant/Orders";
import Restaurant from "./components/Dashboard/Restaurant/Restaurant";
import Withdrow from "./components/Dashboard/Restaurant/Withdrow";

//Drivers
import DeliverMain from "./components/Dashboard/Drivers/DeliverMain";
import DeliverOrder from "./components/Dashboard/Drivers/DeliverOrder";
import Feedback from "./components/Dashboard/Drivers/Feedback";

/////Demo
import Theme1 from "./components/Dashboard/Demo/Theme1";
import Theme2 from "./components/Dashboard/Demo/Theme2";
import Theme3 from "./components/Dashboard/Demo/Theme3";
import Theme4 from "./components/Dashboard/Demo/Theme4";
import Theme5 from "./components/Dashboard/Demo/Theme5";
import Theme6 from "./components/Dashboard/Demo/Theme6";
import Theme7 from "./components/Dashboard/Demo/Theme7";

/// App

/// Product List
import Checkout from "./components/Checkout/Checkout";

/// Charts

/// Bootstrap

/// Plugins

// Widget

/// Table

/// Form

/// Pages

import { ThemeContext } from "../context/ThemeContext";
import FoodOrder from "./components/Dashboard/FoodOrder";
import Error400 from "./pages/Error400";
import Error403 from "./pages/Error403";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Error503 from "./pages/Error503";
import LockScreen from "./pages/LockScreen";

const Markup = () => {
  const allroutes = [
    /// Dashboard
    { url: "", component: <Home /> },
    { url: "dashboard", component: <Home /> },
    { url: "dashboard-dark", component: <DashboardDark /> },
    { url: "food-order", component: <FoodOrder /> },
    { url: "favorite-menu", component: <FavoriteMenu /> },
    { url: "message", component: <Message /> },
    { url: "order-history", component: <OrderHistory /> },
    { url: "notification", component: <Notification /> },
    { url: "bill", component: <Bill /> },
    { url: "setting", component: <HomeSetting /> },
    { url: "checkout", component: <Checkout /> },

    // Restaurant
    { url: "restaurant", component: <Restaurant /> },
    { url: "withdrow", component: <Withdrow /> },
    { url: "menu", component: <Menu /> },
    { url: "orders", component: <Orders /> },
    { url: "customer-reviews", component: <CustomerReviews /> },

    //Drivers
    { url: "deliver-main", component: <DeliverMain /> },
    { url: "deliver-order", component: <DeliverOrder /> },
    { url: "feedback", component: <Feedback /> },

    /////Demo
    { url: "container-wide", component: <Theme1 /> },
    { url: "horizontal-sidebar", component: <Theme2 /> },
    { url: "nav-header", component: <Theme3 /> },
    { url: "secondary-sidebar", component: <Theme4 /> },
    { url: "mini-sidebar", component: <Theme5 /> },
    { url: "sidebar-theme", component: <Theme6 /> },
    { url: "header-theme", component: <Theme7 /> },
  ];

  return (
    <>
      <Routes>
        <Route path="page-lock-screen" element={<LockScreen />} />
        <Route path="page-error-400" element={<Error400 />} />
        <Route path="page-error-403" element={<Error403 />} />
        <Route path="page-error-404" element={<Error404 />} />
        <Route path="page-error-500" element={<Error500 />} />
        <Route path="page-error-503" element={<Error503 />} />
        <Route element={<MainLayout />}>
          {allroutes.map((data, i) => (
            <Route
              key={i}
              exact
              path={`${data.url}`}
              element={data.component}
            />
          ))}
        </Route>
      </Routes>
      <ScrollToTop />
    </>
  );
};

function MainLayout() {
  const { menuToggle } = useContext(ThemeContext);
  return (
    <div
      id="main-wrapper"
      className={`show ${menuToggle ? "menu-toggle" : ""}`}
    >
      <Nav />
      <div
        className="content-body"
        style={{ minHeight: window.screen.height - 45 }}
      >
        <div className="container">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Markup;
