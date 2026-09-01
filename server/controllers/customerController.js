import { Customer } from '../models/Customer.js';

// Helper function to calculate metrics from list of customers
const calculateMetrics = (customers) => {
  let dueToday = 0;
  let overdue = 0;
  let upcoming = 0;

  customers.forEach((c) => {
    const status = c.followUpStatus;
    if (status === 'due_today') dueToday++;
    else if (status === 'overdue') overdue++;
    else if (status === 'upcoming') upcoming++;
  });

  return {
    total: customers.length,
    dueToday,
    overdue,
    upcoming,
  };
};

/**
 * @route   GET /api/customers
 * @desc    Get all customers with optional search, status filtering, and sorting
 */
export const getCustomers = async (req, res) => {
  try {
    const { search, status, sortBy = 'nextFollowUpDate', sortOrder = 'asc' } = req.query;

    let query = {};

    // Search query across name, email, phone, company
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { company: searchRegex },
      ];
    }

    let customers = await Customer.find(query);

    // Filter by calculated status if specified
    if (status && status !== 'all') {
      if (status === 'due') {
        customers = customers.filter(
          (c) => c.followUpStatus === 'due_today' || c.followUpStatus === 'overdue'
        );
      } else {
        customers = customers.filter((c) => c.followUpStatus === status);
      }
    }

    // Dynamic sorting
    customers.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'nextFollowUpDate') {
        const timeA = a.nextFollowUpDate ? a.nextFollowUpDate.getTime() : 0;
        const timeB = b.nextFollowUpDate ? b.nextFollowUpDate.getTime() : 0;
        comparison = timeA - timeB;
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'lastContactedAt') {
        comparison = new Date(a.lastContactedAt).getTime() - new Date(b.lastContactedAt).getTime();
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Calculate metrics across all customers in database
    const allCustomers = await Customer.find({});
    const metrics = calculateMetrics(allCustomers);

    res.status(200).json({
      success: true,
      count: customers.length,
      metrics,
      data: customers,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customers',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/customers/due
 * @desc    Get customers whose follow-up is due today or overdue
 */
export const getDueCustomers = async (req, res) => {
  try {
    const allCustomers = await Customer.find({});
    const dueToday = allCustomers.filter((c) => c.followUpStatus === 'due_today');
    const overdue = allCustomers.filter((c) => c.followUpStatus === 'overdue');
    const metrics = calculateMetrics(allCustomers);

    res.status(200).json({
      success: true,
      metrics,
      dueToday: {
        count: dueToday.length,
        customers: dueToday,
      },
      overdue: {
        count: overdue.length,
        customers: overdue,
      },
    });
  } catch (error) {
    console.error('Error fetching due customers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve due customers',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/customers/metrics
 * @desc    Get overall customer and follow-up metrics
 */
export const getCustomerMetrics = async (req, res) => {
  try {
    const allCustomers = await Customer.find({});
    const metrics = calculateMetrics(allCustomers);

    res.status(200).json({
      success: true,
      metrics,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve metrics',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/customers/:id
 * @desc    Get single customer by ID
 */
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/customers
 * @desc    Create a new customer
 */
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, followUpInterval, lastContactedAt, notes } = req.body;

    const contactDate = lastContactedAt ? new Date(lastContactedAt) : new Date();

    const customer = new Customer({
      name: name.trim(),
      email: email ? email.trim() : undefined,
      phone: phone ? phone.trim() : undefined,
      company: company ? company.trim() : '',
      followUpInterval: Number(followUpInterval),
      lastContactedAt: contactDate,
      notes: notes ? notes.trim() : '',
      contactHistory: [
        {
          contactedAt: contactDate,
          note: 'Initial contact recorded upon customer creation',
        },
      ],
    });

    const savedCustomer = await customer.save();

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: savedCustomer,
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create customer',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/customers/:id
 * @desc    Update an existing customer
 */
export const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, followUpInterval, lastContactedAt, notes } = req.body;

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    if (name !== undefined) customer.name = name.trim();
    if (email !== undefined) customer.email = email.trim();
    if (phone !== undefined) customer.phone = phone.trim();
    if (company !== undefined) customer.company = company.trim();
    if (followUpInterval !== undefined) customer.followUpInterval = Number(followUpInterval);
    if (lastContactedAt !== undefined) customer.lastContactedAt = new Date(lastContactedAt);
    if (notes !== undefined) customer.notes = notes.trim();

    const updatedCustomer = await customer.save();

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: updatedCustomer,
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update customer',
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/customers/:id
 * @desc    Delete a customer
 */
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Customer "${customer.name}" deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/customers/:id/contact
 * @desc    Mark customer as contacted (updates lastContactedAt to current time)
 *          Automatically pushes next follow-up date forward by followUpInterval days.
 */
export const markCustomerContacted = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    const contactedTime = req.body.contactedAt ? new Date(req.body.contactedAt) : new Date();
    const note = req.body.note || 'Regular follow-up call/message completed';

    customer.lastContactedAt = contactedTime;
    customer.contactHistory.unshift({
      contactedAt: contactedTime,
      note,
    });

    const updatedCustomer = await customer.save();

    res.status(200).json({
      success: true,
      message: `Marked "${customer.name}" as contacted. Next follow-up is in ${customer.followUpInterval} days.`,
      data: updatedCustomer,
    });
  } catch (error) {
    console.error('Error marking customer contacted:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record contact',
      error: error.message,
    });
  }
};
