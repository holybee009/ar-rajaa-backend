const express = require('express');
const router = express.Router();
const fs = require("fs")
const multer = require("multer");
const Activities = require('../models/activities')
const BASE_URL = require("../config")


// Multer configuration
const activitiesPhotos = multer({ dest: 'upload_activities' });



// new activities posting
router.post("/activities", async (req, res) => {
  const {activity, activityPhotos } = req.body;
  try {
    await Activities.create({
      activity, activityPhotos
    });
    res.json("Uploaded successfully");
  } catch (error) {
    console.error("Activities posting failed:", error);
    res.status(500).json({ message: "Activities posting failed", error });
  }
});

// Recent activities photo upload
router.post("/upload-activities", activitiesPhotos.array('photos', 100), (req, res) => {
    const uploadedFiles = []
    for(let i = 0; i < req.files.length; i++){
      const {path, originalname} = req.files[i]
      const parts = originalname.split(".")
      const ext = parts[parts.length - 1]
      const newPath = path + '.' + ext
      fs.renameSync(path, newPath)
      uploadedFiles.push(`${BASE_URL}` + newPath)
    }
    res.json(uploadedFiles);
  });

  // Get activites data
  router.get('/activities', async (req, res) => {
    try {
      const activitiesData = await Activities.find();
      res.status(200).json(activitiesData);
    } catch (error) {
      console.error("Error retrieving activities data:", error);
      res.status(500).json({ message: "Error retrieving activities data", error });
    }
  });

  // get news data by Id
  router.get("/activities:id", async (req,res) => {
    const {id} = req.params
    res.json(await Activities.findById(id))
  })

  //update news
  router.put("/activities", async (req, res) => {
    const { editRecentId: id, activity, activityPhotos } = req.body;
  
    try {
      const activitiesDoc = await Activities.findById(id);
      if (!activitiesDoc) {
        return res.status(404).json({ message: "Activities not found" });
      }
  
      activitiesDoc.set({ activity, activityPhotos });
      await activitiesDoc.save();
      res.json("updated successfully");
    } catch (error) {
      console.error('Error updating activities:', error);
      res.status(500).json({ message: "Error updating acitvities", error: error.message });
    }
  });


  //delete news
  router.delete("/activities:id" , async (req, res) => {
    const {id} = req.params
    try{
      const result = await Activities.findByIdAndDelete(id)
      if ( result ) {
        res.status(200).json({message: 'post deleted successfully'})
    } else {
      res.status(404).json({message: 'Post not found'})
    }
  } catch(error){
    res.status(500).json({message: 'error deleting post', error})
  }}
)
module.exports = router;
