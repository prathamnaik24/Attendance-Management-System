import { Router } from 'express';
import { getRoles, getPermissions, assignPermissions } from '../controllers/admin/role.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', getRoles);
router.get('/permissions', getPermissions);
router.post('/:roleId/permissions', assignPermissions);

export default router;
