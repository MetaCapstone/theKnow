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

    const handleAdd = event => {
      event.preventDefault();

      const login = async () => {
          try {
              console.log("Adding to cart")
              const res = await axios.post(`${config.API_BASE_URL}/`, {})                
              //handleLogin(res.data.user)    
          } catch (err) {
              console.log(err)
              alert("Failed");
              
          }
      }
      login()
  }

    const imageSrc = props.product.name_translations.en ? props.product.images[0].large : null
    console.log(props.product)
    return (
      <div className="product-card">
        <div className="product-name">
           <h1>{props.product.name_translations?.en}</h1>
        </div>
        <div className="media">
            <Link to={"/product/" + props.product.id}>
                <img src={imageSrc} />
            </Link>
            {display}
            {/* <button onClick={handleAdd}>Add to Cart</button>
            <button onClikck={handleRemove}>Remove from Cart</button> */}
        </div>
      </div>
    )
  }