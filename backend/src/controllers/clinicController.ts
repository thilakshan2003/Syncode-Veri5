import type { Request, Response } from 'express';
import * as clinicService from '../services/clinicService.js';
import * as practitionerService from '../services/practitionerService.js';

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

export const getClinicPractitioners = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) return res.status(400).json({ error: 'Clinic id is required' });

    const practitionerLinks = await practitionerService.getPractitionersByClinic(BigInt(id));
    const practitioners = practitionerLinks.map((link) => link.practitioner);
    res.json(practitioners);
  } catch (error) {
    console.error('Error fetching clinic practitioners:', error);
    res.status(500).json({ error: 'Failed to fetch clinic practitioners' });
  }
};

export const getStaffDashboard = async (req: Request, res: Response) => {
  try {
    const rawSlug = req.params.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

    if (!slug) return res.status(400).json({ error: 'Clinic slug is required' });

    const clinic = await clinicService.getClinicBySlug(slug);
    if (!clinic) return res.status(404).json({ error: 'Clinic not found' });

    const data = await clinicService.getStaffDashboardData(clinic.id);
    res.json({
      clinicName: clinic.name,
      ...data
    });
  } catch (error) {
    console.error('Error fetching staff dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch staff dashboard' });
  }
};