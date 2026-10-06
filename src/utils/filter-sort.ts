import { NormalizedHoliday } from './normalize';

export interface DynamicFilterOptions {
  minPrice: number;
  maxPrice: number;
  availableFacilities: string[];
}

export interface SelectedFilterState {
  maxPrice?: number;
  ratings?: number[]; // Updated to store array of selected star values (e.g., [3, 4])
  facilities: string[];
  sortBy?: 'recommended' | 'price_asc' | 'rating_desc';
}

export function deriveFilterOptions(holidays: NormalizedHoliday[]): DynamicFilterOptions {
  if (!holidays || holidays.length === 0) {
    return { minPrice: 0, maxPrice: 1000, availableFacilities: [] };
  }

  const prices = holidays.map((h) => h.pricePerPerson);
  const minPrice = Math.floor(Math.min(...prices));
  const maxPrice = Math.ceil(Math.max(...prices));

  const facilitySet = new Set<string>();
  holidays.forEach((h) => {
    h.facilities.forEach((f) => facilitySet.add(f));
  });

  return {
    minPrice,
    maxPrice,
    availableFacilities: Array.from(facilitySet).sort(),
  };
}

export function filterAndSortHolidays(
  holidays: NormalizedHoliday[],
  filters: SelectedFilterState
): NormalizedHoliday[] {
  return holidays
    .filter((holiday) => {
      // 1. Max price check
      if (filters.maxPrice !== undefined && holiday.pricePerPerson > filters.maxPrice) {
        return false;
      }

      // 2. Multi-select range-based rating check
      if (filters.ratings && filters.ratings.length > 0) {
        const rating = holiday.rating;
        const matchesAnySelectedRange = filters.ratings.some((star) => {
          if (star === 3) return rating >= 3 && rating < 4;
          if (star === 4) return rating >= 4 && rating < 5;
          if (star === 5) return rating >= 5;
          return false;
        });

        if (!matchesAnySelectedRange) {
          return false;
        }
      }

      // 3. Facilities check (must match all selected facilities)
      if (filters.facilities && filters.facilities.length > 0) {
        const hasAllFacilities = filters.facilities.every((f) =>
          holiday.facilities.includes(f)
        );
        if (!hasAllFacilities) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price_asc') {
        return a.pricePerPerson - b.pricePerPerson;
      }
      if (filters.sortBy === 'rating_desc') {
        return b.rating - a.rating;
      }
      return 0; // 'recommended' preserves default ordering
    });
}