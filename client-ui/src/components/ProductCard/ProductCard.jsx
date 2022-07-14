import axios from "axios";
import * as React from "react"
import { Link } from "react-router-dom"
import { useState, useEffect} from "react";
import "./ProductCard.css";

export default function ProductCard(props) {
    let display = "";
    let productsLiked = new Set(props.likedProducts)
    let val = productsLiked.has(parseInt(props.product.fdcId))
    const [add, setAdd] = useState(val)
    //let add = val

    useEffect(() => {
      setAdd(productsLiked.has(parseInt(props.product.fdcId)))
    }, [props.likedProducts])

    async function handleAdd() {
      try {
        const res = await axios.post(`http://localhost:3001/add_products`, {
          "user" : props.user,
          "productId" : props.product.fdcId
        })
      } catch (err) {
          alert("Failed to add to liked. Make sure you are logged in! ", err);
      }
      //await props.setProducts()
      setAdd(prev => !prev)
      // add = !add
    }

    async function handleRemove() {
      try {
        const res = await axios.post(`http://localhost:3001/remove_products`, {
          "user" : props.user,
          "productId" : props.product.fdcId
        })
      } catch (err) {
        alert("Failed to delete from liked. Make sure you are logged in! ", err);
      }
      //await props.setProducts()
      setAdd(prev => !prev)
      props.setProducts(props.likedProducts)
    }

// solid heart: <i class="fa-solid fa-heart"></i>
// lined heart: <i class="fa-solid fa-heart-circle-xmark"></i>
    return (
      <div className="product-card">
        <div className="product-name">
          <p>{add ? "Liked!" : ""} </p>
           <h1>{(props.product.lowercaseDescription == undefined) ? props.product.description : props.product.lowercaseDescription}</h1>
        </div>
        <div className="media">
            <Link to={"/product/" + props.product.fdcId}>
              <p>img here</p>
            </Link>
            {display}
            <button onClick={() => (add ? handleRemove() : handleAdd())}>{add ?
            <i className="fa-solid fa-heart-circle-xmark"></i> : <i className="fa-solid fa-heart"></i>}</button>
            {/* <button onClick={handleRemove}>Remove from Liked</button> */}
        </div>
      </div>
    )
  }
