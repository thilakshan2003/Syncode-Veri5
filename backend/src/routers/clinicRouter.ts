import { Router } from 'express';
import { getClinics, getClinic } from '../controllers/clinicController.js';

const router = Router();

router.get('/', getClinics);
router.get('/:id', getClinic);

export default router;