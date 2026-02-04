import { Router } from 'express';
import { updateProfile } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../utils/validationSchemas.js';

const router = Router();

router.patch('/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;
