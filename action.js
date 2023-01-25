const getConnection = require("./config/getConnection");

exports.postRegister = (req, res) => {
  //*웹에서 post명령어를 통해서 요청이 들어옴
  const obj = {
    paramId: req.body.user_id,
    paramName: req.body.user_name,
    paramPassword: req.body.user_password,
    paramBirth: req.body.user_birth,
    paramEmail: req.body.user_email,
  };

  console.log(obj);
  console.log(getConnection);

  getConnection.getConnection(function (err, conn) {
    //매개변수범위에 이후 모든코드 넣기
    const exec = conn.query(
      "INSERT INTO users(id,name,password,birth,email,img,info,post,follow,follower) VALUES(?,?,?,?,?,?,?,?,?,?);",
      [
        obj.paramId,
        obj.paramName,
        obj.paramPassword,
        obj.paramBirth,
        obj.paramEmail,
        null,
        obj.paramName,
        0,
        0,
        0,
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
};

exports.postLoginCheck = (req, res) => {
  console.log("post get");
  const user_obj = {
    paramId: req.body.user_id,
    paramPassword: req.body.password,
  };
  getConnection.getConnection(function (err, conn) {
    console.log(user_obj.paramId);
    const exec = conn.query(
      `SELECT * FROM users WHERE id='${user_obj.paramId}'limit 1;`,
      (err, result) => {
        conn.release();
        console.log(err);
        console.log(result);

        if (err) {
          console.log("result null error");
          return res.send({ result: result, flag: false });
        } else {
          if (user_obj.paramPassword !== result[0].password) {
            console.log(result.password);
            console.log("result password do not match");
            return res.send({ result: result, flag: false });
          } else {
            console.log("Success");
            return res.send(result); //({ result: result, flag: true });
          }
        }
      }
    );
  });
};

exports.postPostIn = (req, res) => {
  console.log("PostIn Check");
  //const jsonTag = JSON.stringify(req.body.tag);
  //const josnimg = JSON.stringify(req.body.img);
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      "INSERT INTO posts(id,text,tag,img) VALUES(?,?,?,?);",
      [req.body.user_id, req.body.text, req.body.tag, req.body.img],
      (err, result) => {
        conn.release();
        if (err) {
          console.log(err);
          console.log(result);
          return res.send("result err");
        } else {
          console.log("Success");
          return res.send("Success" + result);
        }
      }
    );
  });
};

exports.getPostOut = (req, res) => {
  console.log("PostOut Check");
  getConnection.getConnection((err, conn) => {
    const exec = conn.query("select * from posts;", (err, result) => {
      conn.release();
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        console.log("Success");
        return res.send(result);
      }
    });
  });
};

exports.postUserUpdate = (req, res) => {
  const paramId = req.body.id;
  const obj = {
    name: req.body.name,
    password: req.body.newpassword,
    birth: req.body.birth,
    email: req.body.email,
    intro: req.body.info,
  };
  let updatedObj = {};
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      `SELECT * FROM users WHERE id='${paramId}' limit 1;`,
      (err, result) => {
        conn.release();
        if (err) {
          console.log(err);
          return res.send(err);
        }
        if (result) {
          for (let temp in obj) {
            if (obj[temp] === "") {
              continue;
            } else {
              result[0][temp] = obj[temp];
            }
          }
          updatedObj = result[0];
          getConnection.getConnection((err, conn) => {
            const execQuery = conn.query(
              `update users set name='${updatedObj.name}', password='${updatedObj.password}', birth='${updatedObj.birth}', email='${updatedObj.email}', img='${updatedObj.img}', info='${updatedObj.intro}' where id='${updatedObj.id}';`,
              (err, result) => {
                conn.release();
                if (err) {
                  console.log(err);
                  return res.send(err);
                }
                if (result) {
                  console.log("success");
                  return res.send(result);
                }
              }
            );
          });
        }
      }
    );
  });
};

exports.checkDuplicate = (req, res) => {
  getConnection.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    }
    console.log("Duplicate Check-in");
    const exec = conn.query(
      `SELECT name FROM users WHERE name='${req.body.name}'`,
      (err, result) => {
        conn.release();
        if (err) {
          console.log(err);
          return res.send(err);
        } else {
          console.log(result);
          if (result.length < 1) {
            console.log("no match");
            return res.send(false);
          } else {
            console.log("match");
            return res.send(true);
            z;
          }
        }
      }
    );
  });
};
