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
            <div className="container-search">
                    <div id="InputContainer" className="InputContainer">
                        <div id="input">
                            <input id="Keyword" placeholder="Search by Keyword" input="text" ref={inputEl} />
                            <button className="buttons search" onClick={() => callFunction()}><i class="fa-solid fa-magnifying-glass"></i> </button>
                            <button className="buttons search" onClick={() => {setOpen(!open); myFunction()}}>{open ? "-" : "+"}</button>
                        </div>
                        <div id="myDropdown" className="dropdown-content">
                            {/* <button onClick={inputSearch()}>-</button> */}
                            <button className="buttons search" onClick={() => {document.getElementById("input").innerHTML += "<input id='brandOwner' placeholder='Brand Owner' input='text' />"}}>Brand Owner</button>
                            <button className="buttons search" onClick={() => {document.getElementById("input").innerHTML += "<input id='sortOrder' placeholder='asc or dec' input='text' />"}}>Sort Order</button>
                        </div>
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
                <button className={searched.length == 0 ? "buttons clear hidden":"buttons clear"} onClick={()=> {setSearched([])}}>Clear</button> <br></br>
            </>

        )
    }
}
