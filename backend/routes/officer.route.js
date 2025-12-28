import express from 'express';
import {getPendingLoans,reviewLoan,getOfficerLoans} from '../controllers/officer.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
const router = express.Router();

// All officer routes require authentication and OFFICER role
router.use(authMiddleware);
router.use(roleMiddleware(['OFFICER']));

// Get all pending loan applications
router.get('/loans/pending',getPendingLoans);

// Review loan (approve/reject)
router.post('/loans/:id/review', reviewLoan);

// Get all loans reviewed by officer
router.get('/loans/my-reviews', getOfficerLoans);

export default router;

