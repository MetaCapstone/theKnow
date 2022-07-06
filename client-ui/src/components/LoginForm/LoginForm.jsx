import * as React from "react"
import "./LoginForm.css"
import axios from "axios"
import * as config from "../../config"

export default function LoginForm({handleLogin}) {
    const username = React.createRef();
    const password = React.createRef();

    const handleSubmit = event => {
        event.preventDefault();

        const login = async () => {
            try {
                const res = await axios.post(`${config.API_BASE_URL}/login`, {
                    "username" : username.current.value,
                    "password" : password.current.value
                    })                
                handleLogin(res.data.user)    
            } catch (err) {
                console.log(err)
                alert("Sign in failed: " + err.response.data.error);
                
            }
        }
        login()
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <div className="title">Login</div>
        <label>
          <span>Username</span>
          <input ref={username} placeholder="Username"></input>
        </label>
        <label>
          <span>Password</span>
          <input type="password" ref={password} placeholder="Password"></input>
        </label>
        <button type="submit">Login</button>
      </form>
    )
}