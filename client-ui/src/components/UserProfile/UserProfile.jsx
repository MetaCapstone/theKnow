// capabilities:
//    profile (height, weight, etc.) <- should be able to update it, not add it, etc.
//    list of all of their ratings, ability to delete them
import axios from "axios";
import {Link} from "react-router-dom"
import "./UserProfile.css"
import {useState, useEffect} from "react"

export default function UserProfile({user}) {

    const [userInfo, setUserInfo] = useState([])
    const [refetch, setRefetch] = useState(false)

    async function submitForm() {
        let firstName = document.getElementById("firstName").value;
        let lastName = document.getElementById("lastName").value;
        let height = document.getElementById("height").value;
        let weight = document.getElementById("weight").value;
        let gender = document.getElementById("gender").value;

        console.log("HERE")

        const res = await axios.post(`http://localhost:3001/userProfile`, {
          "userId" : user.user.objectId,
          "firstName" : firstName,
          "lastName" : lastName,
          "height" : height,
          "weight" : weight,
          "gender" : gender
        })

        console.log("DONE!")
        setRefetch(!refetch)
    }

    function handleTheSubmit() {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        signUpButton.addEventListener('click', () => {
          container.classList.add("right-panel-active");
        });

        signInButton.addEventListener('click', () => {
          container.classList.remove("right-panel-active");
        });
    }

    useEffect(() => {
        if (user.user) {
            getData(user.user.objectId)
        }
    }, [])


    async function getData(userId) {
        let resp = await axios.get(`http://localhost:3001/userProfile/${userId}`)
        console.log("RESP!", resp.data.posts)
        setUserInfo(resp.data.posts)
    }

    if (!user.user) {
        return (
            <p> Not logged in. Log in to view your user profile!</p>
        )
    } else {
        return (
        <div className="container" id="container">
            <div className="form-container sign-up-container">
                <form action="#">
                <h1>Edit User Profile</h1>
                    <br></br>
                <span>Name</span>
                    <input id="firstName" type="text" placeholder="first name"/>
                    <input id="lastName" type="text" placeholder="last name"/>

                    <h2>Basic Health Information</h2><br></br>

                        <span>Height (in feet)</span><br></br>

                            <select id="height">
                                <option value={3}> less than 3</option>
                                <option value={3}>3'</option>
                                <option value={4}>4'</option>
                                <option value={5}>5'</option>
                                <option value={6}>6'</option>
                                <option value={7}>more than 6'</option>
                            </select>
                            <br></br>
                            <span>Weight</span>

                            <input id="weight" type="text" placeholder="lbs"/><br/>

                            <span> Sex </span><br></br>
                            <select id="gender">
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                </form>
                <button id="submit" className="buttons" onClick={() => submitForm()}> Submit</button>
            </div>

            <div className="form-container sign-in-container">
                <div id="name">
                <div class=" userProfile user-card">
                <span class="user-info-holder">
                    <h2 class="name">{userInfo.firstName} {userInfo.lastName}</h2>
                    <span class="skill">{userInfo.height} feet tall</span>
                    <span class="skill">{userInfo.weight} lbs</span>
                    <span class="skill">Sex: {userInfo.gender}</span>
                </span>
                </div>
            </div>
        </div>

        <div className="overlay-container">
            <div className="overlay">
                <div className="overlay-panel overlay-left">
                    <h1>View your profile</h1>
                    <button onClick={handleTheSubmit} className="user buttons ghost" id="signIn">Your Profile</button>
                </div>
                <div className="overlay-panel overlay-right">
                    <h1> Change your user information?</h1>
                    <button onClick={handleTheSubmit} className="user buttons ghost" id="signUp">Edit User Information</button>
                </div>
            </div>
        </div>
        </div>
)


        // return(
        //     <div className="userProfile">
        //         <h1>Profile Information:</h1><br/>

        //         <label>Name</label>

        //         <input id="firstName" type="text" placeholder="first name"/><br/>
        //         <input id="lastName" type="text" placeholder="last name"/>

        //         <label>Basic Health Information</label>

        //                 <form action="#">
        //                     <label>Height</label>
        //                         <label>Feet</label>
        //                         <select id="height">
        //                             <option value={3}> less than 3</option>
        //                             <option value={3}>3'</option>
        //                             <option value={4}>4'</option>
        //                             <option value={5}>5'</option>
        //                             <option value={6}>6'</option>
        //                             <option value={7}>more than 6'</option>
        //                         </select>

        //                         <label>Weight</label>

        //                         <input id="weight" type="text" placeholder="lbs"/><br/>

        //                         <label> Sex </label>
        //                         <select id="gender">
        //                             <option value="M">Male</option>
        //                             <option value="F">Female</option>
        //                         </select>
        //                 </form>

        //         <button onClick={() => submitForm()}>Submit</button>
        //         <Link to="/userRatings">Go to your ratings</Link>
        //     </div>
        // )
        }
    }
