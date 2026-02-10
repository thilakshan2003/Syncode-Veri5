import { Router } from 'express';
import { getClinics, getClinic, getClinicPractitioners } from '../controllers/clinicController.js';

const router = Router();

router.get('/', getClinics);
router.get('/:id/practitioners', getClinicPractitioners);
router.get('/:id', getClinic);

export default router;