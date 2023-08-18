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

  app.use(express.json({ limit: '10kb' }));

  app.get("/", (req, res) => {
  // Send an empty object as the response.
  res.json({});
});

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });