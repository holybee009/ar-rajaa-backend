const express = require('express')
const router = express.Router()
const News = require("../models/news");
const multer = require("multer");
const fs = require("fs");
const BASE_URL = require('../config');

// Multer configuration
const newsPhoto = multer({ dest: "upload_news/" });

// new news posting
router.post("/news", async (req, res) => {
    const { title, content, newsPhoto, startDate: date } = req.body;
    try {
      await News.create({
        title, content, newsPhoto, date
      });
      res.json("Uploaded successfully");
    } catch (error) {
      console.error("News posting failed:", error);
      res.status(500).json({ message: "News posting failed", error });
    }
  });
  
  // News photo upload
  router.post("/news-upload-photo", newsPhoto.array("news-photo", 1), (req, res) => {
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
      console.error("Error uploading news photo:", error);
      res.status(500).json({ message: "Error uploading news photo", error });
    }
  });
  
  // Get news data
  router.get('/news', async (req, res) => {
    try {
      const newsData = await News.find();
      res.status(200).json(newsData);
    } catch (error) {
      console.error("Error retrieving news data:", error);
      res.status(500).json({ message: "Error retrieving news data", error });
    }
  });

  // get news data by Id
  router.get("/news:id", async (req,res) => {
    const {id} = req.params
    res.json(await News.findById(id))
  })

  //update news
  router.put("/news", async (req, res) => {
    const { editId: id, title, content, newsPhoto, startDate: date } = req.body;
  
    try {
      const newsDoc = await News.findById(id);
      if (!newsDoc) {
        return res.status(404).json({ message: "News not found" });
      }
  
      newsDoc.set({ title, content, newsPhoto, date });
      await newsDoc.save();
      res.json("updated successfully");
    } catch (error) {
      console.error('Error updating news:', error);
      res.status(500).json({ message: "Error updating news", error: error.message });
    }
  });


  //delete news
  router.delete("/news:id" , async (req, res) => {
    const {id} = req.params
    try{
      const result = await News.findByIdAndDelete(id)
      if ( result ) {
        res.status(200).json({message: 'post deleted successfully'})
    } else {
      res.status(404).json({message: 'Post not found'})
    }
  } catch(error){
    res.status(500).json({message: 'error deleting post', error})
  }}
)

  module.exports =  router;