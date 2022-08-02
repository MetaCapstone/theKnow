// https://api.nal.usda.gov/fdc/v1/foods/search?query=cheddar%20cheese&dataType=Branded&pageNumber=2&sortOrder=asc&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB&pageSize=20
//%20 for space between queries
// &brandOwner=Kar%20Nut%20Products%20Company for brands
import React, { useState, useRef } from "react"
import axios from "axios"
import "./Search.css"
import ProductCard from "../ProductCard/ProductCard"
import Loading from "../Loading/Loading"

export default function Search(props) {

    const[searched, setSearched] = useState([])
    const inputEl = useRef(null);
    const [open, setOpen] = useState(false)
    const [isFetched, setIsFetched] = useState(false)
    let url = "https://api.nal.usda.gov/fdc/v1/foods/search"
    let access_token ="bdJjin59zDuhXSARWy1Gu6M642AeZa2J9VIdqwib" //"oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB"

    async function searchAPI(query, sortOrder="asc", brandOwner=undefined) {

        let params = url + `?query=${query.replace(":", "%3A").replace(" ", "%20").replace(",", "%2C").replace("/", "%2F").replace("&", "%26").replace('"', "%22")}&sortOrder=${sortOrder}`
        if (brandOwner) {
            params += `&brandOwner=${brandOwner.replace(" ", "%20")}`
        }
        params += "&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB&dataType=Branded&pageSize=20&pageNumber=2"
        setIsFetched(true)
        const response = await axios.get(params, {
            headers: {
                'Authorization': `api_key=${access_token}`,
            }
            }).catch((err) => console.log(err))
        setIsFetched(false)
        setSearched(response.data.foods)
    }

        /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    function myFunction() {
        let val = document.getElementById("myDropdown")
        if (val) {
            if (val.className.includes("show")) {
                val.className = "dropdown-content";
            } else {
                val.className = "dropdown-content show"
            }
        }
    }


    function callFunction() {
        let keyword = document.getElementById("Keyword")?.value
        let brandOwner = document.getElementById("brandOwner")?.value
        let sortOrder = document.getElementById("sortOrder")?.value
        searchAPI(keyword, sortOrder, brandOwner)

        if (keyword) {
            document.getElementById("Keyword").value = ""
        } if (brandOwner) {
            document.getElementById("brandOwner").value = ""
        } if (sortOrder) {
            document.getElementById("sortOrder").value = ""
        }
    }

    if (isFetched) {
        return <Loading/>
    } else {
        return (
            <>
            <div className="container">
                <div className="Icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#657789" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </div>
                    <div id="InputContainer" className="InputContainer">
                        <div id="input">
                            <label>Search for a Product</label>
                            <input id="Keyword" placeholder="Keyword" input="text" ref={inputEl} />
                        </div>
                        <div id="myDropdown" className="dropdown-content">
                            {/* <button onClick={inputSearch()}>-</button> */}
                            <button onClick={() => {document.getElementById("input").innerHTML += "<input id='brandOwner' placeholder='Brand Owner' input='text' />"}}>Brand Owner</button>
                            <button onClick={() => {document.getElementById("input").innerHTML += "<input id='sortOrder' placeholder='asc or dec' input='text' />"}}>Sort Order</button>
                        </div>
                        <button className="dropbtn" onClick={() => {setOpen(!open); myFunction()}}>{open ? "-" : "+"}</button>
                        <button className="dropbtn" onClick={() => callFunction()}>search</button>

                    </div>
                </div>
                <div className="search-grid">
                    {searched.map((product, idx) => {
                        return <ProductCard user={props.user} key={idx} product={product} likedProducts={props.likedProducts}></ProductCard>
                    })}
                    {/* {searched.map((product, idx) => {
                        return
                    })} */}
                </div>
                <button className={searched.length == 0 ? "hidden":""} onClick={()=> {setSearched([])}}>Clear</button>

            <h1 id="norm">Normal products: </h1>
                {/* <ProductGrid user={props.user} products={searched} setIsFetching={props.setIsFetching} isFetching={props.isFetching}/> */}
            </>

        )
    }
}
