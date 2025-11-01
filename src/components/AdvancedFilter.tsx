/**
 * Advanced Filter Component - Multi-criteria filtering
 */

import { useState } from 'react';
import { Filter, X, Plus, Search } from 'lucide-react';
import { Button } from './Button';

export interface FilterCriterion {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  value: string | number | [number, number];
}

interface AdvancedFilterProps {
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select';
    options?: Array<{ value: string; label: string }>;
  }>;
  onApplyFilters: (filters: FilterCriterion[]) => void;
  onClear: () => void;
}

export function AdvancedFilter({ fields, onApplyFilters, onClear }: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCriterion[]>([]);

  const addFilter = () => {
    const newFilter: FilterCriterion = {
      id: Date.now().toString(),
      field: fields[0].key,
      operator: 'equals',
      value: '',
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, updates: Partial<FilterCriterion>) => {
    setFilters(filters.map(f => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleApply = () => {
    onApplyFilters(filters.filter(f => f.value !== '' && f.value !== null));
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters([]);
    onClear();
    setIsOpen(false);
  };

  const getOperatorOptions = (fieldType: string) => {
    switch (fieldType) {
      case 'number':
      case 'date':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'greaterThan', label: 'Greater than' },
          { value: 'lessThan', label: 'Less than' },
          { value: 'between', label: 'Between' },
        ];
      case 'select':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'in', label: 'In' },
        ];
      default:
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'contains', label: 'Contains' },
        ];
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        Filters
        {filters.length > 0 && (
          <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-white rounded-full">
            {filters.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[600px] bg-dark-card border border-dark-border rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-dark-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-dark-text-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
            {filters.length === 0 ? (
              <div className="text-center py-8 text-dark-text-muted">
                <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No filters added yet</p>
              </div>
            ) : (
              filters.map((filter) => {
                const field = fields.find(f => f.key === filter.field);
                return (
                  <div key={filter.id} className="flex items-center gap-2 p-3 bg-dark-hover rounded-lg">
                    {/* Field Select */}
                    <select
                      value={filter.field}
                      onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
                      className="flex-1 bg-dark-bg text-white border border-dark-border rounded px-3 py-2 text-sm"
                    >
                      {fields.map(f => (
                        <option key={f.key} value={f.key}>
                          {f.label}
                        </option>
                      ))}
                    </select>

                    {/* Operator Select */}
                    <select
                      value={filter.operator}
                      onChange={(e) => updateFilter(filter.id, { operator: e.target.value as any })}
                      className="bg-dark-bg text-white border border-dark-border rounded px-3 py-2 text-sm"
                    >
                      {getOperatorOptions(field?.type || 'text').map(op => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>

                    {/* Value Input */}
                    {field?.type === 'select' && field.options ? (
                      <select
                        value={filter.value as string}
                        onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                        className="flex-1 bg-dark-bg text-white border border-dark-border rounded px-3 py-2 text-sm"
                      >
                        <option value="">Select...</option>
                        {field.options.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field?.type === 'number' ? 'number' : 'text'}
                        value={filter.value as string}
                        onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                        placeholder="Value..."
                        className="flex-1 bg-dark-bg text-white border border-dark-border rounded px-3 py-2 text-sm"
                      />
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFilter(filter.id)}
                      className="text-dark-text-muted hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}

            <button
              onClick={addFilter}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:text-primary-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Filter
            </button>
          </div>

          <div className="p-4 border-t border-dark-border flex items-center justify-between gap-3">
            <Button onClick={handleClear} variant="secondary" className="flex-1">
              Clear All
            </Button>
            <Button onClick={handleApply} className="flex-1">
              <Search className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

