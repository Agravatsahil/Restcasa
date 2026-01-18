const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Configuration: Connects to your account
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRAT
});

// 2. Storage Setup: Defines the folder and allowed formats
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'RESTCASA_DEV', 
      allowedFormats: ['png', 'jpg', 'jpeg'], 
    },
});

module.exports = {
    cloudinary,
    storage
};