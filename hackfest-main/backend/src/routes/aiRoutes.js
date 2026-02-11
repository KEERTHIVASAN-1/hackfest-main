import express from 'express';
import { chatWithAI } from '../controllers/aiController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected route - requires authentication
router.post('/chat', authenticate, chatWithAI);

export default router;
