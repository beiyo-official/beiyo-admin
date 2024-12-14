const AWS = require('aws-sdk');
const uuid = require('uuid');

// Configure AWS S3
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const uploadToS3 = async (file, folder) => {
    // Add validation to ensure file exists and has required properties
    if (!file || !file.buffer) {
        throw new Error('Invalid file: No buffer found');
    }

    try {
        const fileName = `${folder}/${uuid.v4()}_${file.originalname || 'unnamed'}`;
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype || 'application/octet-stream',
        };

        

        const result = await s3.upload(params).promise();
        return result.Location; // Returns the file's public URL
    } catch (error) {
        console.error('S3 Upload Error:', error);
        throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
};

module.exports = { s3, uploadToS3 };