import {useState} from "react"
import "./Ratings.css"
import { Rating } from '@mui/material';

export default function Ratings({ratings, avg, count}) {

    const [add, setAdd] = useState(false)
    async function handleRemove() {
        try {
          const res = await axios.post(`http://localhost:3001/remove_rating`, {
            "user" : props.user,
            "productId" : props.product.fdcId
          })
        } catch (err) {
          alert("Failed to delete rating. Make sure you are logged in! ", err);
        }
        setAdd(prev => !prev)
      }

    return (

        <div className="allRatings">
          <br></br><br></br>
        <h4 class="count">{count} Ratings</h4>
        <h1>Ratings! <Rating value={avg} readOnly/></h1>
        <br></br><br></br>
        {ratings.map((element, idx) => {
          return <span className="user-info-holder"><div className="user-card ratings" key={idx}>
            <h2 className="skills">{element.user}</h2>
                  <Rating value={element.rating} readOnly/>
                  <h2 className="skill">{element.review}</h2>
                </div></span>
        })}
      </div>
    )


}
