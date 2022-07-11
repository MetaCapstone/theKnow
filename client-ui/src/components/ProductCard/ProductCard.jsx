import axios from "axios";
import * as React from "react"
import { Link } from "react-router-dom"

export default function ProductCard(props) {
    let display = "";


//     //protein energy energy_kcal fat sodium fiber carbohydrates sugars saturated_fat

//     // labels:
//     // name_translations
//     // per_day
//     // per_hundred
//     // per_portion
//     // unit

//     // if no english name exists, don't render the image

    const handleAdd = event => {
      event.preventDefault();
      axios.post(`http://localhost:3001/add_products`, {
        "user" : props.user,
        "productId" : props.product.fdcId
      })
    }

    const handleRemove = event => {
      event.preventDefault();
      axios.post(`http://localhost:3001/remove_products`, {
        "user" : props.user,
        "productId" : props.product.fdcId
      })
    }

//     // const imageSrc = props.product.name_translations.en ? props.product.images[0].large : null
//     console.log(props.product)
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
            <button onClick={handleAdd}>Add to Liked</button>
            <button onClick={handleRemove}>Remove from Liked</button>
        </div>
      </div>
    )
  }
