import React from "react";
import Header from "../../Components/Header";
import Products from "../../Components/Products";
import Footer from "../../Components/Footer";
import SEO from "../../Components/SEO";

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SEO for Dashboard */}
      <SEO
        title="ShopEase - Home"
        description="Discover the best deals and premium products at ShopEase. Fresh deals every day!"
        url="https://www.shopease.com/"
        image="https://www.shopease.com/home-og.png"
      />

      <Header />
      <main className="flex-grow bg-gray-50">
        <Products />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
