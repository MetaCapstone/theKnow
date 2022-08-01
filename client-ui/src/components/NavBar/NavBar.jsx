import * as React from "react"
import "./NavBar.css"
import {Link} from "react-router-dom"
import axios from "axios";
import { useState, useEffect} from 'react'
import LikedProducts from "../LikedProducts/LikedProducts";
import UserProfile from "../UserProfile/UserProfile";

export default function NavBar({ handleLogout, user, setIsFetching, isFetching}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [selected, setSelected] = useState("");
    const [show, setShow] = useState(false)

    const showSelectedOption = () => {
        switch(selected) {
            case 'show':
            return  <LikedProducts setIsFetching={setIsFetching} isFetching={isFetching} user={user}/>;
            default:
            return
        }
    }
    const onClick = async (event) => {
        event.preventDefault()
        //setIsFetching(true)
        const res = await axios.post(`http://localhost:3001/logout`, {
            "sessionToken" : user.sessionToken
        })
        //setIsFetching(false)
        setIsLoggedIn(false)
        handleLogout()
    }
    useEffect(() => {
        setIsLoggedIn(Object.keys(user).length !== 0)
    }, [user])

    function showOrNot() {
        if (show) {
            return
        }
        else {
            return <></>;
        }
    }

    return (
        <div id="NavBar">
            {/* <button onClick={() => {selected === "show" ? setSelected("") : setSelected("show")}}>Liked Products</button>
            {showSelectedOption()} */}
            <>{isLoggedIn &&
                <>
                <a href="#" onClick={onClick}>Logout</a>
                {/* <p>Welcome!</p> */}
                <p>Welcome, {user.user.username}</p>
                </>
            }
            <Link to="/"><i className="fa-solid fa-house"></i></Link>
            <Link to="users/login">Log in!</Link></>
            <Link to="/profileCard">User Profile</Link>
            {/* <Link to="/userProfile">User Profile</Link> */}
        </div>
    )
}
