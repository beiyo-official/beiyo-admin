const express = require('express');
const router = express.Router();
const  requestForm  = require('../models/requestForm');


// Add a new form
router.post('/', async (req, res) => {
    try {
        const {name,mobileNumber,hostelId}=req.body
        const newForm = new requestForm({
            name,
            mobileNumber,
            hostelId
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

module.exports = router;
