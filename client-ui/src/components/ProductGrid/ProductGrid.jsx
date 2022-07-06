import React, { useState, useRef } from "react"
import ProductCard from "../ProductCard/ProductCard.jsx"
import "./ProductGrid.css"
import axios from "axios"
import { useEffect } from "react";


export default function ProductGrid(props) {
    const [searchValue, setSearchValue] = useState('');
    const [searchedProducts, setSearchedProducts] = useState('');
    const inputEl = useRef(null);

    let url = 'https://foodrepo.org/api/v3/products'
    let access_token = "6f0b9fe7724f37e253a375f5152cbb34";

    const filteredProducts  = searchValue.length > 0 ? searchedProducts : props.products;

  
    // Run the search every time the button is clicked
    // ...or....
    // Run the search every time the search value changes
    useEffect(() => {
        // filters search based on if the item contains the searched substring
        async function filterSearch() {

            const response = await axios.post(url + "/_search", {
                "_source": {
                    "includes": [
                        "name_translations",
                        "barcode",
                        "nutrients",
                        "images"
                    ]
                },
                "size": 20,
                "query": {
                    "query_string": {
                        "fields": [
                            "name_translations.fr"
                        ],
                        "query": `${searchValue}`
                    }
                },
                "sort": "nutrients.sugars.per_hundred"
            }, {
                headers: {
                    'Authorization': `Token token=${access_token}`,
                }
            }).catch((err) => { console.log(response); console.log(err) })
            
            console.log('response: ', response);
            setSearchedProducts(response.data.hits.hits)        
        }

        filterSearch();
    }, [searchValue])

        
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
                    filteredProducts.map((product, idx) => {
                        return <ProductCard key={idx} product={product}></ProductCard>
                        // return <p> {product.name_translations.en}</p> 
                    })}
            </div>
        </>
    )    

}
