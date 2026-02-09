import { Router } from 'express';
import { getTestKits, getTestKit } from '../controllers/testKitController.js';

const router = Router();

router.get('/', getTestKits);
router.get('/:id', getTestKit);

export default router;
