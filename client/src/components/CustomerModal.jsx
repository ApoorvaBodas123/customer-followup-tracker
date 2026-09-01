import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, Building2, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { formatDateForInput, calculateNextDate, formatDate } from '../utils/dateUtils';

export const CustomerModal = ({ isOpen, onClose, onSave, initialData = null, isSubmitting = false }) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    followUpInterval: 7,
    lastContactedAt: formatDateForInput(),
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        company: initialData.company || '',
        followUpInterval: initialData.followUpInterval || 7,
        lastContactedAt: formatDateForInput(initialData.lastContactedAt),
        notes: initialData.notes || '',
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        company: '',
        followUpInterval: 7,
        lastContactedAt: formatDateForInput(),
        notes: '',
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Real-time calculation of Next Follow-up Date preview
  const calculatedNextDate = calculateNextDate(formData.lastContactedAt, formData.followUpInterval);

  // Form validation
  const validate = () => {
    const newErrors = {};

    // 1. Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // 2. Contact validation (phone or email)
    const hasPhone = Boolean(formData.phone.trim());
    const hasEmail = Boolean(formData.email.trim());

    if (!hasPhone && !hasEmail) {
      newErrors.phone = 'At least one contact method (Phone or Email) is required';
      newErrors.email = 'At least one contact method (Phone or Email) is required';
    }

    if (hasEmail) {
      const emailRegex = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (hasPhone) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    // 3. Follow-up interval
    const intervalNum = Number(formData.followUpInterval);
    if (!formData.followUpInterval || isNaN(intervalNum)) {
      newErrors.followUpInterval = 'Interval must be a valid number';
    } else if (!Number.isInteger(intervalNum)) {
      newErrors.followUpInterval = 'Interval must be a whole number';
    } else if (intervalNum <= 0) {
      newErrors.followUpInterval = 'Interval must be at least 1 day';
    }

    // 4. Last Contacted Date
    if (!formData.lastContactedAt) {
      newErrors.lastContactedAt = 'Last contacted date is required';
    } else {
      const selectedDate = new Date(formData.lastContactedAt);
      const today = new Date();
      // Set today to end of day for forgiving comparison
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        newErrors.lastContactedAt = 'Last contacted date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      followUpInterval: Number(formData.followUpInterval),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? 'Edit Customer' : 'Add Customer'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing ? 'Update customer profile and schedule' : 'Set contact details and follow-up rhythm'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Customer Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                  errors.name
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number <span className="text-slate-500 font-normal">(e.g. 9876543210)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                    errors.phone
                      ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                    errors.email
                      ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Company (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Company / Organization <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Logistics"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder:text-slate-600 focus:outline-none"
            />
          </div>

          {/* Follow-up Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Follow-up Interval */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Follow-up Interval <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="7"
                  value={formData.followUpInterval}
                  onChange={(e) => handleChange('followUpInterval', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                    errors.followUpInterval
                      ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500'
                  }`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">
                  days
                </span>
              </div>
              {errors.followUpInterval && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.followUpInterval}
                </p>
              )}
            </div>

            {/* Last Contacted Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Last Contacted Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                max={formatDateForInput()}
                value={formData.lastContactedAt}
                onChange={(e) => handleChange('lastContactedAt', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-sm text-white focus:outline-none focus:ring-1 ${
                  errors.lastContactedAt
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500'
                }`}
              />
              {errors.lastContactedAt && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.lastContactedAt}
                </p>
              )}
            </div>
          </div>

          {/* Next Follow-up Live Preview Banner */}
          {calculatedNextDate && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Next follow-up calculated:</span>
              </div>
              <span className="font-bold text-white">
                {formatDate(calculatedNextDate)}
              </span>
            </div>
          )}

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Notes / Context <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Contract discussion, requested product demo..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder:text-slate-600 focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : isEditing
                ? 'Save Changes'
                : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
