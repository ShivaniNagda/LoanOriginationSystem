import express from 'express';
import {apply,getCustomerLoans,getStatus} from '../controllers/loan.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
const router = express.Router();


router.post('/apply', authMiddleware, roleMiddleware(['CUSTOMER']), apply);

// Get all loans for logged-in customer (must come before /:id/status)
router.get('/customer/my-loans', authMiddleware, roleMiddleware(['CUSTOMER']), getCustomerLoans);

// Get loan status
router.get('/:id/status', authMiddleware, getStatus);

export default router;

