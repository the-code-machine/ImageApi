// controllers/imageController.js
const Image = require('./images.model');

const uploadImages = async (req, res) => {
    try {
        const files = req.files;
        const images = files.map(file => ({
            filename: file.filename,
            path: file.path,
            originalname: file.originalname
        }));

        await Image.insertMany(images);

        res.status(200).json({ message: 'Images uploaded successfully', images });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
};

const getImages = async (req, res) => {
    try {
        const images = await Image.find();
        const formattedImages = images.map(image => ({
            filename: image.filename,
            contentType: image.contentType,
            image: `data:${image.contentType};base64,${image.image.toString('base64')}`
        }));

        res.status(200).json(formattedImages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error });
    }
};
module.exports = {
    uploadImages,
    getImages
};
