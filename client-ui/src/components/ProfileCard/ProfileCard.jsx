import axios from "axios"
import {useState, useEffect} from "react"
import {Link} from "react-router-dom"

export default function ProfileCard({user}) {

    const [userInfo, setUserInfo] = useState([])

    async function getData(userId) {
        let resp = await axios.get(`http://localhost:3001/userProfile/${userId}`)
        console.log("RESP!", resp.data.posts)
        setUserInfo(resp.data.posts)
    }

    function logData() {
        for (const [key, value] of Object.entries(userInfo)) {
            console.log(`${key}: ${value}`);
        }
    }
    useEffect(() => {
        if (user.user) {
            getData(user.user.objectId)
        }
    }, [])

    if (!user.user) {
        return (
            <p> Not logged in. Log in to view your user profile!</p>
        )
    } else {
        return (
            <>
                <h1> your profile! </h1>
                <div id="name">
                    <h2>{userInfo.firstName} {userInfo.lastName}</h2>
                    <h4>{userInfo.height} feet tall</h4>
                    <h4>{userInfo.weight} lbs</h4>
                    <h5>Sex: {userInfo.gender}</h5>
                </div>
                {logData()}
                <Link to="/userProfile">Update information</Link>
            </>
        )
    }
}
