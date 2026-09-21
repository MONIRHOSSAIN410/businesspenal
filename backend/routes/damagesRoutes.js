import express from 'express';
import {
  getDamageList,
  getDamage,
  createDamage,
  updateDamage,
  deleteDamage,
} from '../controllers/damageController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getDamageList)
  .post(authorize('admin', 'manager', 'editor'), createDamage);

router
  .route('/:id')
  .get(getDamage)
  .put(authorize('admin', 'manager', 'editor'), updateDamage)
  .delete(authorize('admin', 'manager'), deleteDamage);

export default router;
