const express = require('express')
const router = express.Router()
const Staff = require("../models/staff");
const multer = require("multer");
const fs = require("fs");
const BASE_URL = require("../config")

// Multer configuration
const staffPhoto = multer({ dest: "upload_staff/" });
// new staff posting
router.post("/staff", async (req, res) => {
    const { selectedYear, staffName, staffClass, uploadedFileUrl} = req.body;
    try {
      await Staff.create({
        selectedYear, staffName, staffClass, uploadedFileUrl
      });
      res.json("Uploaded successfully");
    } catch (error) {
      console.error("staff posting failed:", error);
      res.status(500).json({ message: "staff posting failed", error });
    }
  });
  
  // staff photo upload
  router.post("/staff-upload-photo", staffPhoto.array("staff-photo", 1), (req, res) => {
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
      console.error("Error uploading staff photo:", error);
      res.status(500).json({ message: "Error uploading staff photo", error });
    }
  });
  
// Get staff data
router.get('/staff', async (req, res) => {
    const { selectedYear, staffClass } = req.query;
    try {
      let query = {};
  
      // If selectedYear and staffClass are provided in the query, add them to the query object
      if (selectedYear) {
        query.selectedYear = selectedYear;
      }
      if (staffClass) {
        query.staffClass = staffClass;
      }
  
      const staffData = await Staff.find(query); // No need for .toArray() in Mongoose
      res.status(200).json(staffData);
  
    } catch (error) {
      console.error("Error retrieving staff data:", error);
      res.status(500).json({ message: "Error retrieving staff data", error });
    }
  });


  // get staff data by Id
  router.get("/staff:id", async (req,res) => {
    const {id} = req.params
    res.json(await Staff.findById(id))
  })

  //update staff
  router.put("/staff", async (req, res) => {
    const { id, selectedYear, staffName, staffClass, uploadedFileUrl } = req.body;
  
    try {
      const staffDoc = await Staff.findById(id);
      if (!staffDoc) {
        return res.status(404).json({ message: "staff not found" });
      }
  
      staffDoc.set({ selectedYear, staffName, staffClass, uploadedFileUrl });
      await staffDoc.save();
      res.json("updated successfully");
    } catch (error) {
      console.error('Error updating staff:', error);
      res.status(500).json({ message: "Error updating staff", error: error.message });
    }
  });


  //delete staff
  router.delete("/staff:id" , async (req, res) => {
    const {id} = req.params
    try{
      const result = await Staff.findByIdAndDelete(id)
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