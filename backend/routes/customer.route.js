
import express from 'express';
import {getProfile,updateProfile} from '../controllers/customer.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
const router = express.Router();
// All customer routes require authentication and CUSTOMER role
router.use(authMiddleware);
router.use(roleMiddleware(['CUSTOMER']));

// Get customer profile
router.get('/profile', getProfile);

// Update customer profile
router.put('/profile', updateProfile);

export default router;

