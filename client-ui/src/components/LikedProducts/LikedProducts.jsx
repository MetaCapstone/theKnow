import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./LikedProducts.css";
import ProductCard from "../ProductCard/ProductCard";
import React from "react";
import ReactLoading from "react-loading";

export default function LikedProducts({ user, setIsFetching, isFetching }) {
  const [isFetched, setIsFetched] = useState(false);
  const [data, setData] = useState([]);
  const [product, setProductState] = useState([]);

  async function viewProducts() {
    const res = await axios.get(
      `http://localhost:3001/products/${user.user.objectId}`
    );
    setData(res.data.posts);
    res.data.posts.forEach((element) => {
      getData(element);
    });
  }
  useEffect(() => {
    viewProducts();
    setProductState([]);
  }, []);

  let access_token = "bdJjin59zDuhXSARWy1Gu6M642AeZa2J9VIdqwib";
  async function getData(token) {
    setIsFetched(true);
    let response = await axios
      .get(
        `https://api.nal.usda.gov/fdc/v1/food/${token}?&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB&pageSize=20`,
        {
          headers: {
            Authorization: `api_key=${access_token}`,
          },
        }
      )
      .catch((err) => console.logs(err));
    if (response) {
      setProductState((prevState) => [...prevState, response.data]);
    }
    setIsFetched(false);
  }

  if (isFetched) {
    return (
      <>
        <h1>Loading</h1>
        <ReactLoading type={"bars"} color={"Black"} />
      </>
    );
  } else {
    return (
      <>
        <div className="title">
          <h1>LIKED PRODUCTS</h1>
        </div>
        <div className="products">
          {product.map((element, idx) => {
            return (
              <ProductCard
                user={user}
                key={idx}
                product={element}
                setProducts={setData}
                likedProducts={data}
              ></ProductCard>
            );
          })}
        </div>
      </>
    );
  }
}
