import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";
import { strapiApi } from "../../api/strapi";

const backendUrl = "http://localhost:1337";

const ProductDetails = () => {
  const { documentId } = useParams();
  console.log('[ProductDetails] useParams documentId:', documentId);
  const [productInfo, setProductInfo] = useState(null);
  const [prevLocation, setPrevLocation] = useState("");

  useEffect(() => {
    console.log('[ProductDetails] Fetching product by documentId:', documentId);
    strapiApi.getProductByDocumentId(documentId).then(res => {
      console.log('[ProductDetails] API response:', res.data);
      setProductInfo(res.data.data[0]);
    });
    setPrevLocation(window.location.pathname);
  }, [documentId]);

  if (!productInfo) return <div>Loading...</div>;

  // Get image and description from API structure
  const imgUrl = productInfo.images?.[0]?.formats?.medium?.url
    ? backendUrl + productInfo.images[0].formats.medium.url
    : (productInfo.images?.[0]?.url ? backendUrl + productInfo.images[0].url : "");
  const description = productInfo.description?.[0]?.children?.[0]?.text || "";

  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          <div className="h-full">
            {/* <ProductsOnSale /> */}
          </div>
          <div className="h-full xl:col-span-2">
            <img
              className="w-full h-full object-cover"
              src={imgUrl}
              alt={productInfo.name}
            />
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-14 flex flex-col gap-6 justify-center">
            <ProductInfo productInfo={{
              id: productInfo.id,
              name: productInfo.name,
              price: productInfo.price,
              description,
              image: imgUrl,
              color: productInfo.color,
              badge: productInfo.badge,
              stock: productInfo.stock,
              category: productInfo.category,
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
