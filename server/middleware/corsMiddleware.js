const cors = require('cors');

const allowedOrigins = ['https://beiyo.in']; // Frontend URL

const corsMiddleware = (req, res, next) => {
    cors({
        origin: (origin, callback) => {
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    })(req, res, next);
};

module.exports = corsMiddleware;