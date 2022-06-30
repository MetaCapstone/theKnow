import * as React from "react"
import ProductCard from "../ProductCard/ProductCard.jsx"
import "./ProductGrid.css"
export default function ProductGrid(props) {
    console.log(props.products)
    if (props.products) {
        return (
            <div className="product-grid">
                {props.products.map((product, idx) => {
                    return <ProductCard key={idx} product={product}></ProductCard>
                    //return <p> {product.name_translations.en}</p> 
                })}
                {/* {props?.data?.map((datas, idx) => {})} */}
            </div>
        )
    }
  }