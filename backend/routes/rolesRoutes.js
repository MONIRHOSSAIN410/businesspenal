import express from 'express';
import {
  getRoleList,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/roleController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getRoleList)
  .post(authorize('admin', 'manager', 'editor'), createRole);

router
  .route('/:id')
  .get(getRole)
  .put(authorize('admin', 'manager', 'editor'), updateRole)
  .delete(authorize('admin', 'manager'), deleteRole);

export default router;
