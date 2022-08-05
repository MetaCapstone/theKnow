import React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Rating } from '@mui/material';
import ReactLoading from "react-loading"

export default function HealthRating({user, product, getRatingExists, addRating}) {
    const params = useParams();
    const [rating, setRating] = useState(0)
    const [isFetched, setIsFetched] = useState(false)

    async function getRating() {
        setIsFetched(true)
        let resp = await axios.get(`http://localhost:3001/healthRatings/${params.productId}/${user.user ? user.user.objectId : undefined}`)
        setRating(resp.data.posts)
        setIsFetched(false)
    }

    React.useEffect(() => {
        getRating()
    }, [user])

    if (isFetched) {
        return (<><h1>Loading</h1>
        <ReactLoading type={"bars"} color={"Black"} /></>)
      } else {
        return (
            <div>
            <p>Health:</p>
            <Rating value={rating} readOnly/>
            </div>
        )
    }

}
