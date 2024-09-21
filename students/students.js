const express = require('express')
const router = express.Router()
const Student = require("../models/students");
const multer = require("multer");
const fs = require("fs");
const BASE_URL = require("../config")

// Multer configuration
const studentPhoto = multer({ dest: "upload_students/" });
// new student posting
router.post("/student", async (req, res) => {
    const { selectedYear, studentName, studentClass, uploadedFileUrl} = req.body;
    try {
      await Student.create({
        selectedYear, studentName, studentClass, uploadedFileUrl
      });
      res.json("Uploaded successfully");
    } catch (error) {
      console.error("student posting failed:", error);
      res.status(500).json({ message: "student posting failed", error });
    }
  });
  
  // student photo upload
  router.post("/student-upload-photo", studentPhoto.array("student-photo", 1), (req, res) => {
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
      console.error("Error uploading student photo:", error);
      res.status(500).json({ message: "Error uploading student photo", error });
    }
  });
  
// Get student data
router.get('/student', async (req, res) => {
    const { selectedYear, studentClass } = req.query;
    try {
      let query = {};
  
      // If selectedYear and studentClass are provided in the query, add them to the query object
      if (selectedYear) {
        query.selectedYear = selectedYear;
      }
      if (studentClass) {
        query.studentClass = studentClass;
      }
  
      const studentData = await Student.find(query); 
      res.status(200).json(studentData);
  
    } catch (error) {
      console.error("Error retrieving student data:", error);
      res.status(500).json({ message: "Error retrieving student data", error });
    }
  });


  // get student data by Id
  router.get("/student:id", async (req,res) => {
    const {id} = req.params
    res.json(await Student.findById(id))
  })

  //update student
  router.put("/student", async (req, res) => {
    const { id, selectedYear, studentName, studentClass, uploadedFileUrl } = req.body;
  
    try {
      const studentDoc = await Student.findById(id);
      if (!studentDoc) {
        return res.status(404).json({ message: "student not found" });
      }
  
      studentDoc.set({ selectedYear, studentName, studentClass, uploadedFileUrl });
      await studentDoc.save();
      res.json("updated successfully");
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ message: "Error updating student", error: error.message });
    }
  });


  //delete student
  router.delete("/student:id" , async (req, res) => {
    const {id} = req.params
    try{
      const result = await Student.findByIdAndDelete(id)
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