import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import { strapiApi } from "../../../api/strapi";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

const backendUrl = "http://localhost:1337";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    strapiApi.getProducts().then(res => {
      setProducts(res.data.data || []);
    });
  }, []);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };
  return (
    <div className="w-full pb-16">
      <Heading heading="New Arrivals" />
      <Slider {...settings}>
        {products.map((item) => {
          console.log("[NewArrivals] Product item:", item);
          const imgUrl = item.images?.[0]?.formats?.medium?.url
            ? backendUrl + item.images[0].formats.medium.url
            : (item.images?.[0]?.url ? backendUrl + item.images[0].url : "");
          const description = item.description?.[0]?.children?.[0]?.text || "";
          return (
            <div className="px-2" key={item.id}>
              <Product
                _id={item.id}
                img={imgUrl}
                productName={item.name || ''}
                price={item.price || ''}
                color={item.color || ''}
                badge={item.badge || false}
                des={description}
                documentId={item.documentId}
              />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default NewArrivals;
