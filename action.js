const multer = require("multer");
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
        if (err) {
          console.log("result null error");
          return res.send({ result: result, flag: false });
        } else {
          if (user_obj.paramPassword !== result[0].password) {
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

exports.getUserData = (req, res) => {
  getConnection.getConnection(function (err, conn) {
    const exec = conn.query(
      `SELECT * FROM users WHERE id='${req.query.id}'limit 1;`,
      (err, result) => {
        conn.release();
        if (err) {
          return res.send({ result: result, flag: false });
        } else {
          return res.send(result);
        }
      }
    );
  });
};

function randomString() {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  const stringLength = 6;
  let randomstring = "";
  for (let i = 0; i < stringLength; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
}

exports.postPostIn = (req, res) => {
  console.log(req.body);
  let zero = 0;
  let code = randomString();
  //const jsonTag = JSON.stringify(req.body.tag);
  //const josnimg = JSON.stringify(req.body.img);
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      "INSERT INTO posts(id,text,tag,date,img,code,commentCount,announcement) VALUES(?,?,?,?,?,?,?,?);",
      [
        req.body.user_id,
        req.body.text,
        req.body.tag,
        req.body.date,
        req.body.img,
        code,
        zero,
        req.body.announcement === "true" ? true : false,
      ],
      (err, result) => {
        conn.release();
        if (err) {
          return res.send("result err");
        } else {
          return res.send(result);
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

exports.getUserPost = (req, res) => {
  getConnection.getConnection((err, conn) => {
    const exec = conn.query(
      `select * from posts where id='${req.query.id}';`,
      (err, result) => {
        conn.release();
        if (err) {
          console.log(err);
          return res.send(err);
        } else {
          console.log("Success");
          return res.send(result);
        }
      }
    );
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

exports.updateProfileImg = (req, res) => {
  if (!req.body) {
    return res.send("no user data");
  }

  const temp = [];

  if (req.files) {
    req.files.map((file) => {
      temp.push(file.path);
    });
  }

  userObject = {
    id: req.body.id,
    img: JSON.stringify(temp),
  };
  getConnection.getConnection((err, conn) => {
    if (err) {
      console.log(err);
      return res.send(false);
    }
    console.log("UPI connected");
    const exec = conn.query(
      `update users set img=? where id=?`,
      [userObject.img, userObject.id],
      (err, result) => {
        conn.release();
        if (err) {
          console.log(err);
          return res.send(false);
        } else {
          console.log("UPI update Success");
          return res.send(result);
        }
      }
    );
  });
};

exports.updateFollow = (req, res) => {
  paramId = req.body.id;
  paramToId = req.body.toID;
  getConnection.getConnection((err, conn) => {
    if (err) {
      console.log(err);
      return res.send(false);
    }
    console.log("UFW connected");
    const exec = conn.query(
      `update follow set followNum=followNum+1, followDetail=concat(followDetail,', ${paramToId}') where id='${paramId}'; update users A join follow B on A.id=B.id set A.follow = B.followNum where A.id='${paramId}';select follow from users where id='${paramId}'`,
      (err, result) => {
        conn.release();
        if (err) {
          console.log(err);
          return res.send(false);
        } else {
          console.log("UFW Success");
          return res.send(result);
        }
      }
    );
  });
};

exports.searchPost = (req, res) => {
  console.log(req.body);
  paramName = req.body.name;
  getConnection.getConnection((err, conn) => {
    if (err) {
      console.log(err);
      return res.send(false);
    }
    console.log("SRP connected");
    console.log(paramName);
    const exec = conn.query(
      `Select * from posts where id like'%${paramName}%' or text like'%${paramName}%' or tag like'%${paramName}%'`,
      (err, result) => {
        conn.release();
        if (err) {
          console.log(err);
          return res.send(false);
        } else {
          console.log(result);
          console.log("SRP Success");
          return res.send(result);
        }
      }
    );
  });
};

exports.uploadImage = (req, res) => {
  if (!req.body) {
    return res.send("no user data");
  }

  const temp = [];
  if (req.files) {
    req.files.map((file) => {
      temp.push(file.path);
    });
  }
  userObject = {
    id: req.body.id,
    name: req.body.name,
    text: req.body.text,
    tag: req.body.tag,
    date: req.body.time,
    img: JSON.stringify(temp),
    announcement: req.body.announcement === "true" ? true : false,
  };

  let postCode = randomString();

  console.log("post test conn");

  getConnection.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    }
    console.log("UIMG connected");
    console.log(req.body);
    const exec = conn.query(
      "insert into posts(id,name,date,text,tag,img,code,commentCount,announcement) values(?,?,?,?,?,?,?,?,?);" +
        `update users set post=post+1 where id='${userObject.id}';`,
      [
        userObject.id,
        userObject.name,
        userObject.date,
        userObject.text,
        userObject.tag,
        userObject.img,
        postCode,
        0,
        userObject.announcement,
      ],
      (err, result) => {
        conn.release();
        if (err) {
          console.log(err);
          return res.send(err);
        } else {
          console.log("success");
          return res.send(result);
        }
      }
    );
  });
};

exports.downloadImage = (req, res) => {
  getConnection.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    }
    const exec = conn.query(
      `select * from imgs where idimg='5'`,
      (err, result) => {
        conn.release();
        if (err) {
          console.log(err);
          return res.send(err);
        } else {
          console.log(result[0].img);
          return res.sendFile(process.cwd() + "/" + result[0].img);
        }
      }
    );
  });
};

exports.deletePost = (req, res) => {
  let code = req.body.data.code;
  let id = req.body.data.id;
  getConnection.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    }
    let query =
      `delete from posts where code='${code}';` +
      `update users set post=post-1 where id='${id}';` +
      `delete from comment where code='${code}'`;
    const exec = conn.query(query, (err, result) => {
      conn.release();
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        return res.send(result);
      }
    });
  });
};

exports.editPost = (req, res) => {
  if (!req.body) {
    return res.send("no user data");
  }
  const temp = [];
  if (req.files) {
    req.files.map((file) => {
      temp.push(file.path);
    });
  }
  getConnection.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    }
    const exec = conn.query(
      `update posts set text='${req.body.text}',tag='${
        req.body.tag
      }',img='${JSON.stringify(temp)}' where code='${req.body.code}';`,
      (err, result) => {
        conn.release();
        if (err) {
          console.log(err);
          return res.send(err);
        } else {
          console.log(result);
          return res.send(result);
        }
      }
    );
  });
};

exports.postComment = (req, res) => {
  const code = req.body.code;
  const text = req.body.comment;
  getConnection.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    }
    const exec = conn.query(
      `select * from comment where code='${code}'`,
      (err, result) => {
        if (err) {
          console.log(0);
          return res.send(err);
        }
        if (result) {
          if (result[0] === undefined) {
            const noData = conn.query(
              `insert into comment(code,comment,count) value(?,?,?)`,
              [req.body.code, JSON.stringify([req.body.comment]), 1],
              (err, result) => {
                conn.release();
                if (err) {
                  console.log(err);
                  return res.send(err);
                } else {
                  console.log("new comment");
                  return res.send(result);
                }
              }
            );
          } else {
            const commentData = JSON.parse(result[0].comment);
            commentData.push(text);
            console.log(commentData);
            let querys =
              `update comment set comment='${JSON.stringify(
                commentData
              )}', count=count+1 where code='${code}';` +
              `update posts set commentCount = commentCount + 1 where code = '${code}';`;
            //코멘트 추가 쿼리 + 포스트 개수 쿼리
            const existData = conn.query(querys, (err, result) => {
              conn.release();
              if (err) {
                console.log(err);
                return res.send(err);
              } else {
                console.log("update comment");
                return res.send(result);
              }
            });
          }
        }
      }
    );
  });
};

exports.getComment = (req, res) => {
  const code = req.query.code;
  getConnection.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    }
    const exec = conn.query(
      `select * from comment where code='${code}'`,
      (err, result) => {
        conn.release();
        if (err) {
          return res.send(err);
        } else {
          return res.send(result);
        }
      }
    );
  });
};

exports.deleteComment = (req, res) => {
  const commentData = req.body.comment;
  const code = req.body.code;
  getConnection.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    }
    let querys =
      `update comment set comment='${JSON.stringify(
        commentData
      )}', count=count-1 where code='${code}';` +
      `update posts set commentCount = commentCount - 1 where code = '${code}';`;
    const exec = conn.query(querys, (err, result) => {
      conn.release();
      if (err) {
        return res.send(err);
      } else {
        return res.send(result);
      }
    });
  });
};

exports.doFollow = (req, res) => {
  console.log(req.body);
  getConnection.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    }
    let querysAdd =
      `update users set follow=follow+1 where id='${req.body.myid}';` +
      `update users set follower=follower+1 where id='${req.body.target}';`;
    let querysSubtract =
      `update users set follow=follow-1 where id='${req.body.myid}';` +
      `update users set follower=follower-1 where id='${req.body.myid}';`;
    const exec = conn.query(
      req.body.do ? querysSubtract : querysAdd,
      (err, result) => {
        conn.release();
        if (err) {
          return res.send(err);
        } else {
          return res.send(result);
        }
      }
    );
  });
};
