import express from 'express';
import { chatWithAI } from '../controllers/aiController.js';
import { optionalAuth } from '../middleware/optionalAuth.js';

const router = express.Router();

router.post('/chat', optionalAuth, chatWithAI);

export default router;
