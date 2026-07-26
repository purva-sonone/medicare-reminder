import express from 'express';
import {
    getMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    getTodayMedicines,
} from '../controllers/medicineController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Today route must be BEFORE /:id to avoid parsing 'today' as an id
router.get('/today', protect, getTodayMedicines);

router.route('/')
    .get(protect, getMedicines)
    .post(protect, createMedicine);

router.route('/:id')
    .put(protect, updateMedicine)
    .delete(protect, deleteMedicine);

export default router;
