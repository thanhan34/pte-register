'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
  flag?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  label: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  loading = false,
  disabled = false,
  required = false,
  label
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get display value
  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : '';

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (selectedValue: string) => {
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
    onChange(selectedValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputClick = () => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setHighlightedIndex(-1);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-base font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={loading ? 'Đang tải...' : placeholder}
          disabled={disabled || loading}
          required={required}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[#fc5d01] focus:border-[#fc5d01]
            ${disabled || loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}
            ${isOpen ? 'ring-2 ring-[#fc5d01] border-[#fc5d01]' : ''}
            text-base
          `}
          autoComplete="off"
        />
        
        {/* Dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-[#fc5d01] border-t-transparent rounded-full"></div>
          ) : (
            <svg
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 text-sm">
              Không tìm thấy kết quả
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(option.value);
                }}
                className={`
                  px-3 py-2 cursor-pointer text-sm flex items-center space-x-2
                  ${index === highlightedIndex ? 'bg-[#fedac2]' : 'hover:bg-[#fedac2]'}
                  ${value === option.value ? 'bg-[#fdbc94] text-[#fc5d01] font-medium' : 'text-gray-900'}
                `}
              >
                {option.flag && (
                  <span className="text-lg mr-2">{option.flag}</span>
                )}
                <span>{option.label}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
