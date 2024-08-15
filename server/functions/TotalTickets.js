const Hostel = require('../models/Hostel')
const Ticket = require('../models/ticket')
const totalTickets = async (hostel)=>{
    let totalTickets = 0;
  const hostelId = hostel;
  const tickets = await Ticket.find({hostelId:hostelId});
  for(let i=0; i<tickets.length; i++){
    totalTickets++;
  }
  const singleHostel = await Hostel.findById(hostelId);
  singleHostel.totalTickets = totalTickets;
  await singleHostel.save();
  return totalTickets;
}
module.exports = totalTickets;