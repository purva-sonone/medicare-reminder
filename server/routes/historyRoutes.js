import express from 'express';
import { logHistory, getHistory } from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, logHistory)
    .get(protect, getHistory);

export default router;
