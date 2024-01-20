import express, { Express, Request, Response } from "express";
import { CohereClient, CohereError, CohereTimeoutError } from "cohere-ai";

const axios = require('axios');
const app: Express = express();
const PORT: number = 3001;
const allGamesLink: String = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
const cohere: CohereClient = new CohereClient({
  token: process.env.COHERE_API_KEY,
});
const gameDetailLink: String = 'https://store.steampowered.com/api/appdetails?appids=';
const gameReviewLink: String = "https://store.steampowered.com/appreviews/";


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

app.get("/games/:id/review", async (req: Request, res: Response) => {
  const id: number = req.params.id;
  let reviewString: string = "";
  let isFullCapacity: Boolean = false;
  let cursor: String = "*";
  for (let i = 0; i < 5; i++) {
    let resp: Response = await axios.post(gameReviewLink + id.toString(), 
      {'User-Agent': 'Mozilla/5.0'},
      {
        params: {
          'cursor': Buffer.from(cursor, "utf-8").toString(),
          'nums_per_page': 100,
          'json' : 1,
          'filter' : 'all',
          'language' : 'english',
          'day_range' : 9223372036854775807,
          'review_type' : 'all',
          'purchase_type' : 'all'
        }
      }
    ); 
    const data: Object = resp.data;
    cursor = data['cursor'];
    data['reviews'].map(reviewObj => {
      isFullCapacity = (reviewString + reviewObj['review']).length >= 100000;
      if (!isFullCapacity) {
        reviewString = reviewString + reviewObj['review'];
      }
    });
    if (isFullCapacity) break;
  }
  if (reviewString === "") {
    res.json({
      success: false, 
      summary: ""
    });
  } else {
    try {
      const summary: string = (await cohere.summarize({
        text: reviewString,
        length: 'short',
        model: 'command-light',
        extractiveness: 'low',
        additionalCommand: 'Generate a summary that summarizes the reviews provided and highlight the strengths and weaknesses.',
        temperature: 0.1,              
      })).summary;
      res.json({
        success: true,
        summary: summary,
      }); 
    } catch (err) {
      if (err instanceof CohereTimeoutError) {
        res.json({
          success: false, 
          summary: "Request timed out " + err,
        });
      } else if (err instanceof CohereError) {
        res.json({
          success: false, 
          summary: err.statusCode + "\n" + err.message + "\n" + err.body,
        });
      } else {
        res.json({
          success: false, 
          summary: "Unexpected error " + err,
        });
      }
    }
  }
});

app.listen(PORT, () => {
	console.log(`Server is running at ${PORT}`);
});
