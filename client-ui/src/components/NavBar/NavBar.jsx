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
        const res = await axios.post(`http://localhost:3001/logout`, {
            "sessionToken" : user.sessionToken
        })
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
            <ul>
                <li><Link to="/"><i className="fa-solid fa-house"></i></Link></li>
                <li>{isLoggedIn && <p>Welcome, {user.user.username}</p>}</li>
                <li className="right"><div className="dropdown">
                    <i className="fa-solid fa-circle-user"></i>
                            <div className="dropdown-content">
                            {isLoggedIn &&
                                <>
                                    <p>Welcome, {user.user.username}</p>
                                    <a href="#" onClick={onClick}>Logout</a>
                                    <Link to="/userProfile">Your Profile</Link>
                                    <Link to="/userRatings">Your Ratings</Link>
                                </>
                            }
                                <Link to="users/login">Log in!</Link>

                            </div>
                        </div></li>
            </ul>
        </div>

    )
}
