import axios from "axios"
import { useState, useEffect } from "react"

export default function ImageScraping({productId, productCategory}) {

    let access_key = "OJ1_O3gxEMgtAVf2L-KeKlKbXNVBdQrHe8zWKQvvsYc"

    const [images, setImage] = useState("")


    async function fetchImages(query) {
        const images = await axios.get(`https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${access_key}`)
        console.log("IMAGES!", images.data.results[0].urls)

        // add these images to backend
        axios.post(`http://localhost:3001/add_image`, {

            "productId": productId,
            "imageRegular": images.data.results[0].urls.regular,
            "imageRaw": images.data.results[0].urls.raw
        })
    }

    async function getImages(query) {
        let resp = await axios.get(`http://localhost:3001/get_images/${productId}`)
        console.log("RESP!", resp.data)
        if (resp.data.posts.data) {
            console.log("data does not exist")
            let newCategory = productCategory.replace(" ", "%20").replace(",", "%2C").replace("/", "%2F").replace("&", "%26").replace('"', "%22")
            fetchImages(newCategory)
        } else {
            console.log("data does exist", resp.data.posts.imageRaw)
            await setImage(resp.data.posts.imageRaw)
        }
    }

    useEffect(() => {
        getImages(productCategory)
    }, [])

return (
    <>
        <img src={images + "&w=100&dpr=2"}/>
    </>
)
}
