import * as React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import ReactLoading from "react-loading";
import axios from "axios"
import "./ProductDetail.css"
import Loading from "../Loading/Loading.jsx"
import HealthRating from "../HealthRating/HealthRating";

export default function ProductDetail(props) {
    const params = useParams();
    const [productState, setProductState] = useState({})
    const [ratings, setRatings] = useState([])
    const [isFetched, setIsFetched] = useState(false)
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
            console.log("loaded data"), response.data
        }
        setIsFetched(false)
    }


    React.useEffect(()=>{
        getData()
        async function getAvg() {
          let resp = await getAvgRatings()
          setRatings(resp)
        }
        getAvg()
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

    async function getAvgRatings() {
      try {
        const res = await axios.get(`http://localhost:3001/ratings/${params.productId}`)
        return res.data.posts
      } catch (err) {
          console.log(err)
      }
    }
    if (isFetched || productState == {}) {
      return <Loading/>
    } else {
      return (
        <>
        <div>
        {(productState===undefined) ? <h1>Not found!</h1> :
          <div className="product-detail">
          <h1>{productState.description}</h1>
          <h5>{productState.brandOwner}</h5></div>}
          {(productState == undefined) ? <p>health rating not found</p> : <HealthRating product={productState}/>}
          </div>
          <div className="rate">
            <input type="radio" id="star5" name="rate" value="5" />
            <label htmlFor="star5" title="text">5 stars</label>
            <input type="radio" id="star4" name="rate" value="4" />
            <label htmlFor="star4" title="text">4 stars</label>
            <input type="radio" id="star3" name="rate" value="3" />
            <label htmlFor="star3" title="text">3 stars</label>
            <input type="radio" id="star2" name="rate" value="2" />
            <label htmlFor="star2" title="text">2 stars</label>
            <input type="radio" id="star1" name="rate" value="1" />
            <label htmlFor="star1" title="text">1 star</label>
          </div>
          <div className="review">
            <h2>Review!</h2>
            <input id="review" type="text" />
          </div>
          <div id="sub" className="submit">
            <button onClick={() => {submitInfo(); document.getElementById("sub").innerHTML += "<h1>Thank you for your review!</h1>";
          document.getElementById("review").value = "";
          document.querySelector('input[name="rate"]:checked').checked = false;}}>Submit!</button>
          </div>
          <div className="allRatings">
            <h1>Ratings!</h1>
            {ratings.map((element, idx) => {
              return <div key={idx}><h2>{element.user}</h2> <p>{element.rating}</p><p>{element.review}</p></div>
            })}
          </div>
        </>
      )
    }
  }
