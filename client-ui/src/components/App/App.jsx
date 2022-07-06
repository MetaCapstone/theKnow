import { useState, useEffect } from 'react'
import * as React from "react"
import './App.css'
import NavBar from '../NavBar/NavBar'
import LoggedOutView from '../LoggedOutView/LoggedOutView'
import MessagesView from '../MessagesView/MessagesView'
import axios from "axios"
import {BrowserRouter, Route, Routes, Link} from "react-router-dom"
import ProductGrid from '../ProductGrid/ProductGrid'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("current_user_id") !== null)
  const [user, setUser] = useState('')

  // For every network request, add a custom header for the logged in user
  // The backend API can check the header for the user id
  //
  // Note: This isn't a secure practice, but is convenient for prototyping.
  // In production, you would add an access token instead of (or in addition to)
  // the user id, in order to authenticate the request

  let url = 'https://foodrepo.org/api/v3/products'
    let access_token = "6f0b9fe7724f37e253a375f5152cbb34";
    const [products, setSelectedProducts] = useState([])
    //const [page, setPage] = useState(1)
    let page = 1

    async function loadMorePages() {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
            console.log("HERE")
            page = page + 1
            let page_url = url + `?page%5Bnumber%5D=${page}` 
            const response = await axios.get(page_url, {
            headers: {
                'Authorization': `Token token=${access_token}`,
            }
            }).catch((err) => console.log(err))

            // let temp = [...products]
    
            setSelectedProducts(products => [...products, ...response.data.data])
            // temp.push(item)
            
        }
        
    }

    useEffect(() => {
        window.addEventListener('scroll', loadMorePages)

        return () => window.removeEventListener('scroll', loadMorePages)
    }, [])

    async function getUser() {
        let currentUser = await axios.get(`http://localhost:${3001}/userInfo`)
        console.log("CURRENT USER:" + currentUser)
        return currentUser
    }
    

    // fetches data from api to display
    async function fetchData() {

        const response = await axios.get('https://foodrepo.org/api/v3/products', {
        headers: {
            'Authorization': `Token token=${access_token}`
        }
        }).catch((err) => console.log(err))

        setSelectedProducts(response.data.data)
    }
    React.useEffect(()=>{
      fetchData()
    },[])


  const addAuthenticationHeader = () => {
    const currentUserId = localStorage.getItem("current_user_id")
    if (currentUserId !== null) {
      axios.defaults.headers.common = {
        "current_user_id": currentUserId
      };
    }
  }
  addAuthenticationHeader()

  const handleLogout = () => {
    localStorage.removeItem("current_user_id")
    axios.defaults.headers.common = {};
    setIsLoggedIn(false)
    setUser("")
  }

  const handleLogin = (user) => {
    console.log(user)
    localStorage.setItem("current_user_id", user["objectId"])
    setUser(user["username"])
    addAuthenticationHeader()

    setIsLoggedIn(true)
  }

  return (
    <BrowserRouter>
    <NavBar isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/users/login" element={<LoggedOutView isLoggedIn={isLoggedIn} handleLogin={handleLogin} />} />
        <Route path="/" element={<ProductGrid products={products} />}/>
        {/* <Route path="/product/:productId" element={<ProductDetail />}/> */}

      </Routes>
    </BrowserRouter>
  )
  }


export default App
