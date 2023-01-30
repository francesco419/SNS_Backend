const express = require("express");
const path = require("path");
const cors = require("cors");
const static = require("serve-static");
const dotenv = require("dotenv");
const db = dotenv.config().parsed;
const bodyParser = require("body-parser");
const multer = require("multer");

const upload = multer({ dest: "./images/" });
let actionApi = require("./action");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../type-redux/build")));

app.post("/login/register", actionApi.postRegister);
app.post("/login", actionApi.postLoginCheck);
app.post("/post", actionApi.postPostIn);
app.post("/userEdit", actionApi.postUserUpdate);
app.post("/checkDuplicate", actionApi.checkDuplicate);
app.post("/update/propfileimg", actionApi.updateProfileImg);
app.post("/update/follow", actionApi.updateFollow);

app.post("/search/post", actionApi.searchPost);
app.get("/fetch/post", actionApi.getPostOut);

app.post("/upload", upload.single("img"), (req, res) => {
  console.log(req);
});

app.listen(db.PORT, () => {
  console.log("listening on port");
});

/* res.writeHead("400", { "Content-Type": "text/html; charset=utf8" });
res.write("<h1>User regiter success</h1>");
res.end(); */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../type-redux/build/index.html"));
});
