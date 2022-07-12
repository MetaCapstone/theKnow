import axios from "axios";
import * as React from "react"
import { Link } from "react-router-dom"
import { useState } from "react";
import "./ProductCard.css";

export default function ProductCard(props) {
    let display = "";
    const [add, setAdd] = useState(true)


//     //protein energy energy_kcal fat sodium fiber carbohydrates sugars saturated_fat

//     // labels:
//     // name_translations
//     // per_day
//     // per_hundred
//     // per_portion
//     // unit

//     // if no english name exists, don't render the image

    async function handleAdd() {
      try {
        setAdd(false)
        const res = await axios.post(`http://localhost:3001/add_products`, {
          "user" : props.user,
          "productId" : props.product.fdcId
        })
      } catch (err) {
          alert("Failed to add to liked. Make sure you are logged in! ", err);
      }
    }

    async function handleRemove() {
      try {
        setAdd(true)
        const res = await axios.post(`http://localhost:3001/remove_products`, {
          "user" : props.user,
          "productId" : props.product.fdcId
        })
      } catch (err) {
        alert("Failed to delete from liked. Make sure you are logged in! ", err);
      }
    }

//     // const imageSrc = props.product.name_translations.en ? props.product.images[0].large : null
//     console.log(props.product)

// solid heart: <i class="fa-solid fa-heart"></i>
// lined heart: <i class="fa-solid fa-heart-circle-xmark"></i>
    return (
      <div className="product-card">
        <div className="product-name">
           <h1>{props.product.lowercaseDescription}</h1>
        </div>
        <div className="media">
            <Link to={"/product/" + props.product.fdcId}>
              <p>img here</p>
            </Link>
            {display}
            <button onClick={() => (add ? handleAdd() : handleRemove())}>{add ?
            <i className="fa-solid fa-heart-circle-xmark"></i> : <i className="fa-solid fa-heart"></i>}</button>
            {/* <button onClick={handleRemove}>Remove from Liked</button> */}
        </div>
      </div>
    )
  }
