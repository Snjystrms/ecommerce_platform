import React, { useState, useEffect } from "react";
// import { FaPlus } from "react-icons/fa";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";
import { strapiApi } from "../../../../api/strapi";

const Category = () => {
  const [showSubCatOne, setShowSubCatOne] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    strapiApi.getCategories().then(res => {
      setCategories(res.data.data || []);
    });
  }, []);
  return (
    <div className="w-full">
      <NavTitle title="Shop by Category" icons={false} />
      <div>
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between"
            >
              {cat.name}
              {/* Add subcategory logic if needed */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
