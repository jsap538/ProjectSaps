"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

interface ReportModalProps {
  itemId: string;
  itemTitle: string;
  onClose: () => void;
  onReported?: () => void;
}

const REPORT_REASONS = [
  { value: 'counterfeit', label: 'Counterfeit or Fake Item', description: 'This item appears to be a counterfeit product' },
  { value: 'inappropriate', label: 'Inappropriate Content', description: 'Contains offensive or inappropriate material' },
  { value: 'misleading', label: 'Misleading Description', description: 'Description or photos are misleading' },
  { value: 'prohibited', label: 'Prohibited Item', description: 'Violates marketplace policies' },
  { value: 'spam', label: 'Spam or Scam', description: 'Appears to be spam or a scam' },
  { value: 'copyright', label: 'Copyright Violation', description: 'Uses copyrighted images or content' },
  { value: 'other', label: 'Other', description: 'Other issue not listed above' },
];

export default function ReportModal({ itemId, itemTitle, onClose, onReported }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReason) {
      toast.warning('Please select a reason for reporting');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          reason: selectedReason,
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Report submitted successfully');
        if (data.autoTakenDown) {
          toast.info('Item has been automatically removed for review');
        }
        onReported?.();
        onClose();
      } else {
        toast.error(data.error || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-graphite w-full max-w-lg rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-porcelain/10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-porcelain">
              Report Item
            </h2>
            <p className="text-sm text-gray-600 dark:text-nickel mt-1">
              {itemTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-porcelain transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Reason Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What's wrong with this item? *
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason.value}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedReason === reason.value
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-porcelain/20 hover:border-gray-300 dark:hover:border-porcelain/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reason.value}
                      checked={selectedReason === reason.value}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        selectedReason === reason.value
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300 dark:border-porcelain/40'
                      }`}>
                        {selectedReason === reason.value && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-porcelain">
                          {reason.label}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-nickel">
                          {reason.description}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-porcelain/20 bg-white dark:bg-onyx px-4 py-3 text-gray-900 dark:text-porcelain focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Provide any additional information that might help our review..."
              />
              <p className="text-xs text-gray-500 dark:text-nickel mt-1">
                {description.length} / 1000 characters
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-porcelain/20 text-gray-700 dark:text-porcelain font-medium hover:bg-gray-50 dark:hover:bg-porcelain/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedReason || submitting}
              className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 dark:text-nickel mt-4 text-center">
            False reports may result in account suspension
          </p>
        </form>
      </div>
    </div>
  );
}


