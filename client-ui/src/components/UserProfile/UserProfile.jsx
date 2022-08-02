// capabilities:
//    profile (height, weight, etc.) <- should be able to update it, not add it, etc.
//    list of all of their ratings, ability to delete them
import axios from "axios";
import {Link} from "react-router-dom"
import "./UserProfile.css"
export default function UserProfile({user}) {

    async function submitForm() {
        let firstName = document.getElementById("firstName").value;
        let lastName = document.getElementById("lastName").value;
        let height = document.getElementById("height").value;
        let weight = document.getElementById("weight").value;
        let gender = document.getElementById("gender").value;

        const res = await axios.post(`http://localhost:3001/userProfile`, {
          "userId" : user.user.objectId,
          "firstName" : firstName,
          "lastName" : lastName,
          "height" : height,
          "weight" : weight,
          "gender" : gender
        })

        console.log("DONE!")
        // add "Thank you" to inner HTML of element

    }



    return(
        <div className="userProfile">
            <h1>Profile Information:</h1><br/>

            <label>Name</label>

            <input id="firstName" type="text" placeholder="first name"/><br/>
            <input id="lastName" type="text" placeholder="last name"/>

            <label>Basic Health Information</label>

                    <form action="#">
                        <label>Height</label>
                            <label>Feet</label>
                            <select id="height">
                                <option value={3}> less than 3</option>
                                <option value={3}>3'</option>
                                <option value={4}>4'</option>
                                <option value={5}>5'</option>
                                <option value={6}>6'</option>
                                <option value={7}>more than 6'</option>
                            </select>

                            <label>Weight</label>

                            <input id="weight" type="text" placeholder="lbs"/><br/>

                            <label> Sex </label>
                            <select id="gender">
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                    </form>

            <button onClick={() => submitForm()}>Submit</button>
            <Link to="/userRatings">Go to your ratings</Link>
        </div>
    )
}
