import express, { Express, Request, Response } from "express";

const app: Express = express();
const port: number = 3000;

app.get("/", function (req: Request, res: Response) {
  res.send("Hello");
});

app.listen(port, () => {
	console.log(`Server is running at ${port}`);
});
