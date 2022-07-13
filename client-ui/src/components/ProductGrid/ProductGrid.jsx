import React, { useState, useRef } from "react"
import ProductCard from "../ProductCard/ProductCard.jsx"
import "./ProductGrid.css"
import axios from "axios"
import Search from "../Search/Search.jsx"
import { useEffect } from "react";


export default function ProductGrid(props) {
    const [data, setData] = useState([])


    async function viewProducts() {
        props.setIsFetching(true)
        if (props.user.user) {
            const res = await axios.get(`http://localhost:3001/products/${props.user.user.objectId}`)
            props.setIsFetching(false)
            setData(res.data.posts)
            console.log("DATA" , res.data.posts)
        }
    }

    useEffect(() => {
        viewProducts()
    }, [])

    return (
        <>
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
