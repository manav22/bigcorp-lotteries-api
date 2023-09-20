import { Request, Response } from 'express';
import { Lottery } from './types';
const express = require('express');
const cors = require('cors');
const redis = require('redis');
const ulid = require('ulid');

const { REDIS_URL } = process.env;
const client = redis.createClient({ url: REDIS_URL });

// Types
type RequestBody<T> = {
  body: T;
}

type SuccessResponse<T> = {
  data: T;
}

type ErrorResponse = {
  error: string;
}

type BaseParams<IDType = number> = {
  id: IDType;
}

type APIResponse<T> = SuccessResponse<T> | ErrorResponse;

type ResponseStatus = 'Success' | 'Error';

type RegisterRequest = {
  lotteryId: string;
  name: string;
}

type RegisterResponse = {
  status: ResponseStatus;
}


// This is going to write any Redis error to console.
client.on("error", (error: Error) => {
  console.error(error);
});



const app = express();
const port = 3000;

if (process.env.NODE_ENV === "development") {
  console.log("running in development environment")
  // Enabling Cross-Origin Resource Sharing in development, as we run
  // the frontend and the backend code on different ports while developing.
  app.use(cors());
}

app.use(express.json({ limit: '10kb' }));

app.get("/", (req: Request, res: Response): void => {
  // Send an empty object as the response.
  res.json({});
});

app.post("/lotteries", async (req: Request, res: Response<Lottery | ErrorResponse>): Promise<void> => {
  const { type, name, prize } = req.body;
  if (type !== "simple") {
    res.status(422).json({ error: "Invalid lottery type" });
    return;
  }

  if (typeof name !== "string" || name.length < 3) {
    res.status(422).json({ error: "Invalid lottery name" });
    return;
  }

  if (typeof prize !== "string" || prize.length < 3) {
    res.status(422).json({ error: "Invalid lottery prize" });
    return;
  }

  const id = ulid.ulid();
  const newLottery: Lottery = {
    id,
    name,
    prize,
    type,
    status: "running",
  };


  try {
    await client.connect();

    await client
      .multi()
      .hSet(`lottery.${id}`, newLottery)
      .lPush("lotteries", id)
      .exec();

    await client.disconnect();

    console.log('res', res)

    res.json(newLottery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create lottery" });
  }
});

app.post("/register", async (req: Request<RequestBody<RegisterRequest>>, res: Response<RegisterResponse | ErrorResponse>): Promise<void> => {

  const requiredFieldId = 'id';
  const requiredFieldName = 'name';
  const { id, name } = req.body;

  console.log("body for register", req, req.body, id, name);

  // return res.status(200).json({id, name});
  if (!id) {
    res.status(400).json({ error: `Missing required field: ${requiredFieldId}` });
    return;
  }

  if (!name) {
    res.status(400).json({ error: `Missing required field: ${requiredFieldName}` });
    return;
  }

  try {
    const lotteryStatus = await client.hGet(`lottery.${id}`, "status");

    if (!lotteryStatus) {
      throw new Error("A lottery with the given ID doesn't exist");
    }

    if (lotteryStatus === "finished") {
      throw new Error("A lottery with the given ID is already finished");
    }

    await client.lPush(`lottery.${id}.participants`, name);

    res.json({ status: "Success" });
  } catch (error) {

    if (error instanceof Error) {
      console.error(error);
      res
        .status(500)
        .json({ error: `Failed to register for the lottery: ${error.message}` });
    }
  }
});


app.get('/lotteries/:id', async (req: Request<BaseParams>, res: Response<Lottery | ErrorResponse>): Promise<void> => {
  const loterryId = req.params.id;

  try {
    await client.connect();

    const lottery = await client.hGetAll(`lottery.${loterryId}`);

    if (!Object.keys(lottery).length) {
      res
        .status(404)
        .json({ error: "A lottery with the given ID does not exist" });
      return;
    }

    res.json(lottery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create lottery" });
  } finally {
    await client.disconnect();
  }
});



app.get("/lotteries", async (req: Request, res: Response<APIResponse<Lottery[]>>): Promise<void> => {
  await getAllLotteries(res);

});

async function getAllLotteries(res: Response<APIResponse<Lottery[]>>): Promise<Lottery[]> {
  let lotteries: Array<Lottery>;
  try {

    await client.connect();

    const lotteryIds = await client.lRange("lotteries", 0, -1);

    const transaction = client.multi();
    lotteryIds.forEach((id: String) => transaction.hGetAll(`lottery.${id}`));
    lotteries = await transaction.exec();
    return lotteries

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to read the lotteries data" });

  } finally {
    await client.disconnect();
  }
  return []
}

if (process.env.NODE_ENV === "production") {
  // Serving the bundled frontend code together with the backend on the same port in production.
  console.log("running in production environment")

  app.use(express.static("client/dist"));
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});