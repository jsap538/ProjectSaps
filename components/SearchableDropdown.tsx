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
    <div className={`relative ${className} transition-all duration-300 ${isOpen ? 'transform scale-[1.02]' : ''}`} ref={dropdownRef}>
      <label className="block text-sm font-medium text-porcelain mb-2 transition-colors duration-200">
        {label}
      </label>
      
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full rounded-xl border px-4 py-3 text-left text-porcelain placeholder-nickel focus:ring-titanium/20 focus:outline-none transition-all duration-300 flex items-center justify-between transform ${
          isOpen 
            ? 'border-titanium bg-graphite/80 shadow-lg shadow-titanium/10 scale-[1.01]' 
            : 'border-porcelain/20 bg-ink hover:border-titanium/40 hover:bg-graphite/60'
        }`}
      >
        <span className={`transition-colors duration-200 ${selectedValues.length === 0 ? 'text-nickel' : 'text-porcelain'}`}>
          {getDisplayText()}
        </span>
        <ChevronDown 
          className={`h-4 w-4 transition-all duration-300 ${
            isOpen 
              ? 'rotate-180 text-titanium scale-110' 
              : 'text-nickel hover:text-titanium'
          }`} 
        />
      </button>

      <div className={`absolute z-50 w-full mt-2 rounded-xl border bg-graphite/95 backdrop-blur shadow-soft transition-all duration-500 ease-out transform origin-top ${
        isOpen 
          ? 'opacity-100 scale-100 translate-y-0 border-titanium/30 shadow-lg shadow-titanium/10' 
          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none border-porcelain/20'
      }`}>
        {/* Search Input */}
        <div className={`p-4 border-b border-porcelain/10 transition-all duration-300 ${isOpen ? 'transform translate-x-0' : 'transform -translate-x-2'}`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${isOpen ? 'text-titanium' : 'text-nickel'}`} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-ink text-porcelain placeholder-nickel focus:ring-titanium/20 focus:outline-none transition-all duration-300 ${
                isOpen ? 'border-titanium/50 focus:border-titanium' : 'border-porcelain/20'
              }`}
            />
          </div>
        </div>

        {/* Selected Items */}
        {selectedValues.length > 0 && (
          <div className={`p-4 border-b border-porcelain/10 transition-all duration-400 ${isOpen ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-4 opacity-0'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-nickel">Selected ({selectedValues.length}):</span>
              <button
                onClick={handleClearAll}
                className="text-sm text-titanium hover:text-porcelain transition-all duration-200 font-medium hover:scale-105"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedValues.map((value, index) => (
                <span
                  key={value}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-titanium/15 text-titanium text-sm font-medium border border-titanium/20 transition-all duration-200 hover:scale-105 hover:bg-titanium/20 ${
                    isOpen ? 'animate-in slide-in-from-left-2' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {value}
                  <button
                    onClick={() => handleRemoveSelection(value)}
                    className="hover:text-porcelain transition-all duration-200 hover:scale-110"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Options List */}
        <div className={`transition-all duration-500 ${
          isOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        } overflow-y-auto scrollbar-thin scrollbar-thumb-porcelain/20 scrollbar-track-transparent`}>
          {filteredOptions.length === 0 ? (
            <div className={`p-6 text-center text-nickel text-sm transition-all duration-300 ${isOpen ? 'transform translate-y-0 opacity-100' : 'transform translate-y-2 opacity-0'}`}>
              <div className="text-4xl mb-2">🔍</div>
              No {label.toLowerCase()} found
            </div>
          ) : (
            <div className="py-2">
              {filteredOptions.map((option, index) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between group hover:scale-[1.01] ${
                    isOpen 
                      ? 'hover:bg-porcelain/8 animate-in slide-in-from-left-1' 
                      : 'hover:bg-transparent'
                  }`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <span className={`transition-all duration-200 ${isOpen ? 'text-porcelain group-hover:text-titanium' : 'text-nickel'}`}>
                    {option}
                  </span>
                  {selectedValues.includes(option) && (
                    <Check className={`h-4 w-4 text-titanium transition-all duration-300 ${
                      isOpen ? 'animate-in zoom-in-50 scale-100' : 'scale-0'
                    }`} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
