import React, { useState, useRef } from "react"
import ProductCard from "../ProductCard/ProductCard.jsx"
import "./ProductGrid.css"
import axios from "axios"
import { useEffect } from "react";


export default function ProductGrid(props) {
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState([])
    const inputEl = useRef(null);

    async function viewProducts() {
        props.setIsFetching(true)
        if (props.user.user) {
            const res = await axios.get(`http://localhost:3001/products/${props.user.user.objectId}`)
            props.setIsFetching(false)
            setData(res.data.posts)
            console.log("DATA" , res.data.posts)
        }
    }
    useEffect( () => {
        viewProducts()
        console.log("RES DATA", data)
    }, [])

    return (
        <><div className="Card">
            <div className="CardInner">
                <label>Search for a product</label>
                <div className="container">
                    <div className="Icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#657789" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </div>
                    <div className="InputContainer">
                        <input placeholder="Search" input="text" ref={inputEl} />
                        <button onClick={() => setSearchValue(inputEl?.current?.value)}>search</button>
                    </div>
                </div>
            </div>
        </div>
            <div className={"product-grid"}>
                {
                    props.products.map((product, idx) => {
                        return <ProductCard user={props.user} key={idx} product={product} likedProducts={data}></ProductCard>
                        // return <p> {product.name_translations.en}</p>
                    })}
            </div>
        </>
    )

}
