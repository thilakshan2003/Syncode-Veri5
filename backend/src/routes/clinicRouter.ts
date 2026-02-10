import { Router } from 'express';
import { getClinics, getClinic, getClinicPractitioners, getStaffDashboard } from '../controllers/clinicController.js';

const router = Router();

router.get('/', getClinics);
router.get('/:id/practitioners', getClinicPractitioners);
router.get('/:id', getClinic);
router.get('/:slug/staff-dashboard', getStaffDashboard);

export default router;