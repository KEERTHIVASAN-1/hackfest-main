import express from 'express';
import { chatWithAI, analyzeImageWithAI } from '../controllers/aiController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    },
});

const router = express.Router();

// Protected routes - require authentication
router.post('/chat', authenticate, chatWithAI);
router.post('/analyze-image', authenticate, upload.single('image'), analyzeImageWithAI);

export default router;
