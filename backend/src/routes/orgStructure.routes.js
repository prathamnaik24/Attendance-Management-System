import { Router } from 'express';
import { getDepartments, getPositionsTree } from '../controllers/admin/orgStructure.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/departments', getDepartments);
router.get('/positions', getPositionsTree);

export default router;
