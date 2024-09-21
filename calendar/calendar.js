const express = require('express');
const router = express.Router();
const Calendar = require("../models/calendar")

// calendar details posting
router.post("/calendar", async (req, res) => {
    const { selectedYear, calendarData } = req.body;
  
    try {
      // Check if a calendar with the selectedYear already exists
      const existingCalendar = await Calendar.findOne({ selectedYear });
  
      if (existingCalendar) {
        // Return an error if the calendar for that year already exists
        return res.status(400).json({ message: "Calendar for this year already exists" });
      }
  
      // Create a new calendar if not found
      await Calendar.create({
        selectedYear,
        calendarData,
      });
  
      res.json("Uploaded successfully");
    } catch (error) {
      console.error("Calendar posting failed:", error);
      res.status(500).json({ message: "Calendar posting failed", error });
    }
  });
  

  // calendar details get endpoint
  router.get('/calendar', async (req, res) => {
    const {selectedYear} = req.query
    try {
        let query = {};
  
        // If selectedYear is provided in the query, add to the query object
        if (selectedYear) {
          query.selectedYear = selectedYear;
        }
      const calendarData = await Calendar.find(query);
      res.status(200).json(calendarData);
    } catch (error) {
      console.error("Error retrieving calendar data:", error);
      res.status(500).json({ message: "Error retrieving calendar data", error });
    }
  });

    // get calendar data by Id
    router.get("/calendar:id", async (req,res) => {
      const {id} = req.params
      res.json(await Calendar.findById(id))
    })
  
    //update calendar
    router.put("/calendar", async (req, res) => {
      const { editcalendarId: id, selectedYear, calendarData } = req.body;
    
      try {
        const calendarDoc = await Calendar.findById(id);
        if (!calendarDoc) {
          return res.status(404).json({ message: "calendar not found" });
        }
    
        calendarDoc.set({ selectedYear, calendarData });
        await calendarDoc.save();
        res.json("updated successfully");
      } catch (error) {
        console.error('Error updating calendar:', error);
        res.status(500).json({ message: "Error updating calendar", error: error.message });
      }
    });
  
  
    //delete calendar
    router.delete("/calendar:id" , async (req, res) => {
      const {id} = req.params
      try{
        const result = await Calendar.findByIdAndDelete(id)
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
