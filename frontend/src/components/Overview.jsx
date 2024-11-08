
import React from 'react';
import axios from 'axios';

import './Overview.css'
import {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'; 

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


export const Overview =() => {
    const query = useQuery();
    const query_user = query.get('username');
    const tagIndex = query_user.indexOf('#');
    const playerTag = query_user.substring(tagIndex+1);
    const username = query_user.substring(0, tagIndex);
    console.log(username);

    const [userData, setUserData] = useState(null);
    const [user, setUser] = useState();
    const [mmrData, setmmrData] = useState(null);
    const [playerMatches, setPlayerMatches] = useState([]);
    const [playerStats, setPlayerStats] = useState(null);
    const [results, setResults] = useState([]);




    useEffect(() => {
        const fetchData = async () => {
          try {
            const[response, response2, response3, response4, response5] = await Promise.all ([
                axios.get("http://127.0.0.1:8000/api/overview", { 
                params: {
                  user: username, // Ensure the user is correctly formatted
                  tag:playerTag,
                }
              }),
  
                axios.get("http://127.0.0.1:8000/api/mmr", {
                  params: { 
                    user: username, tag:playerTag }, 
                
              }),
    
                axios.get("http://127.0.0.1:8000/api/matches", {
                  params: { user: username, tag:playerTag },                 
                }),
      

                axios.get("http://127.0.0.1:8000/api/get-data", {
                  params: { user: username, tag:playerTag }, 
                }),

                axios.get("http://127.0.0.1:8000/api/avg_data", {
                  params: { user: username, tag:playerTag }, 
                }),

            ]);
            
            
            console.log(response2.data);
            console.log(response3.data);
            console.log(response4.data);
            console.log(response5.data);
            
            

            setUserData(response.data); // set basic user data
            setmmrData(response2.data);  // MMR data
            setPlayerMatches(response4.data.data); // match history data
            setPlayerStats(response5.data);
            // setResults(response4.data.data);



            // console.log(userData.data.name)
            setUser(response.data.data.name) // set user to username of player
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        fetchData();
    }, []);
    
    


    return <div className="overview-section">
            {userData ? (
                <div>
                    <div className="basic-info">
                      <h2>Player Info</h2>
                      <img src={userData.data.card.small} className="player-card"/>
                      <p className="player-name">Name: {userData.data.name}</p>
                      <p className="player-level">Account Level: {userData.data.account_level}</p>
                    </div>

                    <div className="comp-info">
                      <div className="mmr-info"> 
                        <h1>Competitive Info</h1>
                        <h2>Current Rank: {mmrData.data.current_data.currenttierpatched}</h2>
                        <img src={mmrData.data.current_data.images.small} />
                        <h2>Peak Rank: {mmrData.data.highest_rank.patched_tier}</h2>
                        <h3>Season: {mmrData.data.highest_rank.season}</h3>
    

                        <div className="avg-stats-info">
                            <h2> HS: {playerStats.user_hs}%</h2>
                            <h2> Winrate: {playerStats.user_wr}%</h2>
                            <h2> K/D: {playerStats.user_kd} </h2>

                           
                        </div>
                      </div>




                      <div className="match-hist">
                        {playerMatches.map((match)  => {
                          
                          

                          
                          return (
                          <div key={match.map} className="match-card">
                            <div className="player-agent"> 
                              <img src= {match.Omen} className="agent-pic" alt="omenpic"/>
                              <h3> Agent: {match.agent}</h3>
                            </div>

                            <div className="player-stats">
                              <h3> Map: {match.map}</h3>
                              <h3> Date: {match.time_start}</h3>
                              <h3> Mode: {match.mode} </h3>
                              <h3> Result: {match.score}</h3>
                              <p> KDA: {match.kills}/{match.deaths}/{match.assists}</p>
                              <p> Headshot Percentage: {match.headshot_percentage}%</p>

                             </div>

                             <div className="analyze-button"> 
                              <h2>Analyze Match</h2>


                             </div>

                                           
                          </div>
                          );
                        })}
                      </div> 

                    </div>  
                </div>
            ) : (
                <p>Loading...</p>
           )}

    </div>
};