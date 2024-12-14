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
    const fileName = `${folder}/${uuid.v4()}_${file.originalname}`;
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };
    const result = await s3.upload(params).promise();
    return result.Location; // Returns the file's public URL
};

module.exports = { s3, uploadToS3 };
