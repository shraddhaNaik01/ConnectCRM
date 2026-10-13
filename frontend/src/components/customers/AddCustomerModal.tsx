import React, { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { CustomerCreatePayload } from '@/services/api';
import { Customer } from '@/types/crm';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCustomer: Customer) => void;
}

export function AddCustomerModal({ isOpen, onClose, onSuccess }: AddCustomerModalProps) {
  const [formData, setFormData] = useState<CustomerCreatePayload>({
    name: '',
    email: '',
    phone: '',
    company: '',
    tier: 'New Customer',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address (e.g., name@domain.com).';
      }
    }

    if (formData.phone && formData.phone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid phone number or leave blank.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const { api } = await import('@/services/api');
      const created = await api.createCustomer(formData);
      onSuccess(created);
      onClose();
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        tier: 'New Customer',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create customer. Please check your inputs.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-2xl border border-[#263449] bg-[#151F32] p-6 shadow-2xl text-[#F1F5F9]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#263449] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-[#60A5FA] border border-blue-500/20">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 id="modal-title" className="text-base font-bold text-[#F1F5F9]">
                Add New Customer
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Create a contact record with full validation and CRM synchronization.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#1B2840] hover:text-[#F1F5F9] transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
              Customer Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="e.g. Eleanor Vance"
              className={`w-full rounded-lg border bg-[#1B2840] px-3.5 py-2 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#60A5FA] transition-colors ${
                errors.name ? 'border-rose-500' : 'border-[#263449]'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="e.g. eleanor.v@company.com"
              className={`w-full rounded-lg border bg-[#1B2840] px-3.5 py-2 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#60A5FA] transition-colors ${
                errors.email ? 'border-rose-500' : 'border-[#263449]'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-400">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder="+1 (555) 000-0000"
                className={`w-full rounded-lg border bg-[#1B2840] px-3.5 py-2 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#60A5FA] transition-colors ${
                  errors.phone ? 'border-rose-500' : 'border-[#263449]'
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-rose-400">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. TechCorp LLC"
                className="w-full rounded-lg border border-[#263449] bg-[#1B2840] px-3.5 py-2 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#60A5FA] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
              Customer Tier
            </label>
            <select
              value={formData.tier}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
              className="w-full rounded-lg border border-[#263449] bg-[#1B2840] px-3 py-2 text-sm text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
            >
              <option value="New Customer">New Customer</option>
              <option value="Regular">Regular</option>
              <option value="Active VIP">Active VIP</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#263449] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-[#263449] bg-[#151F32] px-4 py-2 text-xs font-medium text-[#94A3B8] hover:bg-[#1B2840] hover:text-[#F1F5F9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-[#60A5FA] disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Customer</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
