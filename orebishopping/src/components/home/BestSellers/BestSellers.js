import React, { useEffect, useState } from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import { strapiApi } from "../../../api/strapi";

const backendUrl = "http://localhost:1337";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    strapiApi.getProducts().then(res => {
      setProducts(res.data.data || []);
    });
  }, []);
  return (
    <div className="w-full pb-20">
      <Heading heading="Our Bestsellers" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {products.map((item) => {
          console.log("[BestSellers] Product item:", item);
          const imgUrl = item.images?.[0]?.formats?.medium?.url
            ? backendUrl + item.images[0].formats.medium.url
            : (item.images?.[0]?.url ? backendUrl + item.images[0].url : "");
          const description = item.description?.[0]?.children?.[0]?.text || "";
          return (
            <Product
              key={item.id}
              _id={item.id}
              img={imgUrl}
              productName={item.name || ''}
              price={item.price || ''}
              color={item.color || ''}
              badge={item.badge || false}
              des={description}
              documentId={item.documentId}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BestSellers;
