const express = require("express");
app.use(express.urlencoded({ extended: true }))
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const Admin = require("./models/login");
const port = 3700;
const multer = require("multer");
const upload = multer({ dest: "upload_news/" });

app.use(bodyParser.json());
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGO_URL, options);
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

const bcryptSalt = bcrypt.genSaltSync(15);

app.get("/", (req, res) => {
  res.json("Hello World!");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // res.status(200).json({ message: "i am working" });
  // res.json(username, password);
  // res.json(username, password);
  const adminDoc = await Admin.create({
    username,
    password: bcrypt.hashSync(password, bcryptSalt),
  });
  res.json(adminDoc);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const adminDoc = await Admin.findOne({
    username,
  });
  if (adminDoc) {
    res.json("found");
    const passOk = bcrypt.compareSync(password, adminDoc.password);
    if (passOk) {
      res.json("correct password");
    } else {
      res.status(422).json("incorrect password");
    }
  } else {
    res.json("not found");
  }
  // res.json(adminDoc);
});

app.post("/news-upload-photo", upload.single("news-file"), (res, req) =>{
res.json(req.file)
console.log(req.file);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// password : QeCXKQtFtherJsHf
// password real: yu8yM5neAO4G1DXs
// IP address (105.112.22.137)
// username: ArRajaaSchools,
