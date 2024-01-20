import cohere
import json
import os
import requests
import time

allGamesLink = 'http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json'
# dataDirectory = os.environ["DATA"]
dataDirectory = "/home/ryupark1321/Desktop/GameReviewer/backend/src/data"
reviewLink = 'https://store.steampowered.com/appreviews/'
invalidNames = ['', 'test2', 'test3', 'Pieterw test app76 ( 216938 )']
#API_KEY = os.environ["COHERE_API_KEY"]
#co = cohere.Client(API_KEY)

def grabAllGames():
  r = requests.get(allGamesLink) 
  f = open(dataDirectory + "/games.txt", "wb")
  f.write(r.content)
  f.close()

def readAllGames():
  f = open(dataDirectory + "/games.txt", "rb") 
  text = f.read()
  games = json.loads(text.decode('utf8'))
  f.close()
  return list(filter(filterGames, games['applist']['apps']))

def get_reviews(appid, params={'json':1}):
  url = 'https://store.steampowered.com/appreviews/'
  response = requests.get(url=url+appid, params=params, headers={'User-Agent': 'Mozilla/5.0'})
  return response.json()

def get_n_reviews(appid, n=100):
  reviews = []
  cursor = '*'
  params = {
    'json' : 1,
    'filter' : 'all',
    'language' : 'english',
    'day_range' : 9223372036854775807,
    'review_type' : 'all',
    'purchase_type' : 'all'
  }
  while n > 0:
    params['cursor'] = cursor.encode()
    params['num_per_page'] = min(100, n)
    n -= 100
    response = get_reviews(appid, params)
    cursor = response['cursor']
    reviews += response['reviews']
    if len(response['reviews']) < 100: break
  return reviews

def filterGames(game):
  name = game['name']
  return not (name in invalidNames)

def storeAllGameReviews(games):
  gamesDict = {}
  for game in games:
    name = game['name']
    id = game['appid']
    reviews = get_n_reviews(id, n=100)
    # Store in db
    summary = co.summarize(
      text=reviews,
      length='auto',
      format='auto',
      model='summarize-xlarge',
      additional_command='Generate a summary that summarizes the reviews provided.',
      temperature=0.1,
    )
    # Store summary in db
    time.sleep(10)
    
#grabAllGames()
#games = readAllGames()
print("*".encode())