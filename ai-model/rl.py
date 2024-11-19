
import requests
import os
# importing necessary functions from dotenv library
from dotenv import load_dotenv, dotenv_values 
# loading variables from .env file
load_dotenv() 
 
# accessing and printing value


API_KEY = os.getenv("API_KEY")


def get_attacker_location(player, match, cur_round): # get location of attackers that won post-plant
    combat_data = match['kills']
    

    for kills in combat_data:
        victim = kills['victim_display_name']
        killer = kills['killer_display_name']
        locations = kills['player_locations_on_kill']

        if (cur_round-1 == kills['round']):
            if (victim == player):
                # print(f"cur round is {cur_round} and victim is {victim}. killer is {killer}")
                for sigma in locations:
                    if (sigma['player_display_name'] == killer): # show location of attacker in sucessful position
                        x_loc = sigma['location']['x']
                        y_loc = sigma['location']['y']
                        if x_loc is not None and y_loc is not None:
                            return {
                                'attacker': killer,
                                'locations': {'x': x_loc, 'y': y_loc}
                            }
                    
    return None # if no defenders are eliminated during this round.

def get_attacker_location_lost(player, match, cur_round): # get location of attackers that lost post-plant
    combat_data = match['kills']
    

    for kills in combat_data:
        victim = kills['victim_display_name']
        killer = kills['killer_display_name']
        locations = kills['player_locations_on_kill']

        if (cur_round-1 == kills['round']):
            if (victim == player):
                print(f"cur round is {cur_round} and victim is {victim}. killer is {killer}")
                x_loc = kills['victim_death_location']['x']
                y_loc = kills['victim_death_location']['y']
                if x_loc is not None and y_loc is not None:
                    return {
                        'attacker': victim,
                        'locations': {'x': x_loc, 'y': y_loc}
                    }
                    
    return None # if no attackers are eliminated during this round.






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
        round_info = []
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
                    bomb_site = round['plant_events']['plant_site']
                    bomb_location = round['plant_events']['plant_location']
                    round_info.append({
                        "round": cur_round,
                        "map": user_map,
                        "bomb_site": bomb_site,
                        "plant_location": bomb_location,
                        "attacker_positions": [],
                        "outcome": "win" if not round['bomb_defused'] else "loss"
                    })

                     # track attacker position during post-plant
                    for player in round['plant_events']['player_locations_on_plant']:
                        player_name = player['player_display_name']
            


                        if player['player_team'] == attack_team:
                            attacker_alive += 1
                            if round['bomb_defused'] == True: # lost post-plant
                                bad_loc = get_attacker_location_lost(player_name, match, cur_round)
                                round_info[-1]['attacker_positions'].append(bad_loc)
                
                        else:
                            defender_alive += 1
                            if round['bomb_defused'] == False: # won post-plant
                                good_loc = get_attacker_location(player_name, match, cur_round) 
                                round_info[-1]['attacker_positions'].append(good_loc)

                    print(f"attackers: {attacker_alive} defenders: {defender_alive}")
                    if (round['bomb_defused'] == False):
                        print("Won postplant")
                    else:
                        print("Loss postplant")

                        
                    
            print(round_info)
                    
       

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