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
import UserProfile from '../UserProfile/UserProfile'
import ProfileCard from '../ProfileCard/ProfileCard'
import UserRatings from '../UserRatings/UserRatings'
import LoginForm from '../LoginForm/LoginForm'
import RegisterForm from '../RegisterForm/RegisterForm'
import ImageScraping from '../ImageScraping/ImageScraping'

function App() {
  const [user, setUser] = useState({})
  const [isFetching, setIsFetching] = useState(false)

  const url = "https://api.nal.usda.gov/fdc/v1/foods/search?dataType=Branded&pageSize=30&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB"

    const [products, setSelectedProducts] = useState([])
    let page = 1

    async function loadMorePages() {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
            page = page + 1
            let page_url = url + `&pageNumber=${page}`
            const response = await axios.get(page_url, {
            headers: {
                'Authorization': `api_key=${access_token}`,
            }
            }).catch((err) => console.log(err))

            setSelectedProducts(products => [...products, ...response.data.foods])


        }

    }

    useEffect(() => {
        window.addEventListener('scroll', loadMorePages)
        return () => window.removeEventListener('scroll', loadMorePages)
    }, [])


    // fetches data from api to display
    let access_token="bdJjin59zDuhXSARWy1Gu6M642AeZa2J9VIdqwib"
    async function fetchData() {
        const response = await axios.get(url, {
        }).catch((err) => {console.log(err.request.response)})
        setSelectedProducts(response.data.foods)
    }

    useEffect(()=>{
      setIsFetching(true)
      fetchData()
      setIsFetching(false)
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
  if (isFetching) {
    return (
      <Loading/>
    )
  } else {
    return (
      <BrowserRouter>
      <NavBar setIsFetching={setIsFetching} isFetching={isFetching} user={user} handleLogout={handleLogout}/>
        <Routes>
          <Route path="/users/login" element={<LoginForm user={user} isLoggedIn={isEmpty} handleLogin={handleLogin} setIsFetching={setIsFetching} isFetching={isFetching}/>} />
          <Route path="/" element={<ProductGrid user={user} products={products} setIsFetching={setIsFetching} isFetching={isFetching}/>}/>
          <Route path="/product/:productId" element={<ProductDetail products={products} user={user} setIsFetching={setIsFetching} isFetching={isFetching}/>}/>
          <Route path="/userProfile" element={<UserProfile user={user}/>}/>
          <Route path="/userRatings" element={<UserRatings user={user}/>}/>
          <Route path="/image" element={<ImageScraping/>}/>
        </Routes>
      </BrowserRouter>
    )
  }
}



export default App
