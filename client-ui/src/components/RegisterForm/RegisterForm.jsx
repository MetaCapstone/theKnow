import * as React from "react"
import "./RegisterForm.css"
import axios from "axios"
import * as config from '../../config'

export default function RegisterForm({ handleLogin }) {
    const username = React.createRef();
    const password = React.createRef();

    const handleSubmit = event => {
        event.preventDefault();

        const register = async () => {
            try {
                console.log(`${config.API_BASE_URL}/register`)
                const res = await axios.post(`${config.API_BASE_URL}/register`, {
                    "username" : username.current.value,
                    "password" : password.current.value
                    })
                handleLogin(res.data.user)
            } catch (err) {
                alert("Sign up failed: " + err.response.data.loginMessage);
            }
        }
        register()
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="title">Register</div>
            <label>
                <span>Username</span>
                <input ref={username} placeholder="Username"></input>
            </label>
            <label>
                <span>Password</span>
                <input type="password" ref={password} placeholder="Password"></input>
            </label>
            <button type="submit">Register</button>
        </form>
    )
}
