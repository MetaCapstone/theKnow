import * as React from "react"
import { useState } from "react"
import axios from "axios"
import ProductGrid from "../ProductGrid/ProductGrid";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
    let url = 'https://foodrepo.org/api/v3/products'
    let access_token = "6f0b9fe7724f37e253a375f5152cbb34";
    const [products, setSelectedProducts] = useState([])
    console.log('products: ', products);
    //const [page, setPage] = useState(1)
    let page = 1

    async function loadMorePages() {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
            console.log("SCROLL :" + page)
            page = page + 1
            let page_url = url + `?page%5Bnumber%5D=${page}` 
            const response = await axios.get(page_url, {
            headers: {
                'Authorization': `Token token=${access_token}`,
            }
            }).catch((err) => console.log(err))

            // let temp = [...products]
    
            setSelectedProducts(products => [...products, ...response.data.data])
            // temp.push(item)
            
        }
        
    }

    useEffect(() => {
        window.addEventListener('scroll', loadMorePages)

        return () => window.removeEventListener('scroll', loadMorePages)
    }, [])

    // fetches data from api to display
    async function fetchData() {

        const response = await axios.get('https://foodrepo.org/api/v3/products', {
        headers: {
            'Authorization': `Token token=${access_token}`
        }
        }).catch((err) => console.log(err))

        setSelectedProducts(response.data.data)
    }
    React.useEffect(()=>{
      fetchData()
    },[])

    return (
        <BrowserRouter>
        <Routes>
            {/* <Route path="/product/:productId" element={<ProductDetail product={products}/>}/> */}

            <Route path="/" element={<ProductGrid products={products} />}/>
            {/* <Route path="*" element={<NotFound/>}/> */}
        </Routes>
        </BrowserRouter>
    )
  }


  

//   let access_token = "6f0b9fe7724f37e253a375f5152cbb34";

//   axios.get('https://foodrepo.org/api/v3/products', {
//   headers: {
//     'Authorization': `Token token=${access_token}`
//   }
// })
// .then((res) => {
//   console.log(res.data)
// })
// .catch((error) => {
//   console.error(error)
// })
// }
  

