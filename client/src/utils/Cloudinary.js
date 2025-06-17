import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath || !fs.existsSync(localFilePath)) {
            console.log('File does not exists:',localFilePath)
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: 'auto'})
        console.log('file uploded successfully:', response.url)

        const duration = response.resource_type === 'video'?response.duration:null
        
        fs.unlinkSync(localFilePath);  // Delete after successful upload
        console.log('Local file deleted');

        return {response, duration}
    } catch (error) {
        console.error('Upload failed !!',error)

        if(fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
            console.log('Local file deleted after failure')
        }

        return null;
    }
}

export { uploadOnCloudinary }