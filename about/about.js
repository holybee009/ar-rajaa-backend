const express = require('express')
const router = express.Router()
const About = require("../models/about");

// new about posting
router.post("/about", async (req, res) => {
    const {  about } = req.body;
    try {
      await About.create({
        about
      });
      res.json("Uploaded successfully");
    } catch (error) {
      console.error("about posting failed:", error);
      res.status(500).json({ message: "about posting failed", error });
    }
  });
  

    // Get about data
    router.get('/about', async (req, res) => {
        try {
          const aboutData = await About.find();
          res.status(200).json(aboutData);
        } catch (error) {
          console.error("Error retrieving about data:", error);
          res.status(500).json({ message: "Error retrieving about data", error });
        }
      });

  module.exports =  router;