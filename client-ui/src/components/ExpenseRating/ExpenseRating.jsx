import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";
import { std, mean } from "mathjs";
//import { Rating } from "react-simple-star-rating"
import { Rating } from "@mui/material";

export default function ExpenseRating({ product }) {
  const [searched, setSearched] = useState([]);
  const inputEl = useRef(null);
  const [open, setOpen] = useState(false);
  const [isFetched, setIsFetched] = useState(true);
  const [productState, setProductState] = useState([]);
  let products = [];
  let url = "https://api.nal.usda.gov/fdc/v1/foods/search";
  let access_token = "bdJjin59zDuhXSARWy1Gu6M642AeZa2J9VIdqwib";
  let result = [];
  let output = [];

  // finding 25 similar products
  async function searchAPI(query, sortOrder = "asc") {
    let params =
      url +
      `?query=${query
        ?.replace(" ", "%20")
        .replace(",", "%2C")
        .replace("/", "%2F")
        .replace("&", "%26")
        .replace('"', "%22")}&sortOrder=${sortOrder}`;
    params +=
      "&dataType=Branded&pageSize=20&pageNumber=2&sortBy=description.keyword&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB&dataType=Branded";

    const response = await axios
      .get(params, {
        headers: {
          Authorization: `api_key=${access_token}`,
        },
      })
      .catch((err) => console.log(err));
    setSearched(response.data.foods);
    setIsFetched(false);
    response.data.foods.map((element) => {
      getData(element.fdcId);
    });
    setIsFetched(true);
  }

  // finding data for 25 most similar products
  async function getData(productId) {
    let response = await axios
      .get(
        `https://api.nal.usda.gov/fdc/v1/food/${productId}?&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB&pageSize=20`,
        {
          headers: {
            Authorization: `api_key=${access_token}`,
          },
        }
      )
      .catch((err) => console.log(err));
    if (response) {
      const picked = (({
        fat,
        protein,
        transFat,
        saturatedFat,
        calories,
        sugars,
        fiber,
      }) => ({
        fat,
        protein,
        transFat,
        saturatedFat,
        calories,
        sugars,
        fiber,
      }))(response.data.labelNutrients);
      var array = Object.keys(picked).map(function (key) {
        return picked[key]?.value;
      });
      setProductState((prevState) => [...prevState, array]);
    }
  }

  // for similarity
  function makeRating() {
    if (productState.length == 20) {
      // the actual product
      const picked = (({
        fat,
        protein,
        transFat,
        saturatedFat,
        calories,
        sugars,
        fiber,
      }) => ({
        fat,
        protein,
        transFat,
        saturatedFat,
        calories,
        sugars,
        fiber,
      }))(product.labelNutrients);
      var array = Object.keys(picked).map(function (key) {
        return picked[key]?.value;
      });

      // similar products
      result = productState.map((element) =>
        element.map((v) => (v === undefined ? 0 : v))
      );
      output = result[0].map((_, colIndex) =>
        result.map((row) => row[colIndex])
      );
      //let mean = element => element.reduce((a, b) => a + b) / element.length
      let dev_away = [];
      let val = output.forEach((element, idx) => {
        const average = element.reduce((a, b) => a + b) / element.length;
        const std_ = std(element);

        dev_away.push((array[idx] - average) / std_);
      });
    }
  }

  return <p>Here</p>;
}
