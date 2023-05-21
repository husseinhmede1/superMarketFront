import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/loginPage/loginPage";
import RegisterPage from "./pages/registerPage/registerPage";
import DashboardAdminPage from "./pages/adminPages/dashboardAdminPage";
import DashboardUserPage from "./pages/userPages/dashboardUserPage";
import ProductAdminPage from "./pages/adminPages/productAdminPage";
import AdminAddProduct from "./pages/adminPages/adminAddProduct";
import AdminEditProduct from "./pages/adminPages/adminEditProduct";
import ViewUsersPage from "./pages/adminPages/viewUsers";
import ViewOrdersPage from "./pages/adminPages/viewOrders";
import ProductUserPage from "./pages/userPages/productUserPage";
import YourProductUserPage from "./pages/userPages/yourProductUserPage";
import ViewMessagesPage from "./pages/adminPages/viewMessages";

function App() {
  return (
    <Router>
      <Routes>
      <Route exact path="/" element={<LoginPage />} />
      <Route exact path="/register" element={<RegisterPage />} />
      <Route exact path="/dashboardAdmin" element={<DashboardAdminPage />} />
      <Route exact path="/dashboardUser" element={<DashboardUserPage />} />
      <Route exact path="/productAdmin/:typeName" element={<ProductAdminPage />} />
      <Route exact path="/productUser/:typeName" element={<ProductUserPage />} />
      <Route exact path="/yourProduct" element={< YourProductUserPage />} />
      <Route exact path="/adminAddProduct/:typeName" element={<AdminAddProduct />} />
      <Route exact path="/adminEditProduct/:typeName/:productId/:productTitle" element={<AdminEditProduct />} />
      <Route exact path="/viewUsers" element={<ViewUsersPage />} />
      <Route exact path="/viewOrders" element={<ViewOrdersPage />} />
      <Route exact path="/viewMessages" element={<ViewMessagesPage />} />
      <Route path="/404" element={<div>page not found</div>}/>
      </Routes>
    </Router>
  );
}

export default App;
