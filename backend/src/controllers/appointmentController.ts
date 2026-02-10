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

export const cancelAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const appointmentId = req.params.appointmentId;

        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        if (!appointmentId) {
            res.status(400).json({ error: 'Appointment ID is required' });
            return;
        }

        const appointment = await appointmentService.cancelAppointment(userId, appointmentId);
        res.status(200).json({ 
            success: true, 
            message: 'Appointment cancelled successfully',
            appointment 
        });
    } catch (error: any) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ error: error.message || 'Failed to cancel appointment' });
    }
};

