import React, { useState, useEffect } from "react"
import axios from "axios"
import ProductCard from "../ProductCard/ProductCard"

export default function UserRecommendations({user, likedProducts}) {

    const [data, setData] = useState([])
    const [productState, setProductState] = useState([])

    async function toRecommend() {
        const res = await axios.get(`http://localhost:3001/recommendations/UsertoUser/${user.user.objectId}`)
        let arr = res.data.posts.reduce((acc, val) => acc.concat(val), []);
        arr = arr.reduce((acc, val) => acc.concat(val), []);

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        var unique = arr.filter(onlyUnique);
        let unique2 = unique.filter( function( el ) {
            return likedProducts.indexOf( el ) < 0;
          } );
        setData(unique2)
        unique2.map((element) => {
            getData(element)
        })
    }

    let access_token="bdJjin59zDuhXSARWy1Gu6M642AeZa2J9VIdqwib"
    async function getData(token) {
          let response = await axios.get(`https://api.nal.usda.gov/fdc/v1/food/${token}?&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB&pageSize=20`,
          { headers: {
            'Authorization': `api_key=${access_token}`,
          }
          }).catch((err) => console.log(err))
          if (response) {
              setProductState((prevState) => [...prevState, response.data])
          }
      }


    useEffect(() => {
        toRecommend()
        setProductState([])
    }, [])
    // For products a user likes, see if other users liked that product, generate list of other products the users liked, display them for the current user
    return (<>
        <h1>Users also liked:</h1>
        {productState.slice(0,10).map((element, idx) => {
            return <ProductCard user={user} key={idx} product={element} setProducts={setData} likedProducts={likedProducts}></ProductCard>
        })}

    </>)
}
