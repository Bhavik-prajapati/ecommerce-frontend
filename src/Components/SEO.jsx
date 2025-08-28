import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "ShopEase - Premium Shopping Online",
  description = "ShopEase: Your one-stop destination for premium shopping. Fresh deals every day ✨",
  url = "https://shop-ecom-ease.netlify.app",
  image = "https://www.shopease.com/og-image.png"
}) => {
  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="ShopEase, online shopping, e-commerce, deals, premium products, shop online" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
