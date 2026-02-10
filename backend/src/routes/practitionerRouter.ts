import express from 'express';
import * as practitionerController from '../controllers/practitionerController.js';

const router = express.Router();

router.get('/', practitionerController.getPractitioners);
router.get('/specializations', practitionerController.getSpecializations);
router.get('/:id', practitionerController.getPractitionerById);

export default router;
