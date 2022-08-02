import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import Loading from "../Loading/Loading"
import {std, mean} from "mathjs"
//import { Rating } from "react-simple-star-rating"
import { Rating } from '@mui/material';

export default function ExpenseRating({product}) {
    const[searched, setSearched] = useState([])
    const inputEl = useRef(null);
    const [open, setOpen] = useState(false)
    const [isFetched, setIsFetched] = useState(true)
    const [productState, setProductState] = useState([])
    let products = []
    let url = "https://api.nal.usda.gov/fdc/v1/foods/search"
    let access_token = "bdJjin59zDuhXSARWy1Gu6M642AeZa2J9VIdqwib" //"oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB"
    let result = []
    let output = []


    // finding 25 similar products
    async function searchAPI(query, sortOrder="asc") {
        let params = url + `?query=${query?.replace(" ", "%20").replace(",", "%2C").replace("/", "%2F").replace("&", "%26").replace('"', "%22")}&sortOrder=${sortOrder}`
        params += "&dataType=Branded&pageSize=20&pageNumber=2&sortBy=description.keyword&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB&dataType=Branded"
        //params += "&nutrients=1003&nutrients=1004&nutrients=1005&nutrients=2000"
        //setIsFetched(true)
        const response = await axios.get(params, {
            headers: {
                'Authorization': `api_key=${access_token}`,
            }
            }).catch((err) => console.log(err))
        //setIsFetched(false)
        setSearched(response.data.foods)
        setIsFetched(false)
        response.data.foods.map((element) => {
            getData(element.fdcId)
        })
        setIsFetched(true)
     }

    // finding data for 25 most similar products
    async function getData(productId) {
        let response = await axios.get(`https://api.nal.usda.gov/fdc/v1/food/${productId}?&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB&pageSize=20`,
        { headers: {
          'Authorization': `api_key=${access_token}`,
        }
        }).catch((err) => console.log(err))
        if (response) {
            const picked = (({ fat, protein, transFat, saturatedFat, calories, sugars, fiber }) => ({ fat, protein, transFat, saturatedFat, calories, sugars, fiber }))(response.data.labelNutrients);
            var array = Object.keys(picked)
            .map(function(key) {
                return picked[key]?.value;
            });
            setProductState((prevState) => [...prevState, array])
        }
    }

    // for recommendation system
    // useEffect(() => {
    //     setProductState([])
    //     console.log("FOOD CATEGORY", product)
    //     searchAPI('foodCategory:' + product.brandedFoodCategory)


    // }, [])

    // for similarity
    function makeRating() {
        if (productState.length == 20) {

            // the actual product
            const picked = (({ fat, protein, transFat, saturatedFat, calories, sugars, fiber }) => ({ fat, protein, transFat, saturatedFat, calories, sugars, fiber }))(product.labelNutrients);
            var array = Object.keys(picked)
            .map(function(key) {
                return picked[key]?.value;
            });

            // similar products
            result = productState.map((element) => element.map(v => v === undefined ? 0 : v));
            output = result[0].map((_, colIndex) => result.map(row => row[colIndex]))
            //let mean = element => element.reduce((a, b) => a + b) / element.length
            let dev_away = []
            let val = output.forEach(
                (element, idx) => {
                    const average = (element.reduce((a, b) => a + b) / element.length);
                    const std_ = std(element)
                    // let dev_away = element.map((el) => {
                    //     return (el - average)/std_
                    // })

                    dev_away.push((array[idx] - average)/std_)
            })

        }
    }

        //     const transpose = val[0].map((_, colIndex) => val.map(row => row[colIndex]))
        //     console.log("TRANSPOSED", transpose)

        //     // now that I have std away from mean, I need to figure out which one is better, assign a rating for each, avg it out, and return score
        //     let totalratings = transpose.map((element) => {
        //         let ratings = element.map((el, idx) => {
        //             let rating = 0;
        //             if (el < -2) {
        //                 rating = 1
        //             }
        //             if (-2 <= el && el < -1) {
        //                 rating = 2
        //             } else if (-1 <= el && el < 1) {
        //                 rating = 3
        //             } else if (el > 1 && el < 2) {
        //                 rating = 4
        //             } else {
        //                 rating = 5
        //             }

        //             if (better[idx] == "-") {
        //                 rating = 5 - rating
        //             }
        //         return rating
        //         })
        //         return ratings
        //     })

        //     console.log("RATINGS", totalratings)

        //     // with ratings across each nutrient, average them out to get rating per product
        //     let finalRating = totalratings.map((element) => {
        //         const avgRating = element.reduce((a, b) => a + b) / (element.length - 2);
        //         return avgRating
        //     })
        //     console.log("AVG RATING", finalRating)
        // }
    //}

    // if (isFetched) {
    //     return <Loading/>
    // } else {

    // , result = productState.map((e,i) => (productState[i] == undefined) ? e : e + productState[i]),
    // console.log("RESULT", result),
    // output = result[0]?.map((_, colIndex) => result.map(row => row[colIndex])),
    // console.log("OUTPUT" , output)
    return (
        // <div>
        // <p>Health:</p>
        // <Rating value={makeRatingProduct()} readOnly/>
        // </div>
        <p>Here</p>
    )
}
