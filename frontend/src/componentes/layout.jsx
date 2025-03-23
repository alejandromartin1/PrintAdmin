import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../componentes/sidebar";
import Navbar from "../componentes/navbar";

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
