import * as React from "react"
import LoginForm from "../LoginForm/LoginForm"
import RegisterForm from "../RegisterForm/RegisterForm"
import "./LoggedOutView.css"
import { useState } from "react"



// const AboutUs = () => {
//     const [selected, setSelected] = useState('');
  
//   const showSelectedOption = () => {
//     switch(selected) {
//       case 'details':
//         return  <PersonalDetails />;
//       case 'bio':
//         return  <ProfileBio />;
//       case 'qualif':
//         return  <ProfileQualifications />;
//       default:
//         return '';
  
//     }
//   }
  
//   return (
//      <Button onClick={() => setSelected('details')}>Personal Details</Button>
//      <Button onClick={() => setSelected('bio')}>Bio</Button>
//      <Button onClick={() => setSelected('qualif')}>Qualifications</Button>
  
//      Container className={classes.container}>
//         {showSelectedOption()} 
//      </Container>
//     );
//   };

export default function LoggedOutView({isLoggedIn, handleLogin}) {
    const [selected, setSelected] = useState('logIn');

    const showSelectedOption = () => {
        switch(selected) {
            case 'signUp':
            return  <RegisterForm handleLogin={handleLogin} />;
            case 'logIn':
            return   <LoginForm handleLogin={handleLogin} />;
            default:
            return <LoginForm handleLogin={handleLogin} />;
        }
    }
    return (
        <div>
            {showSelectedOption()}
            <p>{selected == "signUp" ? "Already have an account?" : "Don't have an account yet?"}</p>
            <button onClick={() => setSelected(selected === "signUp" ? 'logIn':"signUp")}>{selected == "signUp" ? "Log in!" : "Sign up!"}</button>
        </div>
    )
}