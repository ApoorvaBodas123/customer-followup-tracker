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

  const calculatedNextDate = calculateNextDate(formData.lastContactedAt, formData.followUpInterval);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    const intervalNum = Number(formData.followUpInterval);
    if (!formData.followUpInterval || isNaN(intervalNum)) {
      newErrors.followUpInterval = 'Interval must be a valid number';
    } else if (!Number.isInteger(intervalNum)) {
      newErrors.followUpInterval = 'Interval must be a whole number';
    } else if (intervalNum <= 0) {
      newErrors.followUpInterval = 'Interval must be at least 1 day';
    }

    if (!formData.lastContactedAt) {
      newErrors.lastContactedAt = 'Last contacted date is required';
    } else {
      const selectedDate = new Date(formData.lastContactedAt);
      const today = new Date();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#e2dbcb] p-6 sm:p-7 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-[#e2dbcb]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#4cc9b1]/20 text-[#0f766e]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEditing ? 'Edit Customer' : 'Add Customer'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? 'Update customer profile and schedule' : 'Set contact details and follow-up rhythm'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#f4f1ec] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#f4f1ec] border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                  errors.name
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-400'
                    : 'border-[#e2dbcb] focus:border-[#4cc9b1] focus:ring-[#4cc9b1]'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number <span className="text-slate-400 font-normal">(e.g. 9876543210)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#f4f1ec] border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                    errors.phone
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-400'
                      : 'border-[#e2dbcb] focus:border-[#4cc9b1] focus:ring-[#4cc9b1]'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#f4f1ec] border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                    errors.email
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-400'
                      : 'border-[#e2dbcb] focus:border-[#4cc9b1] focus:ring-[#4cc9b1]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Company (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Company / Organization <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Logistics"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4f1ec] border border-[#e2dbcb] focus:border-[#4cc9b1] focus:ring-1 focus:ring-[#4cc9b1] text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Follow-up Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Follow-up Interval */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Follow-up Interval <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="7"
                  value={formData.followUpInterval}
                  onChange={(e) => handleChange('followUpInterval', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#f4f1ec] border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                    errors.followUpInterval
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-400'
                      : 'border-[#e2dbcb] focus:border-[#4cc9b1] focus:ring-[#4cc9b1]'
                  }`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                  days
                </span>
              </div>
              {errors.followUpInterval && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.followUpInterval}
                </p>
              )}
            </div>

            {/* Last Contacted Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Last Contacted Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                max={formatDateForInput()}
                value={formData.lastContactedAt}
                onChange={(e) => handleChange('lastContactedAt', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#f4f1ec] border text-sm text-slate-900 focus:outline-none focus:ring-1 ${
                  errors.lastContactedAt
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-400'
                    : 'border-[#e2dbcb] focus:border-[#4cc9b1] focus:ring-[#4cc9b1]'
                }`}
              />
              {errors.lastContactedAt && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.lastContactedAt}
                </p>
              )}
            </div>
          </div>

          {/* Next Follow-up Live Preview Banner */}
          {calculatedNextDate && (
            <div className="p-3 rounded-xl bg-[#4cc9b1]/15 border border-[#4cc9b1]/40 flex items-center justify-between text-xs text-[#0f766e]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0d9488] shrink-0" />
                <span className="font-semibold">Next follow-up calculated:</span>
              </div>
              <span className="font-bold text-slate-900">
                {formatDate(calculatedNextDate)}
              </span>
            </div>
          )}

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Notes / Context <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Contract discussion, requested product demo..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#f4f1ec] border border-[#e2dbcb] focus:border-[#4cc9b1] focus:ring-1 focus:ring-[#4cc9b1] text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-[#e2dbcb] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#e2dbcb] bg-[#f4f1ec] hover:bg-[#e2dbcb] text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#4cc9b1] hover:bg-[#38b8a0] text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-[#4cc9b1]/30 transition-all disabled:opacity-50"
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
