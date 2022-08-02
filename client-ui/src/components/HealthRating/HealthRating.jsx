import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import Loading from "../Loading/Loading"
import {std, mean, cos} from "mathjs"
//import { Rating } from "react-simple-star-rating"
import { Rating } from '@mui/material';

export default function HealthRating({user, product, getRatingExists, addRating}) {
    const[ratings, setRating] = useState(0)
    const inputEl = useRef(null);
    const [open, setOpen] = useState(false)
    const [isFetched, setIsFetched] = useState(true)
    const [productState, setProductState] = useState([])
    const [userInfo, setUserInfo] = useState([])
    let products = []
    let url = "https://api.nal.usda.gov/fdc/v1/foods/search"
    let access_token = "bdJjin59zDuhXSARWy1Gu6M642AeZa2J9VIdqwib" //"oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB"
    let result = []
    let output = []
    let columns = ["fat","protein", "transFat", "saturatedFat", "calories", "sugar", "fiber"]
    let better = ["+", "+", "-1", "-1", "-0", "-0", "+"]
    let weight = [1 , 1, .25, .25, .5, 1, 1]
    let total_weight = 5

    // access key for image API: OJ1_O3gxEMgtAVf2L-KeKlKbXNVBdQrHe8zWKQvvsYc
    // secret key: yu9ybl9AkXdGFkrYK8ZWtgJWPQ4LpAgMa90PBtAUKL8

    /*
        Extra feature - people make a list of products to eat in a day (assuming serving size) and give rankings/recommendations?
        ask if man or woman? Get information about the user and store to make recommendations? (extra stretch)
        Nutrition Information:

        Fat - 44 to 77g per day (healthy fats)
        Protein - 50-175 g per day
        trans Fat - < 2 grams a day
        saturated fat - 22g of fat per day
        calories - < 2000 per day
        sugars - 25-36 grams per day
        fiber - 21 - 38 g per day
    */



    async function getProfileData(userId) {
        console.log("HERE IN PROF DATA")
        let resp = await axios.get(`http://localhost:3001/userProfile/${userId}`)
        console.log("RESP!", resp.data.posts)
        setUserInfo(resp.data.posts)
    }

    let dietary_information = {
        "fat": [44, 77],
        "protein": [50, 175],
        "transFat": [0, 2],
        "saturatedFat": [0, 22],
        "calories": [1000, 2000],
        "sugar": [25, 36],
        "fiber": [21, 38]
    }

    useEffect(() => {
        if (!user.user) {
            makeRatingProduct()
        } else {
            getProfileData(user.user.objectId)
            makeSpecializedRatingProduct()
        }
    }, [user])



    async function makeSpecializedRatingProduct() {
        if (Object.keys(product).length > 0) {
            let protein = product?.foodNutrients.find(o => o.nutrient.name === 'Protein')?.amount;
            protein = (protein === 'undefined') ? 0 : protein;
            let carbohydrate = product?.foodNutrients.find(o => o.nutrient.name === "Carbohydrate, by difference")?.amount;
            carbohydrate = (carbohydrate === 'undefined') ? 0 : carbohydrate;
            let transFat = product?.foodNutrients.find(o => o.nutrient.name === "Fatty acids, total trans")?.amount;
            transFat = (transFat === 'undefined') ? 0 : transFat;
            let sugar = product?.foodNutrients.find(o => o.nutrient.name === "Sugars, total including NLEA")?.amount;
            sugar = (sugar === 'undefined') ? 0 : sugar;
            let fat = product?.foodNutrients.find(o => o.nutrient.name === "Total lipid (fat)")?.amount;
            fat = (fat === 'undefined') ? 0 : fat;
            let saturatedFat = product?.foodNutrients.find(o => o.nutrient.name === "Fatty acids, total saturated")?.amount;
            saturatedFat = (saturatedFat === 'undefined') ? 0 : saturatedFat;
            let calories = product?.foodNutrients.find(o => o.nutrient.name === "Energy")?.amount;
            calories = (calories === 'undefined') ? 0 : calories;
            let fiber = product?.foodNutrients.find(o => o.nutrient.name === "Fiber, total dietary")?.amount;
            fiber = (fiber === 'undefined') ? 0 : fiber;

            let nutrients = [fat, protein, transFat, saturatedFat, calories, sugar, fiber]

            let calories_user = 0
            if (parseInt(userInfo.height) < 4) {
                if (parseInt(userInfo.weight) <= 165) {
                    calories_user = 1600
                }
                else {
                    calories_user = 1800
                }
            } else {
                if (parseInt(userInfo.weight) <= 200) {
                    calories_user = 1800
                }
                else {
                    calories_user = 2000
                }
            }
            if (userInfo.gender == "M") {
                calories_user += 300
            }

            /*
                Fat - 30% or less of total calories from fat
                    1,500 calories: about 50 grams of fat per day
                    2,000 calories: about 67 grams of fat per day
                    2,500 calories: about 83 grams of fat per day
                Protein - 0.36 grams of protein per pound
                    10-35% of calories should be protein

                Saturated Fat - 5 to 6% of calories
                    2000 calories, 120 should be saturated fat (13 grams)
                Sugars -
                    women: 25 grams
                    men: 36 grams
                Fiber -
                    women - 21 to 25 grams
                    men - 30 to 38

                Calories -
                    women -
                        3-4 feet and < 165 pounds - 1600
                        3-4 feet and > 165 pounds - 1800
                        5-6 feet and < 200 pounds - 1800
                        5-6 feet and > 200 pounds - 2000
                    men - women + 300
            */

            let dietary_information_user = {
                "fat": (calories_user * .03),
                "protein": (0.36 * parseInt(userInfo.weight)),
                "transFat": 2,
                "saturatedFat": (calories_user * 0.05),
                "calories": calories_user,
                "sugar": [25, 36],
                "fiber": [25, 38]
            }

            let rating_avg = 0;
            let rating = 0;
            nutrients.map((element, idx) => {
                console.log("NUTRIENT: ", columns[idx], " Dietary info: ", dietary_information_user[columns[idx]])
                if (better[idx] === "+") {
                    let high_val = 0 //deciding which upper bound to use
                    if (userInfo.gender == "M") {
                        high_val = 1
                    }
                    let percentage = 0
                    if (Array.isArray(dietary_information[columns[idx]])) {
                        percentage = (element / dietary_information[columns[idx]][high_val]) * 100
                    } else {
                        percentage = (element / dietary_information[columns[idx]]) * 100
                    }
                    if (percentage < 10) {
                        rating = 1
                    } else if (percentage >= 10 && percentage < 20) {
                        rating = 2
                    } else if (percentage >= 20 && percentage < 30) {
                        rating = 3
                    } else if (percentage >= 30 && percentage < 40) {
                        rating = 4
                    } else {
                        rating = 5
                    }
                // if bad for you
                // if greater than daily: rating = 1
                // if 60% or higher : rating = 2
                // if 40% - 60% : rating = 3
                // if 20%-40% : rating = 4
                // if less : rating = 5
                } else if (better[idx] === "-1" || better[idx] === "-0") {
                    let high_val = 0 //deciding which upper bound to use
                    if (userInfo.gender == "M") {
                        high_val = 1
                    }
                    let percentage = 0
                    if (Array.isArray(dietary_information[columns[idx]])) {
                        percentage = (element / dietary_information[columns[idx]][high_val]) * 100
                    } else {
                        percentage = (element / dietary_information[columns[idx]]) * 100
                    }
                    console.log("PERCENT", percentage)
                        if (element > dietary_information[columns[idx]] || percentage > 75) {
                            rating = 1
                        }
                        else if (percentage > 60) {
                            rating = 2
                        } else if (percentage > 40 && percentage <= 60) {
                            rating = 3
                        } else if (percentage > 20 && percentage <= 40) {
                            rating = 4
                        } else {
                            rating = 5
                        }
                }

                rating_avg += (weight[idx] * rating)

            })

            rating_avg = Math.round(rating_avg / total_weight)

            await addRating(rating_avg)
            setRating(rating_avg)
            console.log("SET RATING!")

        }
    }
    async function makeRatingProduct() {
        if (Object.keys(product).length > 0) {
            let protein = product?.foodNutrients.find(o => o.nutrient.name === 'Protein')?.amount;
            protein = (protein === 'undefined') ? 0 : protein;
            let carbohydrate = product?.foodNutrients.find(o => o.nutrient.name === "Carbohydrate, by difference")?.amount;
            carbohydrate = (carbohydrate === 'undefined') ? 0 : carbohydrate;
            let transFat = product?.foodNutrients.find(o => o.nutrient.name === "Fatty acids, total trans")?.amount;
            transFat = (transFat === 'undefined') ? 0 : transFat;
            let sugar = product?.foodNutrients.find(o => o.nutrient.name === "Sugars, total including NLEA")?.amount;
            sugar = (sugar === 'undefined') ? 0 : sugar;
            let fat = product?.foodNutrients.find(o => o.nutrient.name === "Total lipid (fat)")?.amount;
            fat = (fat === 'undefined') ? 0 : fat;
            let saturatedFat = product?.foodNutrients.find(o => o.nutrient.name === "Fatty acids, total saturated")?.amount;
            saturatedFat = (saturatedFat === 'undefined') ? 0 : saturatedFat;
            let calories = product?.foodNutrients.find(o => o.nutrient.name === "Energy")?.amount;
            calories = (calories === 'undefined') ? 0 : calories;
            let fiber = product?.foodNutrients.find(o => o.nutrient.name === "Fiber, total dietary")?.amount;
            fiber = (fiber === 'undefined') ? 0 : fiber;

            let nutrients = [fat, protein, transFat, saturatedFat, calories, sugar, fiber]



    // 10% or less of daily intake (if good for you)
        // rating = 1
    // 10-20 (rating = 2)
    // 20-40 (rating = 3)
    // 40-60 (rating = 4)
    // 60+ (rating = 5)

            let rating_avg = 0;
            nutrients.map((element, idx) => {
                let rating = 0
                // if good for you
                if (better[idx] === "+") {
                    let high_val = 0 //deciding which upper bound to use
                    if (element > dietary_information[columns[idx]][0]) {
                        high_val = 1
                    }
                    let percentage = (element / dietary_information[columns[idx]][high_val]) * 100
                    if (percentage < 10) {
                        rating = 1
                    } else if (percentage >= 10 && percentage < 20) {
                        rating = 2
                    } else if (percentage >= 20 && percentage < 30) {
                        rating = 3
                    } else if (percentage >= 30 && percentage < 40) {
                        rating = 4
                    } else {
                        rating = 5
                    }
                // if bad for you
                // if greater than daily: rating = 1
                // if 60% or higher : rating = 2
                // if 40% - 60% : rating = 3
                // if 20%-40% : rating = 4
                // if less : rating = 5
                } else if (better[idx] === "-1") {
                    if (element > dietary_information[columns[idx]][1]) {
                        rating = 1
                    } else {
                        let percentage = (element / dietary_information[columns[idx]][1]) * 100
                        if (percentage > 60) {
                            rating = 2
                        } else if (percentage > 40 && percentage <= 60) {
                            rating = 3
                        } else if (percentage > 20 && percentage <= 40) {
                            rating = 4
                        } else {
                            rating = 5
                        }
                    }
                } else if (better[idx] === "-0") {
                    if (element > dietary_information[columns[idx]][1]) {
                        rating = 1
                    } else {
                        let percentage = (element / dietary_information[columns[idx]][0]) * 100
                        if (percentage > 60) {
                            rating = 2
                        } else if (percentage > 40 && percentage <= 60) {
                            rating = 3
                        } else if (percentage > 20 && percentage <= 40) {
                            rating = 4
                        } else {
                            rating = 5
                        }
                    }
                }

                rating_avg += (weight[idx] * rating)

            })

            rating_avg = Math.round(rating_avg / total_weight)

            await addRating(rating_avg)
            setRating(rating_avg)
            console.log("SET RATING!")
        }
    }


    return (
        <div>
        <p>Health:</p>
        <Rating value={ratings} readOnly/>
        </div>
    )

}
