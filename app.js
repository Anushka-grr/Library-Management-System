const express = require("express");
const app = express();
const port = process.env.port || 3000;

app.use(express.static("./public"));
app.use(express.json());

const start = async () => {
  app.listen(port, () => {
    console.log(`server listening on port ${port}...`);
  });
};
start();
