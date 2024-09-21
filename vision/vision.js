const express = require('express')
const router = express.Router()
const Vision = require("../models/vision");
const multer = require("multer");
const fs = require("fs");
const BASE_URL = require("../config")

// Multer configuration
const visionPhoto = multer({ dest: "upload_vision/" });
// new vision posting
router.post("/vision", async (req, res) => {
    const {  vision, photo } = req.body;
    try {
      await Vision.create({
        vision, photo
      });
      res.json("Uploaded successfully");
    } catch (error) {
      console.error("vision posting failed:", error);
      res.status(500).json({ message: "vision posting failed", error });
    }
  });
  
  // vision photo upload
  router.post("/vision-upload-photo", visionPhoto.array("vision-photo", 1), (req, res) => {
    let uploadedFiles;
    try {
      for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles = `${BASE_URL}` + newPath;
      }
      res.json(uploadedFiles);
    } catch (error) {
      console.error("Error uploading vision photo:", error);
      res.status(500).json({ message: "Error uploading vision photo", error });
    }
  });

    // Get vision data
    router.get('/vision', async (req, res) => {
        try {
          const visionData = await Vision.find();
          res.status(200).json(visionData);
        } catch (error) {
          console.error("Error retrieving vision data:", error);
          res.status(500).json({ message: "Error retrieving vision data", error });
        }
      });

  module.exports =  router;