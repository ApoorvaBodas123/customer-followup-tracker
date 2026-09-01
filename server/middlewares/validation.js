// Custom validation middleware for Customer payloads

export const validateCustomer = (req, res, next) => {
  const { name, email, phone, followUpInterval, lastContactedAt } = req.body;
  const errors = [];

  // 1. Name validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Customer name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (name.trim().length > 100) {
    errors.push('Name cannot exceed 100 characters');
  }

  // 2. Contact validation (must have at least one of email or phone)
  const trimmedEmail = email ? email.trim() : '';
  const trimmedPhone = phone ? phone.trim() : '';

  if (!trimmedEmail && !trimmedPhone) {
    errors.push('At least one contact method (email or phone) is required');
  }

  if (trimmedEmail) {
    const emailRegex = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(trimmedEmail)) {
      errors.push('Invalid email address format');
    }
  }

  if (trimmedPhone) {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      errors.push('Invalid phone number format');
    }
  }

  // 3. Follow-up interval validation
  if (followUpInterval === undefined || followUpInterval === null || followUpInterval === '') {
    errors.push('Follow-up interval (in days) is required');
  } else {
    const intervalNum = Number(followUpInterval);
    if (isNaN(intervalNum) || !Number.isInteger(intervalNum)) {
      errors.push('Follow-up interval must be a valid integer');
    } else if (intervalNum <= 0) {
      errors.push('Follow-up interval must be at least 1 day');
    }
  }

  // 4. Last contacted date validation
  if (lastContactedAt) {
    const contactDate = new Date(lastContactedAt);
    if (isNaN(contactDate.getTime())) {
      errors.push('Last contacted date is not a valid date');
    } else {
      const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);
      if (contactDate > tenMinutesFromNow) {
        errors.push('Last contacted date cannot be in the future');
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};
