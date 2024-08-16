const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket');
const Hostels = require('../models/Hostel')

router.get('/', async (req, res) => {
    try {
      // Filter options: userId, status, priority, category, area (for area managers)
      // const filters = req.query; // Get filters from query parameters
  
      // Pagination options: page, pageSize
      // const { page = 1, pageSize = 10 } = req.query;
      // const skip = (page - 1) * pageSize;
  
      const tickets = await Ticket.find().sort({ createdAt: -1 })
      // .skip(skip).limit(pageSize);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
 
 router.get('/:hostelId',async(req,res)=>{
  try {
    const tickets = await Ticket.find({hostelId:req.params.hostelId});
    res.json(tickets);
  } catch (error) {
    console.log(error);
  }
 }) 



router.put('/:id', async (req, res) => {
    try {
      const ticketId = req.params.id;
      const updates = req.body;
  
      const ticket = await Ticket.findByIdAndUpdate(ticketId, updates, { new: true });
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/tranferToAdmin/:ticketId', async (req, res) => {
    try {
      const  ticketId   = req.params.ticketId;
      const ticket = await Ticket.findByIdAndUpdate(ticketId,{
        authority:'Admin', 
      },{new:true});
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }  
      const hostel = await Hostels.findById(ticket.hostelId); 
      if (!hostel) {
        return res.status(404).json({ message: 'hostel not found' });
      }
        // Remove ticket from managerTickets
        hostel.managerTickets = hostel.managerTickets.filter(id => id.toString() !== ticketId);
        // Add ticket to adminTickets
        hostel.adminTickets.push(ticketId);
      await hostel.save();
  
      res.status(200).json({ message: 'Ticket authority updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


router.put('/:id/assign', async (req, res) => {
    try {
      const ticketId = req.params.id;
      const { areaManagerId } = req.body;
  
      const ticket = await Ticket.findByIdAndUpdate(ticketId, { assignedTo: areaManagerId }, { new: true });
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

router.get('/area-manager/:areaManagerId', async (req, res) => {
    try {
      const areaManagerId = req.params.areaManagerId;
      const tickets = await Ticket.find({ assignedTo: areaManagerId });
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  router.put('/:id/assign', async (req, res) => {
    try {
      const ticketId = req.params.id;
      const { staffId } = req.body;
  
      const ticket = await Ticket.findByIdAndUpdate(ticketId, { assignedTo: staffId }, { new: true });
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.put('/:id/assign-to-area-manager', async (req, res) => {
    try {
      const ticketId = req.params.id;
      const { hostel } = req.body;
  
      // Find the area manager for the given hostel
      const areaManager = await Staff.findOne({ role: 'Area Manager', area: hostel });
      if (!areaManager) {
        return res.status(404).json({ message: 'Area manager not found for the hostel' });
      }
  
      const ticket = await Ticket.findByIdAndUpdate(ticketId, { assignedTo: areaManager._id }, { new: true });
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/:id/status', async (req, res) => {
    try {
      const ticketId = req.params.id;
      const { status } = req.body;
  
      const ticket = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  router.post('/:id/comments', async (req, res) => {
    try {
      const ticketId = req.params.id;
      const { comment } = req.body;
  
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
  
      ticket.comments.push(comment);
      await ticket.save();
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/:id/comments', async (req, res) => {
    try {
      const ticketId = req.params.id;
      const ticket = await Ticket.findById(ticketId).populate('comments');
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.json(ticket.comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
  router.put('/:id/escalate', async (req, res) => {
    try {
      const ticketId = req.params.id;
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
  
      // Implement escalation logic (e.g., increase priority, notify higher authorities)
      ticket.priority = 'High'; // Example: Increase priority
  
      await ticket.save();
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

//   analytics reporting

router.get('/stats/status', async (req, res) => {
    try {
      const ticketCounts = await Ticket.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      res.json(ticketCounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/stats/priority', async (req, res) => {
    try {
      const ticketCounts = await Ticket.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]);
      res.json(ticketCounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/stats/category', async (req, res) => {
    try {
      const ticketCounts = await Ticket.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);
      res.json(ticketCounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/stats/resolution-time', async (req, res) => {
    try {
      const closedTickets = await Ticket.find({ status: 'Closed' });
      console.log(closedTickets);
      const totalResolutionTime = closedTickets.reduce((acc, ticket) => {
        const closedAt = new Date(ticket.updatedAt);
        const createdAt = new Date(ticket.createdAt);
        const diffInMs = closedAt - createdAt;
        return acc + diffInMs;
      }, 0);
  
      const averageResolutionTimeMs = totalResolutionTime / closedTickets.length;
  
      // Convert milliseconds to days
      const averageResolutionTimeDays = averageResolutionTimeMs / (1000 * 60 * 60 * 24);
      const totalResolutionTimeDay =  totalResolutionTime / (1000 * 60 * 60 * 24);
      res.json({ averageResolutionTimeDays,totalResolutionTimeDay },);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  
  module.exports = router;