import * as React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import ReactLoading from "react-loading";
import axios from "axios"
import "./ProductDetail.css"
import Loading from "../Loading/Loading.jsx"

export default function ProductDetail(props) {
    const params = useParams();
    const [productState, setProductState] = useState({})
    let string = ""

    // Get link for grabbing specific product info based on FDCId: const params = useParams();

   // getting data for the specific product that has been clicked on
   let access_token="oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB"
    async function getData() {

        let response = await axios.get(`https://api.nal.usda.gov/fdc/v1/food/${params.productId}?&api_key=oDWPyC6zdMmMtm1ZtHe7prk8I18ZaFR5ShQ7QpYB&pageSize=20`,
        { headers: {
          'Authorization': `api_key=${access_token}`,
        }

        }).catch((err) => console.log(err))
        if (response) {
            console.log("HERE!!", response)
            console.log(props.isFetching)
            setProductState(response.data)
        }

    }
    React.useEffect(()=>{
        props.setIsFetching(true)
        getData()
        props.setIsFetching(false)
        //string = json_tree(productState.labelNutrients)
      },[])

    // function json_tree(data) {
    //   console.log("data", data)
    //   var json = "";
    //   for (var element in data) {
    //     json = json + "\n" + element + ":" + data[element].value;
    //     //console.log("element:", element)
    //     //console.log("data of element", data[element].value)
    //   }
    //   // data?.forEach(element => {
    //   //     console.log("element:", element)
    //   //     //console.log("data[i]:", data[i])
    //   //     json = json + "<li>" + element.value;
    //   //     json = json + "</li>";
    //   // })
    //   return json;
    // }

    return (
      <div>
      {props.isFetching ? <><h1>Loading</h1><ReactLoading type={"bars"} color={"Black"} /></>:
        (productState===undefined) ? <h1>Not found!</h1> : //<NotFound error={props.error} /> :
        <div className="product-detail">
        <h1>{productState.description}</h1>
        <h5>{productState.brandOwner}</h5></div>}
        </div>
    )
  }

        {/* <p>{document.getElementsByClassName("product-detail").innerHTML +=
      string}</p></>} */}
