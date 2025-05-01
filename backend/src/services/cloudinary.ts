import { v2 as cloudinary } from 'cloudinary';
import config from "../config/environmentVars.js"

cloudinary.config({
    cloud_name: config.cloudinaryName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
});

export { cloudinary };
