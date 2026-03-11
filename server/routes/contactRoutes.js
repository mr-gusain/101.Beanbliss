import express from 'express';
import { submitContactForm, getContactSubmissions } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContactForm);
router.get('/', protect, admin, getContactSubmissions);

export default router;
