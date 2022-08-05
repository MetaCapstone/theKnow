import * as React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import ReactLoading from "react-loading";
import axios from "axios"
import "./ProductDetail.css"
import Loading from "../Loading/Loading.jsx"
import HealthRating from "../HealthRating/HealthRating";
import {Rating} from "@mui/material"
import Ratings from "../Ratings/Ratings";

export default function ProductDetail(props) {
    const params = useParams();
    const [productState, setProductState] = useState({})
    const [ratings, setRatings] = useState([])
    const [isFetched, setIsFetched] = useState(false)
    const [avg, setAvg] = useState(0.0)
    const [count, setCount] = useState(0)
    let string = ""

    // Get link for grabbing specific product info based on FDCId: const params = useParams();

   // getting data for the specific product that has been clicked on
   let access_token="bdJjin59zDuhXSARWy1Gu6M642AeZa2J9VIdqwib" //"oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB"
    async function getData() {
      setIsFetched(true)
        let response = await axios.get(`https://api.nal.usda.gov/fdc/v1/food/${params.productId}?&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB&pageSize=20`,
        { headers: {
          'Authorization': `api_key=${access_token}`,
        }
        }).catch((err) => console.log(err))
        if (response) {
            setProductState(response.data)
            addCategory(response.data.brandedFoodCategory)
        }
        setIsFetched(false)
    }


    React.useEffect(()=>{
      async function responses() {
        let response = await getRatingExists()
          if (response.data == undefined) {
            setProductState({description: response.title, brandOwner: response.company, value:response.healthRating})
          }
            getData()
            async function getAvg() {
              let resp = await getAvgRatings()
              setRatings(resp)
            }
            getAvg()
        }

      responses()

      },[])


    async function submitInfo() {
      let value = document.querySelector('input[name="rate"]:checked').value;
      let input = document.getElementById("review").value;
      try {
        const res = await axios.post(`http://localhost:3001/ratings`, {
          "user" : props.user,
          "productId" : parseInt(params.productId),
          "rating" : parseInt(value),
          "reviews" : input
        })
      } catch (err) {
          console.log(err)
          alert("Failed to add rating. Make sure you are logged in! ");
      }
    }

    async function getRatingExists() {
      try {
        const res = await axios.get(`http://localhost:3001/rating_add/${params.productId}`)
        return res.data.posts
      } catch (err) {
          console.log(err)
      }
    }

    async function addRating(health) {
      const res = await axios.post(`http://localhost:3001/rating_add`, {
              "productId" : parseInt(params.productId),
              "healthRating" : health,
              "title" : productState.description,
              "company" : productState.brandOwner,
              "category" : ratings.brandedFoodCategory
      })
    }

    async function addCategory(category) {
        const res = await axios.post(`http://localhost:3001/category`, {
                "productId" : parseInt(params.productId),
                "title" : productState.description,
                "company" : productState.brandOwner,
                "category" : category
        })
    }


    async function getAvgRatings() {
      try {
        const res = await axios.get(`http://localhost:3001/ratings/${params.productId}`)
        // console.log("RES!", res.data.average)
        setAvg(res.data.average)
        setCount(res.data.count)
        return res.data.posts
      } catch (err) {
          console.log(err)
      }
    }

    // <Rating value={makeRatingProduct()} readOnly/>

    if (isFetched || productState == {}) {
      return <Loading/>
    } else {
      return (
        <div className="details">
        <div>
        {(productState===undefined) ? <h1>Not found!</h1> :
          <div className="product-detail">
          <h1>{productState.description}</h1>
          <h5>{productState.brandOwner}</h5></div>}
          <div className="health">
            {(productState.value == undefined) ? <HealthRating user={props.user} product={productState} getRatingExists={getRatingExists} addRating={addRating}/> : <Rating value={productState.value} readOnly/>}
          </div>
          </div>
          <div className="review">
            <h2 className="skills">Leave a Review!</h2>
          </div>
          <div className="rate">
            <input type="radio" id="star5" name="rate" value="5" />
            <label htmlFor="star5" title="Really Good!!">5 stars</label>
            <input type="radio" id="star4" name="rate" value="4" />
            <label htmlFor="star4" title="text">4 stars</label>
            <input type="radio" id="star3" name="rate" value="3" />
            <label htmlFor="star3" title="text">3 stars</label>
            <input type="radio" id="star2" name="rate" value="2" />
            <label htmlFor="star2" title="text">2 stars</label>
            <input type="radio" id="star1" name="rate" value="1" />
            <label htmlFor="star1" title="Really Bad :(">1 star</label>
          </div>
          <div className="review">
            <br></br>
            <input id="review" className="submit" type="text" placeholder="Review here..."/>
          </div>
          <div id="sub">
            <button className="buttons center" onClick={() => {submitInfo(); document.getElementById("sub").innerHTML += "<h1>Thank you for your review!</h1>";
          document.getElementById("review").value = "";
          document.querySelector('input[name="rate"]:checked').checked = false;}}>Submit!</button>
          </div>
          <Ratings avg={avg} count={count} ratings={ratings}/>
        </div>
      )
    }
  }
