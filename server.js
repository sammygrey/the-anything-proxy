const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const port = 3000;

//TODO:
// add HEAD, OPTIONS, PUT, DELETE, stuff

app.set("etag", false);

var return_type;

options = {};

async function request(url, res, type) {
  var toRes;
  const data = await fetch(url, options)
    .then((response) => {
      switch (type) {
        case "text":
          return response.text();
        case "blob":
          return response.blob();
        case "clone":
          return response.clone();
        case "formData":
          return response.formData();
        case "arrayBuffer":
          return response.arrayBuffer();
        default:
          return response.json();
      }
    })
    .then((data) => {
      toRes = data;
      if (type == "blob") {
        blobURL = URL.createObjectURL(data);
        toRes = `<a href="${blobURL}"> Blob { size: ${data.size}, type: '${data.type}' } </a>`;
      }
      return data;
    })
    .catch((error) => {
      if (error != null) {
        toRes = error;
      }
      return error;
    });
  await res.send(toRes);
  return data;
}

function setOptions(req) {
  if ("return_type" in req.headers) {
    return_type = req.headers["return_type"];
    if (return_type != "clone") {
      delete req.headers["return_type"];
    }
  }
  if ("custom_options" in req.headers) {
    options = req.headers["custom_options"];
    if (return_type != "clone") {
      delete req.headers["custom_options"];
    }
  }
  if ("use_headers" in req.headers && req.headers["use_headers"] == true) {
    if (return_type != "clone") {
      delete req.headers["use_headers"];
    }
    options["headers"] = req.headers;
  }
}

function clearOptions() {
  options = {};
}

app.get(["/", "/info"], (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/*", (req, res) => {
  url = req.url;
  let data;
  setOptions(req);
  data = request(url, res, return_type);
  clearOptions();
  return data;
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
