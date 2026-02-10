import express from 'express';
import * as appointmentController from '../controllers/appointmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(authenticate);

router.post('/', appointmentController.createAppointment);
router.delete('/:appointmentId', appointmentController.cancelAppointment);

export default router;
