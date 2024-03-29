import React, { useState, useRef } from "react";
import ProductCard from "../ProductCard/ProductCard.jsx";
import "./ProductGrid.css";
import axios from "axios";
import Search from "../Search/Search.jsx";
import { useEffect } from "react";
import LikedProducts from "../LikedProducts/LikedProducts.jsx";
import UserRecommendations from "../UserRecommendations/UserRecommendations.jsx";
import Recommendations from "../Recommendations/Recommendations.jsx";

export default function ProductGrid(props) {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [recommendShow, setRecommendShow] = useState(false);
  const [recommendMLShow, setRecommendMLShow] = useState(false);

  async function viewProducts() {
    if (props.user.user) {
      const res = await axios.get(
        `http://localhost:3001/products/${props.user.user.objectId}`
      );
      setData(res.data.posts);
    }
  }

  useEffect(() => {
    viewProducts();
  }, []);

  function showOrNot() {
    if (show) {
      return (
        <LikedProducts
          setIsFetching={props.setIsFetching}
          isFetching={props.isFetching}
          user={props.user}
        />
      );
    } else {
      return <></>;
    }
  }

  function showOrNotRecommend() {
    if (recommendShow) {
      return <UserRecommendations likedProducts={data} user={props.user} />;
    } else {
      return <></>;
    }
  }

  function showOrNotRecommendML() {
    if (recommendMLShow) {
      return (
        <Recommendations
          user={props.user}
          setProducts={setData}
          likedProducts={data}
        />
      );
    } else {
      return <></>;
    }
  }
  return (
    <>
      <Search
        likedProducts={data}
        user={props.user}
        products={props.products}
        setIsFetching={props.setIsFetching}
        isFetching={props.isFetching}
      />
      <p>
        {props.user.user
          ? ""
          : "Want access to these buttons? Log in or make an account!"}
      </p>
      <button
        disabled={`${props.user.user ? "" : "true"}`}
        className="buttons"
        onClick={() => {
          setShow(!show);
        }}
      >
        Liked Products
      </button>
      <button
        disabled={`${props.user.user ? "" : "true"}`}
        className="buttons"
        onClick={() => {
          setRecommendShow(!recommendShow);
        }}
      >
        Recommendations other Users Liked
      </button>
      <button
        disabled={`${props.user.user ? "" : "true"}`}
        className="buttons"
        onClick={() => {
          setRecommendMLShow(!recommendMLShow);
        }}
      >
        {" "}
        Recommendations{" "}
      </button>
      {showOrNot()}
      {showOrNotRecommend()}
      {showOrNotRecommendML()}

      <div className="product-grid">
        {props.products.map((product, idx) => {
          return (
            <ProductCard
              user={props.user}
              key={idx}
              product={product}
              setProducts={setData}
              likedProducts={data}
            ></ProductCard>
          );
        })}
      </div>
    </>
  );
}
