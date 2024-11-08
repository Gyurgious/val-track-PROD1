
import requests
import os
# importing necessary functions from dotenv library
from dotenv import load_dotenv, dotenv_values 
# loading variables from .env file
load_dotenv() 
 
# accessing and printing value


API_KEY = os.getenv("API_KEY")


def get_death_location(player, match, cur_round): # get death location of defenders trying to take site
    combat_data = match['kills']
    

    for kills in combat_data:
        victim = kills['victim_display_name']
        killer = kills['killer_display_name']
        locations = kills['player_locations_on_kill']

        if (cur_round-1 == kills['round']):
            if (victim == player):
                print(f"cur round is {cur_round} and victim is {victim}. killer is {killer}")
                for sigma in locations:
                    if (sigma['player_display_name'] == killer):
                        x_loc = sigma['location']['x']
                        y_loc = sigma['location']['y']
                        print(f"{x_loc}, {y_loc}")
           






def get_processed_data(user, tag):

    if not API_KEY:
        raise ValueError("API_KEY is missing. Set it as an environment variable.")

    match_api = f"https://api.henrikdev.xyz/valorant/v3/matches/na/{user}/{tag}"

    headers = {
        'Authorization': API_KEY,
    }

    try:
        response = requests.get(match_api, headers=headers)
        response.raise_for_status()
        match_data = response.json()


      
        processed_data = []
        round_data = []
        charac = "./photos/omen-1.png"


        # calculate average stats
        user_avg_hs = 0
        user_total_wins = 0
        user_total_deaths = 0
        user_total_kills = 0

        win_post_plant = ['Eliminated', 'Bomb detonated']


        for match in match_data['data']:
            combat_data = match['kills']
            user_map = match['metadata']['map']
            user_mode = match['metadata']['mode']
            user_match_start = match['metadata']['game_start_patched'] # fix time(late by 6 hours)


            victim = combat_data[0]['victim_display_name']
            print(f"bozo is {victim}")

          
            user_team = None
            user_rounds_won = 0
            opponent_rounds_won = 0

            attack_team = None
            defend_team = None
            cur_round = 0 # initialize round for each game match
            for round in match['rounds']:
                cur_round += 1
                if cur_round <= 12:
                    attack_team = "Red"
                else:
                    attack_team = "Blue"

                attacker_alive = 0
                defender_alive = 0
                if round['bomb_planted'] == True: # post-plant
                    for player in round['plant_events']['player_locations_on_plant']:
                        player_name = player['player_display_name']


                        if player['player_team'] == attack_team:
                            attacker_alive += 1
                            print("current round is " + str(cur_round) + " " + player_name)
                
                        else:
                            defender_alive += 1
                            get_death_location(player_name, match, cur_round)

                    print(f"attackers: {attacker_alive} defenders: {defender_alive}")
                    if (round['bomb_defused'] == False):
                        print("Won postplant")
                    else:
                        print("Loss postplant")
                    
            
                    
       

            if user_team:
                if user_team == "Red":
                        user_rounds_won = match['teams']['red']['rounds_won']
                        opponent_rounds_won = match['teams']['blue']['rounds_won']
                else:
                    user_rounds_won = match['teams']['blue']['rounds_won']
                    opponent_rounds_won = match['teams']['red']['rounds_won']

                user_wins = 0
                if (user_rounds_won > opponent_rounds_won):
                    user_total_wins += 1

                
                
                print("user hs is " + str(user_avg_hs))

                processed_data.append({
                    'score': f"{user_rounds_won} - {opponent_rounds_won }",
                   
                })


   

    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")



# main code
user = "Winter"
tag = "BIAS"
get_processed_data(user, tag)