/**
 * DynamicFormFields Component
 * Renders category-specific fields based on the selected category
 */

import { CategoryField } from '@/data/categoryFields';

interface DynamicFormFieldsProps {
  fields: CategoryField[];
  formData: Record<string, any>;
  onChange: (name: string, value: any) => void;
}

export default function DynamicFormFields({ fields, formData, onChange }: DynamicFormFieldsProps) {
  if (fields.length === 0) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const renderField = (field: CategoryField) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'text':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
              {field.unit && <span className="text-gray-400 text-xs ml-1">({field.unit})</span>}
            </label>
            <input
              type="text"
              name={field.name}
              value={value}
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
            />
            {field.helpText && (
              <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
              {field.unit && <span className="text-gray-400 text-xs ml-1">({field.unit})</span>}
            </label>
            <input
              type="number"
              name={field.name}
              value={value}
              onChange={handleChange}
              required={field.required}
              min={field.min}
              max={field.max}
              step="0.5"
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
            />
            {field.helpText && (
              <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
              {field.unit && <span className="text-gray-400 text-xs ml-1">({field.unit})</span>}
            </label>
            <select
              name={field.name}
              value={value}
              onChange={handleChange}
              required={field.required}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
            >
              <option value="">Select {field.label}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.helpText && (
              <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              name={field.name}
              value={value}
              onChange={handleChange}
              required={field.required}
              rows={4}
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
            />
            {field.helpText && (
              <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-[#1f2329] rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
      <h2 className="text-xl font-semibold text-dark dark:text-white mb-6">
        Category-Specific Details
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {fields.map(field => renderField(field))}
      </div>
    </div>
  );
}

