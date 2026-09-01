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

  // 2. Phone validation (Required)
  const trimmedPhone = phone ? String(phone).trim() : '';
  if (!trimmedPhone) {
    errors.push('Phone number is required');
  } else {
    const cleanDigits = trimmedPhone.replace(/\D/g, '');
    const validPhonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
    if (cleanDigits.length < 10 || cleanDigits.length > 15 || !validPhonePattern.test(trimmedPhone)) {
      errors.push('Please enter a valid 10 to 15 digit phone number (e.g. +91 9876543210 or 9876543210)');
    }
  }

  // 3. Email validation (Optional, but if provided must be strictly valid)
  const trimmedEmail = email ? String(email).trim() : '';
  if (trimmedEmail) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      errors.push('Invalid email address format (e.g. name@example.com)');
    }
  }

  // 4. Follow-up interval validation
  if (followUpInterval === undefined || followUpInterval === null || followUpInterval === '') {
    errors.push('Follow-up interval (in days) is required');
  } else {
    const intervalNum = Number(followUpInterval);
    if (isNaN(intervalNum) || !Number.isInteger(intervalNum)) {
      errors.push('Follow-up interval must be a valid whole number');
    } else if (intervalNum <= 0) {
      errors.push('Follow-up interval must be at least 1 day');
    }
  }

  // 5. Last contacted date validation
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
      message: errors[0],
      errors,
    });
  }

  next();
};
