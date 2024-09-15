
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
    
    const [match, setMatch] = useState(null);
    const [players, setPlayers] = useState([]);




    useEffect(() => {
        const fetchData = async () => {
          try {
            const[response, response2, response3, response4] = await Promise.all ([
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

            ]);
            

            console.log(response4.data);
            

            setUserData(response.data); // set basic user data
            setmmrData(response2.data);  // MMR data
            setPlayerMatches(response3.data.data); // match history data

            // console.log(userData.data.name)
            setUser(response.data.data.name) // set user to username of player

      
            // set user team -> if user's team has won, output won-lost(score) Else(team lost), output lost-won(score) 


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
                        {playerMatches.map((match)  => {
                          let userTeam = null;
                          let userTeamWon = false;

                          match.players.all_players.forEach((player) => {
                            if (player.name === user) {
                              userTeam = player.team; // This will be either "Red" or "Blue"
                            }
                          });
                          

                          // check if user team has won
                          if (userTeam == "Red") {
                              userTeamWon = match.teams.red.has_won;
                          }

                          else if (userTeam == "Blue") {
                            userTeamWon = match.teams.blue.has_won;
                          }

                          // Get the rounds won and lost for the user's team
                          const userRoundsWon = userTeam === "Red" ? match.teams.red.rounds_won : match.teams.blue.rounds_won;
                          const opponentRoundsWon = userTeam === "Red" ? match.teams.blue.rounds_won : match.teams.red.rounds_won;

                          return (
                          <div key={match.id} className="match-card">
                            <h3> Matches: {match.metadata.map}</h3>
                            <h3> Date: {match.metadata.game_start_patched} </h3>
                            <h3> Mode: {match.metadata.mode} </h3>
                            <h3> Team: {userTeam}</h3>
                            <h3>Result: {userRoundsWon} - {opponentRoundsWon} </h3>

                            <div> 
                              {match.players.all_players.map((player, playerIndex) => { // player list
                              
                                if (player.name == user) {
                                  let KD_ratio = player.stats.kills/player.stats.deaths;
                                  KD_ratio = KD_ratio.toFixed(2);

                                  return (
                                    <div key={playerIndex}>
                                      <p> K/D Ratio: {KD_ratio}</p>
                                      <p> K/D/A: {player.stats.kills}/{player.stats.deaths}/{player.stats.assists} </p>
    
                                    </div>
                                  )
                                }
                                
                               
                                })}


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