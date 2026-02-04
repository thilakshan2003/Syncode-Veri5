import type { Request, Response } from 'express';
import * as clinicService from '../services/clinicService.js';

export const getClinics = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const clinics = search
      ? await clinicService.searchClinicsByName(search as string)
      : await clinicService.getAllClinics();
    res.json(clinics);
  } catch (error) {
    console.error('Error fetching clinics:', error);
    res.status(500).json({ error: 'Failed to fetch clinics' });
  }
};

export const getClinic = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) return res.status(400).json({ error: 'Clinic id is required' });
    const clinic = await clinicService.getClinicById(BigInt(id));
    if (!clinic) return res.status(404).json({ error: 'Clinic not found' });
    res.json(clinic);
  } catch (error) {
    console.error('Error fetching clinic:', error);
    res.status(500).json({ error: 'Failed to fetch clinic' });
  }
};