import * as React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import NotFound from "../NotFound/NotFound";
import ProductView from "../ProductView/ProductView";
import axios from "axios"
import "./ProductDetail.css"

export default function ProductDetail(props) {
    const params = useParams();
    const [productState, setProductState] = useState({})

    // figure out the quantity to show for the productId
    // empty string with a 0 quantity or shows quantity
    function findQuantity(productId) {
        let findIndex = -1
        props.shoppingCart.forEach((value, i) => {
        if(value.itemId === productId) { findIndex = i}
        })
        return (findIndex === -1 || props.shoppingCart[findIndex].quantity === 0)  ? "" : props.shoppingCart[findIndex].quantity
    }

    // getting data for the specific product that has been clicked on
    // async function getData() {
    //     props.setIsFetching(true)
    //     let response = await axios.get(`https://codepath-store-api.herokuapp.com/store/${params.productId}`).catch((err) => props.setError(err))
    //     if (response)
    //         setProductState(response.data.product)
    //       props.setIsFetching(false)
    // }
    React.useEffect(()=>{
        getData()
      },[])
    if (props.error != "") {
      return (
        <NotFound/>
      )
    }
    return (
      <div className="product-detail">
        {props.isFetching ? <h1>Loading...</h1>: 
        (productState===undefined) ? <NotFound error={props.error} /> : 
        <ProductView product={productState} 
        productId={productState.id} 
        quantity={findQuantity(productState.id)}
        handleRemoveItemFromCart={props.handleRemoveItemFromCart} 
        handleAddItemToCart={props.handleAddItemToCart} 
        shoppingCart={props.shoppingCart}
        />}
      </div>
    )
  }