const multer = require("multer");
const express = require("express");

module.exports = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../images/");
    },
    filename: (req, file, cb) => {
      const originalFileName = file.originalname.split(".");
      let filename = "none";
      if (originalFileName.length > 0) {
        filename = `${originalFileName[0]}-${Date.now()}.${
          originalFileName[1]
        }`;
      }
      cb(null, filename);
    },
  });
  const upload = multer({ storage: storage });
  const app = express();
};
