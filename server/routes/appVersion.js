const express = require('express');
const router = express.Router();
const AppVersion = require('../models/AppVersion')
router.get('/', async (req,res)=>{
    const appVersion   = await AppVersion.findOne();
    res.json(appVersion); 
})




module.exports = router;