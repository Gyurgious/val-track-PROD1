
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
    const [mmrData, setmmrData] = useState(null);
    const [playerMatches, setPlayerMatches] = useState([]);

    const [match, setMatch] = useState(null);
    const [players, setPlayers] = useState([]);




    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get("http://127.0.0.1:8000/api/overview", { 
              params: {
                user: username, // Ensure the user is correctly formatted
                tag:playerTag,
              }
            });

            const response2 = await axios.get("http://127.0.0.1:8000/api/mmr", {
              params: { 
                user: username, tag:playerTag }, 
             
          });

          const response3 = await axios.get("http://127.0.0.1:8000/api/matches", {
            params: { user: username, tag:playerTag }, 
           
          });

          const response4 = await axios.get("http://127.0.0.1:8000/api/cur_match", {
            params: { user: username, tag:playerTag }, 
           
          });

            // console.log(response3.data);
            

            setUserData(response.data);
            setmmrData(response2.data);
            setPlayerMatches(response3.data.data);

      

            console.log(playerMatches[0].players.all_players)



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
                      </div>


                      <div className="match-hist">
                        {playerMatches.map((match)  => (
                          <div key={match.id} className="match-card">
                            <h3> Matches: {match.metadata.map}</h3>
                            <h3> Date: {match.metadata.game_start_patched} </h3>
                            <h3> Mode: {match.metadata.mode} </h3>
                            <h3> Team: {match.players.all_players[1].team}</h3>
                            <h3> Result: {match.teams.red.rounds_won} - {match.teams.blue.rounds_won}</h3>
                            
                          </div>
                        ))}
                      </div>

                    </div>
                  

                    

            
                    

                
                    
                   
                </div>
            ) : (
                <p>Loading...</p>
           )}

    </div>
};