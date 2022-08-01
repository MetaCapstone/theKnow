import * as React from "react"
import "./NavBar.css"
import {Link} from "react-router-dom"
import axios from "axios";

export default function NavBar({ isLoggedIn, handleLogout, user}) {
    const onClick = event => {
        event.preventDefault();
        handleLogout()
    }

    return (
        <div id="NavBar">
            {isLoggedIn &&
                <>
                <a href="#" onClick={onClick}>Logout</a>
                <p>Welcome, {user}</p>
                </>
            }
            <Link to="/"><i className="fa-solid fa-house"></i></Link>
            <Link to="users/login">Log in!</Link>
        </div>
    )
}