import { useState, useEffect } from 'react'
import * as React from "react"
import './App.css'
import NavBar from '../NavBar/NavBar'
import LoggedOutView from '../LoggedOutView/LoggedOutView'

import axios from "axios"
import {BrowserRouter, Route, Routes, Link} from "react-router-dom"
import ProductGrid from '../ProductGrid/ProductGrid'
import ProductDetail from '../ProductDetail/ProductDetail'
import Loading from '../Loading/Loading'

function App() {
  //const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("current_user_id") !== null)
  const [user, setUser] = useState({})
  const [isFetching, setIsFetching] = useState(false)


  // For every network request, add a custom header for the logged in user
  // The backend API can check the header for the user id
  //
  // Note: This isn't a secure practice, but is convenient for prototyping.
  // In production, you would add an access token instead of (or in addition to)
  // the user id, in order to authenticate the request

  const url = "https://api.nal.usda.gov/fdc/v1/foods/search?dataType=Branded&pageSize=30&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB"
  //let url = "https://api.nal.usda.gov/fdc/v1/foods/search?query=cake&?dataType=Branded&pageSize=20&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB"
  //let url = 'https://foodrepo.org/api/v3/products'
   // let access_token = "6f0b9fe7724f37e253a375f5152cbb34";

    const [products, setSelectedProducts] = useState([])
    //const [page, setPage] = useState(1)
    let page = 1

    async function loadMorePages() {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
            console.log("SCROLLING")
            page = page + 1
            let page_url = url + `&pageNumber=${page}` //`?page%5Bnumber%5D=${page}`
            setIsFetching(true)
            const response = await axios.get(page_url, {
            headers: {
                'Authorization': `api_key=${access_token}`,
            }
            }).catch((err) => console.log(err))
            setIsFetching(false)
            // let temp = [...products]

            setSelectedProducts(products => [...products, ...response.data.foods])
            // temp.push(item)

        }

    }

    useEffect(() => {
        window.addEventListener('scroll', loadMorePages)
        console.log("scroll")
        return () => window.removeEventListener('scroll', loadMorePages)
    }, [])


    // fetches data from api to display
    let access_token="oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB"
    async function fetchData() {
        setIsFetching(true)
        const response = await axios.get(url, {
        }).catch((err) => {console.log(err); setIsFetching(false)})
        setIsFetching(false)

        setSelectedProducts(response.data.foods)
    }

    useEffect(()=>{
      fetchData()
    },[])

  const handleLogout = () => {
    localStorage.removeItem("session_token")
    setUser({})
  }

  const handleLogin = (sessionToken) => {
    localStorage.setItem("session_token", sessionToken.sessionToken)
    setUser(sessionToken)
    setIsLoggedIn(true)
  }

  let isEmpty = Object.keys(user).length == 0
  // if (isFetching) {
  //   console.log("HERE LOGGING")
  //   return (
  //     <Loading/>
  //   )
  // } else {
    return (
      <BrowserRouter>
      <NavBar setIsFetching={setIsFetching} isFetching={isFetching} user={user} handleLogout={handleLogout}/>
        <Routes>
          <Route path="/users/login" element={<LoggedOutView user={user} isLoggedIn={isEmpty} handleLogin={handleLogin} setIsFetching={setIsFetching} isFetching={isFetching}/>} />
          <Route path="/" element={<ProductGrid user={user} products={products} setIsFetching={setIsFetching} isFetching={isFetching}/>}/>
          <Route path="/product/:productId" element={<ProductDetail user={user} setIsFetching={setIsFetching} isFetching={isFetching}/>}/>

        </Routes>
      </BrowserRouter>
    )
  }
//}



export default App
