import { type Request, type Response } from 'express';
import * as appointmentService from '../services/appointmentService.js';

export const createAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slotId } = req.body;

        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        if (!slotId) {
            res.status(400).json({ error: 'Slot ID is required' });
            return;
        }

        const appointment = await appointmentService.createAppointment(userId, slotId);
        res.status(201).json(appointment);
    } catch (error: any) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: error.message || 'Failed to create appointment' });
    }
};
