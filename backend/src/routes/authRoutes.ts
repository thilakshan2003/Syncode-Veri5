import { Router } from 'express';
import { signup, login, googleCallback, me, logout } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { signupSchema, loginSchema, googleLoginSchema } from '../utils/validationSchemas.js';

import fs from 'fs';
const router = Router();
fs.appendFileSync('DEBUG.log', `${new Date().toISOString()} - AuthRoutes loading...\n`);

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/google', validate(googleLoginSchema), googleCallback);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;
