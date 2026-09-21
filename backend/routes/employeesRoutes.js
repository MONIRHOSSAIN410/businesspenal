import express from 'express';
import {
  getEmployeeList,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getEmployeeList)
  .post(authorize('admin', 'manager', 'editor'), createEmployee);

router
  .route('/:id')
  .get(getEmployee)
  .put(authorize('admin', 'manager', 'editor'), updateEmployee)
  .delete(authorize('admin', 'manager'), deleteEmployee);

export default router;
