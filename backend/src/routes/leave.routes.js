import { Router } from 'express';
import {
  requestLeave,
  getMyLeaves,
  getTeamPendingLeaves,
  actionLeaveRequest,
  getLeaveTypes,
} from '../controllers/leave.controller.js';
import { requireAuth } from '../middlewares/auth.js';
import { requireTenant } from '../middlewares/tenant.js';

const router = Router();

// Apply auth and tenant isolation globally to all leave routes
router.use(requireAuth);
router.use(requireTenant);

router.post('/request', requestLeave);
router.get('/types', getLeaveTypes);
router.get('/me', getMyLeaves);
router.get('/team/pending', getTeamPendingLeaves);
router.patch('/request/:id/action', actionLeaveRequest);

export default router;
