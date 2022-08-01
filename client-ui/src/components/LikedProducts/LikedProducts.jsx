import {useEffect, useState} from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import "./LikedProducts"

export default function LikedProducts({user, setIsFetching, isFetching}) {

    console.log("HERE IN LIKED PRODUCTS")

    const [data, setData] = useState([])

    async function viewProducts() {
        setIsFetching(true)
        console.log(user)
        const res = await axios.get(`http://localhost:3001/products/${user.user.objectId}`)
        setIsFetching(false)
        setData(res.data.posts)
    }
    useEffect(() => {
        viewProducts()
    }, [])

    return (
        <div>
        {data.map((element) => {
            return <Link to={`/product/${element}`}></Link>
        })}
        <h1>LIKED PRODUCTS</h1>
        </div>
    )
}
