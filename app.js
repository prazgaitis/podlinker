const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;
const { handle } = require("./Handler");

app.use(cors());

app.get("/api/links", async (req, res) => {
  handle(req, res);
});

app.listen(port, () =>
  console.log(
    `ENV: ${process.env.NODE_ENV}, PORT: ${port}!, SPOTIFY: ${process.env.SPOTIFY_CLIENT_ID}`
  )
);
