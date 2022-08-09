import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../ProductCard/ProductCard";
import { fineStructureDependencies } from "mathjs";
import HealthRating from "../HealthRating/HealthRating";

export default function Recommendations({ user, setProducts, likedProducts }) {
  const [recs, setRecs] = useState([]);
  const [searched, setSearched] = useState([]);
  const [productState, setProductState] = useState([]);
  let arr1d = [];

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const res = await axios.get(
        `http://localhost:3001/reccomendations/MLBased/${user.user.objectId}`
      );
      setRecs(res.data.posts);
      setSearched([]);
      res.data.posts.forEach((element) => {
        element.splice(0, 1);
        element.forEach((el) => {
          searchAPI("foodCategory:" + el);
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  let url = "https://api.nal.usda.gov/fdc/v1/foods/search";
  let access_token = "bdJjin59zDuhXSARWy1Gu6M642AeZa2J9VIdqwib";
  async function searchAPI(query, sortOrder = "asc") {
    let params =
      url +
      `?query=${query
        ?.replace(" ", "%20")
        .replace(",", "%2C")
        .replace("/", "%20")
        .replace("&", "%26")
        .replace('"', "%22")
        .replace("!", "%21")}&sortOrder=${sortOrder}`;
    params +=
      "&dataType=Branded&pageSize=2&pageNumber=2&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB&dataType=Branded";

    const response = await axios
      .get(params, {
        headers: {
          Authorization: `api_key=${access_token}`,
        },
      })
      .catch((err) => console.log(err));

    setSearched((prevState) => [...prevState, response.data.foods]);
  }

  return (
    <>
      <p>
        Recommendations will appear here. Please do not click the button again!
      </p>
      {[]
        .concat(...searched)
        .slice(0, 15)
        .map((element, idx) => {
          return (
            <ProductCard
              user={user}
              key={idx}
              product={element}
              setProducts={setProducts}
              likedProducts={likedProducts}
            ></ProductCard>
          );
        })}
    </>
  );
}
