const express = require("express");
const mysql = require("mysql");
const path = require("path");
const cors = require("cors");
const static = require("serve-static");
const dotenv = require("dotenv");

const db = dotenv.config().parsed;

//database connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: db.host,
  user: db.user,
  password: db.POOL_PASSWORD,
  database: db.database,
  debug: false,
});

let actionApi = require("./action");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../type-redux/build")));

app.get("/", (req, res) => {
  // 요청패스에 대한 콜백함수를 넣어줍니다.
  res.sendFile(path.join(__dirname, "../type-redux/build/index.html"));
});
//app.use(cors());

app.post("/login/register", actionApi.postRegister);
app.post("/login", actionApi.postLoginCheck);
app.post("/post", actionApi.postPostIn);
app.post("/userEdit", actionApi.postUserUpdate);
app.post("/checkDuplicate", actionApi.checkDuplicate);

app.get("/fetch/post", actionApi.getPostOut);
/* app.post("/login/register", (req, res) => {
  //*웹에서 post명령어를 통해서 요청이 들어옴
  const obj = {
    paramId: req.body.user_id,
    paramName: req.body.user_name,
    paramPassword: req.body.user_password,
    paramBirth: req.body.user_birth,
    paramEmail: req.body.user_email,
  };

  console.log(obj);

  pool.getConnection((err, conn) => {
    if (err) {
      console.log("Connection Error to MySQL");
      return;
    }

    console.log("Connection Success");
    const exec = conn.query(
      "INSERT INTO users(id,name,password,birth,email) VALUES(?,?,?,?,?);",
      [
        obj.paramId,
        obj.paramName,
        obj.paramPassword,
        obj.paramBirth,
        obj.paramEmail,
      ],
      (err, result) => {
        conn.release(); //disconnect.
        console.log("Sending to MySQL Success");
        if (err) {
          console.log("response error from SQL" + err);
          res.send(false);
          return;
        } else if (result) {
          console.log("Data Inserted Successfully");
          res.send(true);
          return;
        } else {
          console.log("falied due to undefined error");
          res.send(false);
          return;
        }
      }
    );
  });
}); */

app.get("/login/register", (req, res) => {
  res.send("여긴 목성");
});

app.listen(db.PORT, () => {
  console.log("listening on port");
});

/* res.writeHead("400", { "Content-Type": "text/html; charset=utf8" });
res.write("<h1>User regiter success</h1>");
res.end(); */
