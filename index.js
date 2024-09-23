const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 10000; // Default to port 3000 if no environment variable is set

const Admin = require("./models/login"); // Ensure the path to your model is correct
const eventRoute = require("./events/events")
const activitiesRoute = require("./activities/activities")
const newsRoute = require("./news/news")
const acknowledgementRoute = require("./acknowledgement/acknowledgement")
const aboutRoute = require("./about/about")
const visionRoute = require("./vision/vision")
const studentRoute = require("./students/students")
const staffRoute = require("./staff/staff")
const calendarRoute = require("./calendar/calendar")
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/upload_activities', express.static(__dirname + '/upload_activities'));
app.use('/upload_acknowledgement', express.static(__dirname + '/upload_acknowledgement'));
app.use('/upload_vision', express.static(__dirname + '/upload_vision'));
app.use('/upload_students', express.static(__dirname + '/upload_students'));
app.use('/upload_staff', express.static(__dirname + '/upload_staff'));
app.use('/upload_news', express.static(__dirname + '/upload_news'));
app.use(
  cors({
    credentials: true,
    origin: ["https://ar-rajaa-schools-admin.vercel.app", "http://localhost:3000"]
  })
);
app.use(eventRoute)
app.use(newsRoute)
app.use(activitiesRoute)
app.use(acknowledgementRoute)
app.use(aboutRoute)
app.use(visionRoute)
app.use(studentRoute)
app.use(staffRoute)
app.use(calendarRoute)

// Database Connection
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGO_URL, options)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB", err));

const bcryptSalt = bcrypt.genSaltSync(15);
const JWT_SECRET = "lakjfdkjoiaiekdkamdksfdedafre"

// Routes
app.get("/", (req, res) => {
  res.json("Hello World!");
});

// Registration endpoint
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const adminDoc = await Admin.create({ username, password: hashedPassword });
    res.json(adminDoc);
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Error creating admin", error });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find a single document by username
    const adminDoc = await Admin.findOne({ username });

    // Check if user exists
    if (!adminDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare provided password with the hashed password in the database
    const passOk = bcrypt.compareSync(password, adminDoc.password); // Or use bcrypt.compare for async

    if (passOk) {
      // Create JWT token
      const token = jwt.sign(
        { userId: adminDoc._id }, JWT_SECRET, 
        { expiresIn: '1h' }
      );

      return res.json({ message: "Login successful", token});
    } else {
      return res.status(422).json({ message: "Incorrect password" });
    }

  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Error logging in", error });
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
