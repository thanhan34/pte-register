'use client';

import { useState, useEffect } from 'react';
import SearchableSelect from './SearchableSelect';
import { locationService, Country, State } from '../utils/locationService';

interface LocationSelectorProps {
  country: string;
  province: string;
  onCountryChange: (country: string) => void;
  onProvinceChange: (province: string) => void;
}

export default function LocationSelector({
  country,
  province,
  onCountryChange,
  onProvinceChange
}: LocationSelectorProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);

  // Load countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoadingCountries(true);
        const countriesData = await locationService.getCountries();
        setCountries(countriesData || []);
      } catch (error) {
        console.error('Error loading countries:', error);
        setCountries([]);
      } finally {
        setLoadingCountries(false);
      }
    };

    // Only load countries in browser environment
    if (typeof window !== 'undefined') {
      loadCountries();
    } else {
      setLoadingCountries(false);
    }
  }, []);

  // Load states when country changes
  useEffect(() => {
    const loadStates = async () => {
      if (!country) {
        setStates([]);
        return;
      }

      try {
        setLoadingStates(true);
        const statesData = await locationService.getStatesByCountry(country);
        setStates(statesData || []);
        
        // Reset province if it's not in the new states list
        if (province && statesData && statesData.length > 0) {
          const provinceExists = statesData.some(state => state.name === province);
          if (!provinceExists) {
            onProvinceChange('');
          }
        }
      } catch (error) {
        console.error('Error loading states:', error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    // Only load states in browser environment
    if (typeof window !== 'undefined' && country) {
      loadStates();
    }
  }, [country, province, onProvinceChange]);

  // Convert countries to options format
  const countryOptions = countries.map(country => ({
    value: country.name.common,
    label: country.name.common,
    flag: country.flag
  }));

  // Convert states to options format
  const stateOptions = states.map(state => ({
    value: state.name,
    label: state.name
  }));

  const handleCountryChange = (selectedCountry: string) => {
    onCountryChange(selectedCountry);
    // Reset province when country changes
    onProvinceChange('');
  };

  return (
    <div className="space-y-4">
      {/* Country Selector */}
      <SearchableSelect
        label="Quốc gia"
        options={countryOptions}
        value={country}
        onChange={handleCountryChange}
        placeholder="Chọn quốc gia..."
        loading={loadingCountries}
        required={true}
      />

      {/* Province/State Selector */}
      <SearchableSelect
        label="Tỉnh/Thành phố"
        options={stateOptions}
        value={province}
        onChange={onProvinceChange}
        placeholder={
          !country 
            ? "Vui lòng chọn quốc gia trước"
            : loadingStates 
            ? "Đang tải danh sách tỉnh/thành phố..."
            : stateOptions.length === 0
            ? "Không có dữ liệu tỉnh/thành phố"
            : "Chọn tỉnh/thành phố..."
        }
        loading={loadingStates}
        disabled={!country}
        required={stateOptions.length > 0}
      />

      {/* Info message for countries without states */}
      {country && !loadingStates && stateOptions.length === 0 && (
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Quốc gia này không có dữ liệu tỉnh/thành phố chi tiết. Bạn có thể để trống trường này.</span>
          </div>
        </div>
      )}
    </div>
  );
}
