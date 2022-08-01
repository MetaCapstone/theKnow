import "./Loading.css"
import React from "react";
import ReactLoading from "react-loading";
//import "bootstrap/dist/css/bootstrap.css";

export default class Loading extends React.Component {
    constructor(props){
       super(props)
    }
    render() {
        return (
           <div className="centered">
                <h1>Loading</h1>
                <ReactLoading type={"bars"} color={"Black"} />
           </div>
        )
     }
 }
