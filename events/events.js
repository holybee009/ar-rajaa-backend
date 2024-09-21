const express = require('express');
const router = express.Router();
const Event = require("../models/event")

// event details posting
router.post("/event", async (req, res) => {
  const {eventName, eventVenue, startDate:date} = req.body
  try {
    await Event.create({
      eventName, eventVenue, date 
    });
    res.json("Uploaded successfully");
  } catch (error) {
    console.error("event posting failed:", error);
    res.status(500).json({ message: "event posting failed", error });
  }
  });

  // event details get endpoint
  router.get('/event', async (req, res) => {
    try {
      const eventData = await Event.find();
      res.status(200).json(eventData);
    } catch (error) {
      console.error("Error retrieving event data:", error);
      res.status(500).json({ message: "Error retrieving event data", error });
    }
  });

    // get event data by Id
    router.get("/event:id", async (req,res) => {
      const {id} = req.params
      res.json(await Event.findById(id))
    })
  
    //update event
    router.put("/event", async (req, res) => {
      const { editEventId: id, eventName, eventVenue,startDate: date } = req.body;
    
      try {
        const eventDoc = await Event.findById(id);
        if (!eventDoc) {
          return res.status(404).json({ message: "event not found" });
        }
    
        eventDoc.set({ eventVenue, eventName, date });
        await eventDoc.save();
        res.json("updated successfully");
      } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: "Error updating event", error: error.message });
      }
    });
  
  
    //delete event
    router.delete("/event:id" , async (req, res) => {
      const {id} = req.params
      try{
        const result = await Event.findByIdAndDelete(id)
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
