require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const connectDB = require('./db');
const Image = require('./images.model'); // Ensure this path is correct
const { getImages } = require('./images.controller'); // Ensure this path is correct

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors({ origin: 'http://127.0.0.1:5500' }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).any();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/upload', upload, async (req, res) => {
    try {
        const files = req.files;
        const images = files.map(file => ({
            filename: file.originalname,
            contentType: file.mimetype,
            image: file.buffer,
        }));

        await Image.insertMany(images);

        res.status(200).json({ message: 'Images uploaded successfully', images });
    } catch (error) {
        console.error(error); // Log the error to the console
        res.status(500).json({ message: 'An error occurred', error });
    }
});

// Retrieve all images
app.get('/images', getImages);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(500).json({ message: 'Multer error', error: err });
    } else {
        next(err);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
