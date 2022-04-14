const express = require("express");
const app = express();
const port = 3000;

options = {}; //whatever fetch options you'd like here

app.get("/*", (req, res) => {
  url = req.url.slice(1);
  const data = fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      res.send(data);
      return data;
    })
    .catch((error) => {
      res.send(error);
      return error;
    });

  return data;
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
