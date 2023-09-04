

const ulid = require("ulid");
const { REDIS_URL } = process.env;
const redis = require("redis");
const client = redis.createClient({ url: REDIS_URL });

// This is going to write any Redis error to console.
client.on("error", (error) => {
  console.error(error);
});



const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
if (process.env.NODE_ENV === "development") {
  console.log("running in development environment")
  // Enabling Cross-Origin Resource Sharing in development, as we run
  // the frontend and the backend code on different ports while developing.
  app.use(cors());
}

app.use(express.json({ limit: '10kb' }));

app.get("/", (req, res) => {
  // Send an empty object as the response.
  res.json({});
});

app.post("/lotteries", async (req, res) => {
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
  const newLottery = {
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
    res.json(newLottery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create lottery" });
  }
});

app.post("/register", async (req, res) => {

  const requiredFieldId = 'id';
  const requiredFieldName = 'name';
  const { id, name } = req.body;

  console.log("body for register", req, req.body, id, name);

  // return res.status(200).json({id, name});
  if (!id) {
    return res.status(400).json({ error: `Missing required field: ${requiredFieldId}` });
  }

  if (!name) {
    return res.status(400).json({ error: `Missing required field: ${requiredFieldName}` });
  }

  const listOfLotteries = await getAllLotteries();

  let existingLottery = {};

  for (const lottery of listOfLotteries) {
    if (lottery.id === id) {
      existingLottery = lottery;
      break;
    } else {
      res.status(200).json({ error: `lottery does not exist with given id: ${id}` });
    }
  }

  const lotteryParticipant = {
    id: existingLottery.id,
    name: name,
  };

  if (existingLottery.status === "running") {
    try {
      await client.connect();

      await client
        .multi()
        .hSet(`lotteryParticipant.${id}`, lotteryParticipant)
        .lPush("participants", id)
        .exec();

      await client.disconnect();
      res.json(lotteryParticipant);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create lottery" });
    }
  }


});

app.get('/lotteries/:id', async (req, res) => {
  const loterryId = parseInt(req.params.id);

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



app.get("/lotteries", async (req, res) => {
  res.json(await getAllLotteries());

});

async function getAllLotteries() {
  let lotteries
  try {

    await client.connect();

    const lotteryIds = await client.lRange("lotteries", 0, -1);

    const transaction = client.multi();
    lotteryIds.forEach((id) => transaction.hGetAll(`lottery.${id}`));
    lotteries = await transaction.exec();
    return lotteries

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to read the lotteries data" });
  } finally {
    await client.disconnect();
  }
}

if (process.env.NODE_ENV === "production") {
  // Serving the bundled frontend code together with the backend on the same port in production.
  console.log("running in production environment")

  app.use(express.static("client/dist"));
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});