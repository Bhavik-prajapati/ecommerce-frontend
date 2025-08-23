import React from "react";
import Header from "../../Components/Header";
import Products from "../../Components/Products";
import Footer from "../../Components/Footer";

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        <Products />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
