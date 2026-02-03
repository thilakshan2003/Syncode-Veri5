import { Router } from 'express';
import { signup, login, googleCallback, me, logout } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { signupSchema, loginSchema, googleLoginSchema } from '../utils/validationSchemas.js';

import fs from 'fs';
const router = Router();
fs.appendFileSync('DEBUG.log', `${new Date().toISOString()} - AuthRoutes loading...\n`);

//These are all the auth routes
//All requests to these routes will be prefixed with /auth
//They are validated using the validation schemas defined in ../utils/validationSchemas.ts
router.post('/signup', validate(signupSchema), signup); //
router.post('/login', validate(loginSchema), login);
router.post('/google', validate(googleLoginSchema), googleCallback);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;
