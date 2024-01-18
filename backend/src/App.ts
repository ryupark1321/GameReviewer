import express, { Express, Request, Response } from "express";
const axios = require('axios');

const app: Express = express();
const PORT: number = 3000;
const allGamesLink: String = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
const gameDetailLink: String = 'https://store.steampowered.com/api/appdetails?appids=';


app.get("/", function (req: Request, res: Response) {
  res.status(200);
});

app.get("/games/all", function (req: Request, res: Response) {
  axios.get(allGamesLink).then(resp => {
    res.json(resp.data['applist']['apps']);
  });
});

app.get("/games/:id", async (req: Request, res: Response) => {
  const id: number = req.params.id; 
  try {
    let resp: Response = await axios.get(gameDetailLink + id.toString());
    let data: Object = resp.data;
    res.json(data);
  } catch (error) {
    res.json([{'success' : false}]);
  }
}); 

app.get("/games/:id/reviews", async (req: Request, res: Response) => {
  const id: number = req.params.id;
});

app.listen(PORT, () => {
	console.log(`Server is running at ${PORT}`);
});
