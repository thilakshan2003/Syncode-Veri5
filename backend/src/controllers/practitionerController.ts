import type { Request, Response } from 'express';
import * as practitionerService from '../services/practitionerService.js';

export const getPractitioners = async (req: Request, res: Response) => {
    try {
        const { clinicId, role, availability } = req.query;

        const filters: any = {
            role: role as string,
            availability: availability as string,
        };
        if (clinicId) filters.clinicId = BigInt(clinicId as string);

        const practitioners = await practitionerService.getAllPractitioners(filters);
        res.json(practitioners);
    } catch (error) {
        console.error('Error fetching practitioners:', error);
        res.status(500).json({ error: 'Failed to fetch practitioners', details: error instanceof Error ? error.message : String(error) });
    }
};

export const getPractitionerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: 'Practitioner ID is required' });
            return;
        }

        const practitioner = await practitionerService.getPractitionerById(String(id));

        if (!practitioner) {
            res.status(404).json({ error: 'Practitioner not found' });
            return;
        }

        res.json(practitioner);
    } catch (error) {
        console.error(`Error fetching practitioner ${req.params.id}:`, error);
        res.status(500).json({
            error: 'Failed to fetch practitioner details',
            details: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getSpecializations = async (req: Request, res: Response) => {
    try {
        const specializations = await practitionerService.getSpecializations();
        res.json(specializations);
    } catch (error) {
        console.error('Error fetching specializations:', error);
        res.status(500).json({ error: 'Failed to fetch specializations' });
    }
};
