import React, { useEffect, useState } from "react";
import { strapiApi } from "../../../api/strapi";

const ProductsOnSale = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    strapiApi.getProducts().then(res => {
      setProducts(res.data.data || []);
    });
  }, []);
  return (
    <div>
      <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
        Products on sale
      </h3>
      <div className="flex flex-col gap-2">
        {products.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border-b-[1px] border-b-gray-300 py-2"
          >
            <div>
              <img className="w-24" src={item.attributes?.image?.url || ''} alt={item.attributes?.title || ''} />
            </div>
            <div className="flex flex-col gap-2 font-titleFont">
              <p className="text-base font-medium">{item.attributes?.title}</p>
              <p className="text-sm font-semibold">${item.attributes?.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsOnSale;
