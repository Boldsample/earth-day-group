import React from 'react'
import './registerUser.sass'
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";


const RegisterUser = () => {
  return (
    <div className='layout'>
        <div className='main__content'>
            <h5 id='hello'>Profile Picture</h5>
            <p>Click to upload</p>
            <div className='registerInput__container'>
                <InputText
                    id="name"
                    placeholder="Complete Name*"
                    // value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputText
                    id="email"
                    placeholder="E-mail*"
                    // value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className='registerInput__container'>
              <InputText
                id="username"
                placeholder="Username*"
                // value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
               <InputText
                id="location"
                placeholder="Location*"
                // value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
              <label htmlFor="bio">Bio
                <InputText
                    id="bio"
                    placeholder="Tell us about yourself"
                    // value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label htmlFor="phoneNumber">Phone Number
                    <InputText
                        id="phoneNumber"
                        placeholder="++01 0000 000*"
                        // value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
              </label>
              <div className='registerInput__container'>
                <label htmlFor="password">Password
                        <InputText
                            id="password"
                            placeholder="Enter Password"
                            // value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                </label>
                <InputText
                    id="password"
                    placeholder="Confirm Password"
                    // value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /> 
            </div>
        </div>
    </div>
  )
}

export default RegisterUser