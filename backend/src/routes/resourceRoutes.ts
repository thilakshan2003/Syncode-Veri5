import { Router } from 'express';
import { getResources, getArticleById } from '../controllers/resourceController.js';

const router = Router();

// GET /api/resources?category=SAFE_SEX - Fetch resources by category
router.get('/', getResources);

// GET /api/resources/:id - Fetch a specific article by ID
router.get('/:id', getArticleById);

export default router;