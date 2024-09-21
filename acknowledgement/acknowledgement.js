const express = require('express')
const router = express.Router()
const Acknowledgement = require("../models/acknowledgement");
const multer = require("multer");
const fs = require("fs");
const BASE_URL = require("../config")

// Multer configuration
const acknowledgementPhoto = multer({ dest: "upload_acknowledgement/" });
// new acknowledgement posting
router.post("/acknowledgement", async (req, res) => {
    const {  acknowledgement, photo } = req.body;
    try {
      await Acknowledgement.create({
        acknowledgement, photo
      });
      res.json("Uploaded successfully");
    } catch (error) {
      console.error("acknowledgement posting failed:", error);
      res.status(500).json({ message: "acknowledgement posting failed", error });
    }
  });
  
  // acknowledgement photo upload
  router.post("/acknowledgement-upload-photo", acknowledgementPhoto.array("acknowledgement-photo", 1), (req, res) => {
    let uploadedFiles;
    try {
      for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles = BASE_URL + newPath;
      }
      res.json(uploadedFiles);
    } catch (error) {
      console.error("Error uploading acknowledgement photo:", error);
      res.status(500).json({ message: "Error uploading acknowledgement photo", error });
    }
  });

    // Get acknowledgement data
    router.get('/acknowledgement', async (req, res) => {
        try {
          const acknowledgementData = await Acknowledgement.find();
          res.status(200).json(acknowledgementData);
        } catch (error) {
          console.error("Error retrieving acknowledgement data:", error);
          res.status(500).json({ message: "Error retrieving acknowledgement data", error });
        }
      });

  module.exports =  router;