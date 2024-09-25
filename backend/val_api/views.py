from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
# Create your views here.


import requests
import json


# importing os module for environment variables
import os
# importing necessary functions from dotenv library
from dotenv import load_dotenv, dotenv_values 
# loading variables from .env file
load_dotenv() 
 
# accessing and printing value


API_KEY = os.getenv("API_KEY")


def get_account_data(request):
    user = request.GET.get('user', '')
    tag = request.GET.get('tag', '')
    print(user + tag)

    val_API = f"https://api.henrikdev.xyz/valorant/v1/account/{user}/{tag}"
    # mmr_data = f"https://api.henrikdev.xyz/valorant/v2/mmr/na/{user}/{tag}"


    headers = {
        'Authorization': API_KEY,
    }

    try:
        response = requests.get(val_API, headers=headers)
        response.raise_for_status()
        return JsonResponse(response.json())
    except requests.exceptions.HTTPError as http_err:
        return JsonResponse({"error": f"HTTP error occurred: {http_err}"}, status=response.status_code)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": str(e)}, status=response.status_code)

def get_mmr_data(request):
    user = request.GET.get('user', '')
    tag = request.GET.get('tag', '')


    mmr_data = f"https://api.henrikdev.xyz/valorant/v2/mmr/na/{user}/{tag}"



    headers = {
    'Authorization': API_KEY,
    }

    try:
        response = requests.get(mmr_data, headers=headers)
        response.raise_for_status()
        return JsonResponse(response.json())
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": str(e)}, status=response.status_code)
    
def get_match_hist(request):
    user = request.GET.get('user', '')
    tag = request.GET.get('tag', '')

    match_data = f"https://api.henrikdev.xyz/valorant/v3/matches/na/{user}/{tag}"



    headers = {
        'Authorization': API_KEY,
    }

    try:
        response = requests.get(match_data, headers=headers)
        response.raise_for_status()
        return JsonResponse(response.json())
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": str(e)}, status=response.status_code)
    

def get_match_data(request):
    match_id = "abf21ba9-40b0-4a61-b799-90e923b3957e"

    match_data = "https://api.henrikdev.xyz/valorant/v4/match/na/abf21ba9-40b0-4a61-b799-90e923b3957e"
    
    headers = {
        'Authorization': API_KEY,
    }

    try:
        response = requests.get(match_data, headers=headers)
        response.raise_for_status()
        return JsonResponse(response.json())
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": str(e)}, status=response.status_code)
    

def get_processed_data(request):
    user = request.GET.get('user', '')
    tag = request.GET.get('tag', '')

    match_api = f"https://api.henrikdev.xyz/valorant/v3/matches/na/{user}/{tag}"

    headers = {
        'Authorization': API_KEY,
    }

    try:
        response = requests.get(match_api, headers=headers)
        response.raise_for_status()
        match_data = response.json()

        processed_data = []

        for match in match_data['data']:
            user_map = match['metadata']['map']
            user_mode = match['metadata']['mode']
            user_match_start = match['metadata']['game_start_patched'] # fix time(late by 6 hours)
            user_team = None
            user_rounds_won = 0
            opponent_rounds_won = 0



            for player in match['players']['all_players']:
                if player['name'] == user:
                    user_team = player['team']
                    print(user_team)
                    break;
    
            if user_team:
                if user_team == "Red":
                        user_rounds_won = match['teams']['red']['rounds_won']
                        opponent_rounds_won = match['teams']['blue']['rounds_won']
                else:
                    user_rounds_won = match['teams']['blue']['rounds_won']
                    opponent_rounds_won = match['teams']['red']['rounds_won']

                processed_data.append({
                    'score': f"{user_rounds_won} - {opponent_rounds_won }",
                    'team': user_team,
                    'map': user_map,
                    'time_start': user_match_start,
                    'mode': user_mode

                })

        return JsonResponse({'data': processed_data}, safe=False)
        
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": str(e)}, status=response.status_code)




