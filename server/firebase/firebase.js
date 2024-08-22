const admin = require('firebase-admin');

const firebaseConfig = {
    apiKey: "AIzaSyCf_hd83TmChiS9Cn_gPMkZwznHc4WAnow",
    authDomain: "beiyotech-e0dfe.firebaseapp.com",
    projectId: "beiyotech-e0dfe",
    storageBucket: "beiyotech-e0dfe.appspot.com",
    messagingSenderId: "513722607875",
    appId: "1:513722607875:web:5afef2057987809a90e136",
    measurementId: "G-G1XQPX940R"
  };

admin.initializeApp(firebaseConfig);
const bucket = admin.storage().bucket();
async function uploadFile(file, destinationPath) {
    const fileRef = bucket.file(destinationPath);
    const uploadStream = fileRef.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    return new Promise((resolve, reject) => {
      uploadStream.on('error', (err) => {
        console.error('Error uploading file:', err);
        reject(err);
      });

      uploadStream.on('finish', async () => {
        try {
          const [url] = await fileRef.getSignedUrl({
              action: 'read',
              expires: '03-01-01 00:00:00'
          });
          resolve(url);
      } catch (err) {
          console.error('Error generating signed URL:', err);
          reject(err);
      }
      });

      uploadStream.end(file.buffer);
    });
  }

  module.exports = uploadFile;