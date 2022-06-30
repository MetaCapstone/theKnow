import * as React from "react"
import { Link } from "react-router-dom"

export default function ProductCard(props) {
    let display = ""; 
    
    //protein energy energy_kcal fat sodium fiber carbohydrates sugars saturated_fat

    // labels: 
    // name_translations
    // per_day
    // per_hundred
    // per_portion
    // unit

    // if no english name exists, don't render the image
    const imageSrc = props.product.name_translations.en ? props.product.images[0].large : null

    return (
      <div className="product-card">
        <div className="product-name">
           <h1>{props.product.name_translations.en}</h1>
        </div>
        <div className="media">
            <Link to={"/product/" + props.product.id}>
                <img src={imageSrc} />
            </Link>
            {display}
        </div>
      </div>
    )
  }