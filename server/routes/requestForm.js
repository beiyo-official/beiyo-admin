const express = require('express');
const router = express.Router();
const  requestForm  = require('../models/requestForm');
const Hostel = require('../models/Hostel');


// Add a new form
router.post('/', async (req, res) => {
    try {
        const {name,mobileNumber,hostelId}=req.body
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) { 
            res.status(404).json('Hostel not found');
         }
         const hostelName = hostel.name;
        const newForm = new requestForm({
            name,
            mobileNumber,
            hostelId,
            hostelName
        });
        const savedForm = await newForm.save();
        res.status(201).json(savedForm);
    } catch (error) {
        console.error('Error creating form:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/',async(req,res)=>{
    try {
        const  forms = await requestForm.find();
        res.status(200).json(forms);
    } catch (error) {
        console.error('Error creating form:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.put('/statusChange/:id',async (req,res)=>{
    try {
        const form = await requestForm.findByIdAndUpdate(req.params.id,{
            status:'close'
        });
        res.json(form);
    } catch (error) {
        
    }
})

module.exports = router;
