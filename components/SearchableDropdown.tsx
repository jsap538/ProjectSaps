"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

interface SearchableDropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  multiple?: boolean;
  className?: string;
}

export default function SearchableDropdown({
  label,
  placeholder,
  options,
  selectedValues,
  onSelectionChange,
  multiple = true,
  className = ""
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  useEffect(() => {
    const filtered = options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const handleOptionClick = (option: string) => {
    if (multiple) {
      const newSelection = selectedValues.includes(option)
        ? selectedValues.filter(value => value !== option)
        : [...selectedValues, option];
      onSelectionChange(newSelection);
    } else {
      onSelectionChange([option]);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleRemoveSelection = (value: string) => {
    const newSelection = selectedValues.filter(selected => selected !== value);
    onSelectionChange(newSelection);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      return selectedValues[0];
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-sm font-medium text-porcelain mb-2">
        {label}
      </label>
      
      <button
        type="button"
        onClick={handleToggle}
        className="w-full rounded-xl border border-porcelain/20 bg-ink px-4 py-3 text-left text-porcelain placeholder-nickel focus:border-titanium focus:ring-titanium/20 focus:outline-none transition-colors duration-sap flex items-center justify-between"
      >
        <span className={selectedValues.length === 0 ? 'text-nickel' : 'text-porcelain'}>
          {getDisplayText()}
        </span>
        <ChevronDown 
          className={`h-4 w-4 text-nickel transition-transform duration-sap ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 rounded-xl border border-porcelain/20 bg-graphite/95 backdrop-blur shadow-soft animate-in slide-in-from-top-2 duration-200">
          {/* Search Input */}
          <div className="p-4 border-b border-porcelain/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-nickel" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-porcelain/20 bg-ink text-porcelain placeholder-nickel focus:border-titanium focus:ring-titanium/20 focus:outline-none transition-colors duration-sap"
              />
            </div>
          </div>

          {/* Selected Items */}
          {selectedValues.length > 0 && (
            <div className="p-4 border-b border-porcelain/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-nickel">Selected ({selectedValues.length}):</span>
                <button
                  onClick={handleClearAll}
                  className="text-sm text-titanium hover:text-porcelain transition-colors duration-sap font-medium"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedValues.map(value => (
                  <span
                    key={value}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-titanium/15 text-titanium text-sm font-medium border border-titanium/20"
                  >
                    {value}
                    <button
                      onClick={() => handleRemoveSelection(value)}
                      className="hover:text-porcelain transition-colors duration-sap"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-porcelain/20 scrollbar-track-transparent">
            {filteredOptions.length === 0 ? (
              <div className="p-6 text-center text-nickel text-sm">
                <div className="text-4xl mb-2">🔍</div>
                No {label.toLowerCase()} found
              </div>
            ) : (
              <div className="py-2">
                {filteredOptions.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className="w-full px-4 py-3 text-left hover:bg-porcelain/8 transition-all duration-200 flex items-center justify-between group"
                    style={{ animationDelay: `${index * 20}ms` }}
                  >
                    <span className="text-porcelain group-hover:text-titanium transition-colors duration-200">{option}</span>
                    {selectedValues.includes(option) && (
                      <Check className="h-4 w-4 text-titanium animate-in zoom-in-50 duration-200" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
