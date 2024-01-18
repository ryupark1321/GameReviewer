import json
import os
import requests

allGamesLink = 'http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json'
steamDbLink = 'https://steamdb.info/app/'
# dataDirectory = os.environ["DATA"]
dataDirectory = "/home/ryupark1321/Desktop/GameReviewer/src/data"

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
  return games['applist']['apps']

def getGameInfoFromId(id):
  r = requests.get(steamDbLink + "/" + str(id) + "/")  
  print(r.content.decode('utf8'))
  return

def parseAllGames(games):
  gamesDict = {}
  f = open(dataDirectory + '/parsedGames.txt', 'wb')
  for game in games:
    name = game['name']
    id = game['appid']
    if name == '' or name == 'test2' or name == 'test3' or name == 'Pieterw test app76 ( 216938 )':
      continue
    info = getGameInfoFromId(id)
    gamesDict[id] = name
  f.write(json.dumps(gamesDict))
  f.close()
    
grabAllGames()
games = readAllGames()
parseAllGames(games)