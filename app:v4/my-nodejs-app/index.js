const express = require("express");
var swStats = require("swagger-stats");
const app = express();


// /swagger-stats/metrics
app.use(swStats.getMiddleware());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.get ("/comments", (reg, res) => {
  res.send("Comments");
});

app.get("/threads", (reg, res) => {
  res.send("Threads");
});

app.get("/replies", (reg, res) => {
  res.send("replies");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
