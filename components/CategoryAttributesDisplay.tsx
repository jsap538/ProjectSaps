/**
 * CategoryAttributesDisplay Component
 * Displays category-specific attributes on item detail pages
 */

import { CATEGORY_CONFIGS } from '@/data/categoryFields';

interface CategoryAttributesDisplayProps {
  category: string;
  attributes: Record<string, any>;
}

export default function CategoryAttributesDisplay({ category, attributes }: CategoryAttributesDisplayProps) {
  const categoryConfig = CATEGORY_CONFIGS[category];
  
  if (!categoryConfig || !attributes || Object.keys(attributes).length === 0) {
    return null;
  }

  // Filter out empty/null values
  const validAttributes = Object.entries(attributes).filter(([_, value]) => 
    value !== null && value !== undefined && value !== ''
  );

  if (validAttributes.length === 0) {
    return null;
  }

  // Helper function to format field labels nicely
  const formatLabel = (fieldName: string): string => {
    const field = categoryConfig.fields.find(f => f.name === fieldName);
    if (field) {
      return field.label + (field.unit ? ` (${field.unit})` : '');
    }
    // Fallback: convert camelCase to Title Case
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Helper function to format values nicely
  const formatValue = (fieldName: string, value: any): string => {
    const field = categoryConfig.fields.find(f => f.name === fieldName);
    
    if (field?.type === 'number' && field.unit) {
      return `${value}${field.unit === 'inches' ? '"' : field.unit === 'cm' ? ' cm' : field.unit === 'mm' ? ' mm' : ''}`;
    }
    
    return String(value);
  };

  return (
    <div className="mb-6 rounded-2xl border border-porcelain/10 bg-graphite/60 p-6 shadow-subtle">
      <h2 className="mb-5 text-lg font-semibold text-porcelain">
        {categoryConfig.label} Details
      </h2>
      <dl className="space-y-4">
        {validAttributes.map(([key, value], index) => (
          <div 
            key={key}
            className={`flex justify-between ${
              index < validAttributes.length - 1 ? 'border-b border-porcelain/10 pb-3' : ''
            }`}
          >
            <dt className="text-sm text-nickel">{formatLabel(key)}</dt>
            <dd className="text-sm font-medium text-porcelain text-right">
              {formatValue(key, value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

