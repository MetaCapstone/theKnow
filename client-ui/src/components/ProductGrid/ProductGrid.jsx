import React, { useState, useRef } from "react"
import ProductCard from "../ProductCard/ProductCard.jsx"
import "./ProductGrid.css"
import axios from "axios"
import Search from "../Search/Search.jsx"
import { useEffect } from "react";
import LikedProducts from "../LikedProducts/LikedProducts.jsx"


export default function ProductGrid(props) {
    const [data, setData] = useState([])
    const [show, setShow] = useState(false);

    async function viewProducts() {
        //props.setIsFetching(true)
        if (props.user.user) {
            const res = await axios.get(`http://localhost:3001/products/${props.user.user.objectId}`)
            setData(res.data.posts)
        }
        //props.setIsFetching(false)
    }

    useEffect(() => {
        viewProducts()
    }, [])

    function showOrNot() {
        if (show) {
            console.log("TRUE")
            return <LikedProducts setIsFetching={props.setIsFetching} isFetching={props.isFetching} user={props.user}/>;
        }
        else {
            console.log("FALSE")
            return <></>;
        }
    }

    return (
        <>
            <button onClick={() => {setShow(!show)}}>Liked Products</button>
            {showOrNot()}
            <Search likedProducts={data} user={props.user} products={props.products} setIsFetching={props.setIsFetching} isFetching={props.isFetching}/>
            <div className="product-grid">
                {
                    props.products.map((product, idx) => {
                        return <ProductCard user={props.user} key={idx} product={product} setProducts={setData} likedProducts={data}></ProductCard>
                        // return <p> {product.name_translations.en}</p>
                    })}
            </div>
        </>
    )

}
