import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import { randomBytes } from "crypto";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

dotenv.config();
const port = process.env.PORT;

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());

type Product = {
  id: string;
  name: string;
  price: string;
};

const products: Product[] = [];

app.get("/products", async (req: Request, res: Response) => {
  res.send({});
});

app.post("/products", async (req: Request, res: Response) => {
  const id = randomBytes(16).toString("hex");
  const { name, price } = req.body;

  const newProduct = {
    id,
    name,
    price,
  };

  products.push(newProduct);

  console.log(newProduct);

  await axios.post("http://localhost:4005/events", {
    type: "ProductCreated",
    data: {
      id,
      name,
      price,
    },
  });

  res.send(newProduct);
});

app.post("/events", async (req: Request, res: Response) => {
  console.log("Received event: ", req.body.type);
  res.send({});
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
