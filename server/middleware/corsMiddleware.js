const cors = require('cors');

const allowedOrigins = ['https://beiyo.in']; // Frontend URL

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies if needed
};

module.exports = cors(corsOptions);