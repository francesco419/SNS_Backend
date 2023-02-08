const express = require("express");
const path = require("path");
const cors = require("cors");
const static = require("serve-static");
const dotenv = require("dotenv");
const db = dotenv.config().parsed;
const bodyParser = require("body-parser");
const multer = require("multer");

//const upload = multer({ dest: "./images/" });
let actionApi = require("./action");
const app = express();

const fileFilter = (req, file, cb) => {
  // 확장자 필터링
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true); // 해당 mimetype만 받겠다는 의미
  } else {
    // 다른 mimetype은 저장되지 않음
    req.fileValidationError = "jpg,jpeg,png,gif,webp 파일만 업로드 가능합니다.";
    req.body = file;
    cb(null, false);
  }
};

const upload = multer({
  storage: multer.diskStorage({
    //폴더위치 지정
    destination: (req, file, done) => {
      done(null, "./images/");
    },
    filename: (req, file, done) => {
      const ext = path.extname(file.originalname);
      // aaa.txt => aaa+&&+129371271654.txt
      const fileName = path.basename(file.originalname, ext) + Date.now() + ext;
      done(null, fileName);
    },
  }),
  fileFilter: fileFilter,
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../type-redux/build")));
app.use(express.static("images"));

app.post("/login/register", actionApi.postRegister);
app.post("/login", actionApi.postLoginCheck);
app.post("/post", actionApi.postPostIn);

app.post("/userEdit", actionApi.postUserUpdate);
app.post("/checkDuplicate", actionApi.checkDuplicate);

app.post("/update/propfileimg", upload.any(), actionApi.updateProfileImg);
app.post("/update/follow", actionApi.updateFollow);

app.post("/search/post", actionApi.searchPost);
app.get("/fetch/post", actionApi.getPostOut);

//app.post("/upload", upload.array("img"), actionApi.uploadImage);
app.post("/post/delete", actionApi.deletePost);
app.post("/upload", upload.any(), actionApi.uploadImage);
app.post("/download", actionApi.downloadImage);

app.listen(db.PORT, () => {
  console.log("listening on port");
});

/* res.writeHead("400", { "Content-Type": "text/html; charset=utf8" });
res.write("<h1>User regiter success</h1>");
res.end(); */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../type-redux/build/index.html"));
});
