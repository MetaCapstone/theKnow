import { Link } from "react-router-dom";
import axios from "axios"
import { useEffect, useState } from "react";

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
        <Link to="/profileCard">Go back to User Profile</Link>
        <p>Here!</p>
        <div className="allRatings">
        {ratings.map((element, idx) => {
          return <div key={idx}>
              {console.log(element)}
              <button onClick={() => handleRemove(element.objectId)}> Delete</button>
                {/* <div className={add ? "hidden" : ""}> */}
                {/* <h2>{element.user}</h2> */}
                    <p>{element.rating}</p>
                    <p>{element.review}</p>
                </div>
            //   </div>
        })}
      </div>
        </>
    )
}
