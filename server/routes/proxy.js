const express = require('express');
const axios = require('axios');

const router = express.Router();

// Load environment variables
require('dotenv').config();

// Example third-party API URL and key
const API_URL = 'https://beiyo-admin.in/';
const API_KEY = process.env.API_KEY;

// Proxy route
router.get('/proxy', async (req, res) => {
    try {
        // Get query parameters from the frontend request
        const { searchQuery } = req.query;

        // Make the API request from the backend
        const response = await axios.get(API_URL, {
            params: { q: searchQuery },
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        // Send the API response data to the frontend
        res.json(response.data);
    } catch (error) {
        console.error('Error in proxy:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from API' });
    }
});

module.exports = router;
