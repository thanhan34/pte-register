interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
  flag: string;
}

interface State {
  name: string;
  state_code?: string;
}

interface CountryStateResponse {
  error: boolean;
  msg: string;
  data: {
    name: string;
    iso3: string;
    iso2: string;
    states: State[];
  };
}

// Fallback data for Vietnam provinces
const vietnamProvinces = [
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
  'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cần Thơ', 'Cao Bằng', 'Đà Nẵng',
  'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp',
  'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh',
  'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên',
  'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng',
  'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An',
  'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình',
  'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng',
  'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa',
  'Thừa Thiên Huế', 'Tiền Giang', 'TP Hồ Chí Minh', 'Trà Vinh', 'Tuyên Quang',
  'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
];

// Popular countries for PTE students
const popularCountries = [
  { name: 'Vietnam', code: 'VN' },
  { name: 'Australia', code: 'AU' },
  { name: 'Canada', code: 'CA' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'Singapore', code: 'SG' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Japan', code: 'JP' },
  { name: 'South Korea', code: 'KR' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Indonesia', code: 'ID' }
];

class LocationService {
  private countriesCache: Country[] | null = null;
  private statesCache: Map<string, State[]> = new Map();

  async getCountries(): Promise<Country[]> {
    if (this.countriesCache) {
      return this.countriesCache;
    }

    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Not in browser environment');
      }

      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flag');
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      
      const countries: Country[] = await response.json();
      
      // Validate the response structure
      if (!Array.isArray(countries)) {
        throw new Error('Invalid countries data format');
      }

      // Sort countries with popular ones first, then alphabetically
      const sortedCountries = countries
        .filter(country => country && country.name && country.name.common)
        .sort((a, b) => {
          const aIsPopular = popularCountries.some(pc => pc.code === a.cca2);
          const bIsPopular = popularCountries.some(pc => pc.code === b.cca2);
          
          if (aIsPopular && !bIsPopular) return -1;
          if (!aIsPopular && bIsPopular) return 1;
          
          // Vietnam always first
          if (a.cca2 === 'VN') return -1;
          if (b.cca2 === 'VN') return 1;
          
          return a.name.common.localeCompare(b.name.common);
        });

      this.countriesCache = sortedCountries;
      return sortedCountries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      
      // Return fallback popular countries
      const fallbackCountries = popularCountries.map(country => ({
        name: { common: country.name, official: country.name },
        cca2: country.code,
        cca3: country.code,
        flag: ''
      }));
      
      this.countriesCache = fallbackCountries;
      return fallbackCountries;
    }
  }

  async getStatesByCountry(countryName: string): Promise<State[]> {
    // Check cache first
    if (this.statesCache.has(countryName)) {
      return this.statesCache.get(countryName)!;
    }

    // Special handling for Vietnam
    if (countryName.toLowerCase() === 'vietnam' || countryName.toLowerCase() === 'viet nam') {
      const vietnamStates = vietnamProvinces.map(province => ({ name: province }));
      this.statesCache.set(countryName, vietnamStates);
      return vietnamStates;
    }

    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country: countryName }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch states');
      }

      const data: CountryStateResponse = await response.json();
      
      if (data.error || !data.data || !data.data.states) {
        throw new Error('Invalid response format');
      }

      const states = data.data.states.sort((a, b) => a.name.localeCompare(b.name));
      this.statesCache.set(countryName, states);
      return states;
    } catch (error) {
      console.error(`Error fetching states for ${countryName}:`, error);
      
      // Return empty array for countries without states or on error
      const emptyStates: State[] = [];
      this.statesCache.set(countryName, emptyStates);
      return emptyStates;
    }
  }

  // Clear cache if needed
  clearCache(): void {
    this.countriesCache = null;
    this.statesCache.clear();
  }
}

export const locationService = new LocationService();
export type { Country, State };
