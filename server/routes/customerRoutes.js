import express from 'express';
import {
  getCustomers,
  getDueCustomers,
  getCustomerMetrics,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  markCustomerContacted,
} from '../controllers/customerController.js';
import { validateCustomer } from '../middlewares/validation.js';

const router = express.Router();

// Specific routes first to avoid route parameter collision
router.get('/due', getDueCustomers);
router.get('/metrics', getCustomerMetrics);

// General customer CRUD routes
router.route('/')
  .get(getCustomers)
  .post(validateCustomer, createCustomer);

router.route('/:id')
  .get(getCustomerById)
  .put(validateCustomer, updateCustomer)
  .delete(deleteCustomer);

// Follow-up contact action
router.post('/:id/contact', markCustomerContacted);

export default router;
