import { v2 as cloudinary } from 'cloudinary';

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

        console.log('Cloudinary delete result:', result);
        return result;
    } catch (error) {
        console.error('Cloudinary deletion failed:', error);
        return null;
    }
};

export { deleteFromCloudinary };

