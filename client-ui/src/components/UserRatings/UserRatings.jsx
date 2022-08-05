import { Link } from "react-router-dom";
import axios from "axios"
import { useEffect, useState } from "react";
import {Rating} from "@mui/material"
import "./UserRatings.css"

export default function UserRatings({user}) {

    const [ratings, setRatings] = useState([])
    const [add, setAdd] = useState(false)

    async function getRatingsForUser(userId) {
        let resp = await axios.get(`http://localhost:3001/userRatings/${userId}`)
        console.log("RESPONSE", resp.data.posts)
        setRatings(resp.data.posts)

    }

    async function handleRemove(objectId) {
        try {
          const res = await axios.post(`http://localhost:3001/remove_rating`, {
            "objectId" : objectId
          })
        } catch (err) {
          alert("Failed to delete rating. Make sure you are logged in! ", err);
        }
        setAdd(prev => !prev)
      }

    useEffect(() => {
        async function getRatings() {
            await getRatingsForUser(user.user.objectId)
          }
          getRatings()
    }, [user])

    return (
        <>
        <Link to="/userProfile"><button className="buttons">Go back to User Profile</button></Link>
        <div className="allRatings">
        {ratings.map((element, idx) => {
          return <span className="user-info-holder"><div className="user-card ratings" key={idx}>
              {console.log(element)}
              <button className="buttons" onClick={() => handleRemove(element.objectId)}>Delete?</button>
                  <Rating value={element.rating} readOnly/>
                  <h2 className="skill">{element.review}</h2>
                  <p className="skill">Comment left on <Link to={`/product/${element.productId}`}>this product</Link></p>
                    {/* <p>{element.rating}</p> */}
                </div></span>
        })}
      </div>
        </>
    )
}
