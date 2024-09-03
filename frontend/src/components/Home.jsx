import { useEffect, useState } from 'react';
import val_gif from './photos/jett.gif';
import React from 'react';
import './Home.css'
import axios from 'axios';
import {useNavigate} from 'react-router-dom'




export const Home =() => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const serverURL = "http://127.0.0.1:8000/api/overview";
    const tokenURL = "http://127.0.0.1:8000/api/token";



    
    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            // const response = await axios.get(serverURL)
            
            /*
            const response = await axios.post(serverURL, {username: username}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRFToken': 'csrfToken',
                }
            });
            */
            
            
            // if (response.status === 200) {
                navigate(`/overview?username=${encodeURIComponent(username)}`);
            // }
            // return response.data
        }
        catch (error) {
            console.error('Error sending data:', error);
        }
    };

   


 


   
    

    return <div>
        <div className="home-items">
            <img src={val_gif} alt="val-gif" className="val-bg"/>
            
            <div className="home-text">
                <h2 className="supp-title">Formulated to Improve Gameplay</h2>
                <h1 className="main-title">VALORANT TRACKER</h1>
                <p className="info-text"> With advance data analytics, track your perfomances with
                    maps, weapons, teammates, and so much more. </p>

                <form onSubmit={handleSubmit} >
                    <input className="input-text" 
                        value={username}  // ...force the input's value to match the state variable
                        placeholder='Name#Tag'
                        onChange={e => setUsername(e.target.value)} // ... and update the state variable on any edits!
                    />
                    <button type="submit">Submit</button>
                </form>
                 

                
               
            </div>  
            
        </div>
        


    </div>
};