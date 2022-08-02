import {useState} from "react"

export default function Ratings({ratings}) {

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
        <h1>Ratings!</h1>
        {ratings.map((element, idx) => {
          return <div key={idx}>
              {/* <button onClick={handleRemove()}> Delete</button> */}
                {/* <div className={add ? "hidden" : ""}> */}
                <h2>{element.user}</h2>
                    <p>{element.rating}</p>
                    <p>{element.review}</p>
                {/* </div> */}
              </div>
        })}
      </div>
    )
}
