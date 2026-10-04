import { NormalizedHoliday } from './normalize';

export interface DynamicFilterOptions {
  maxPrice: number;
  minPrice: number;
  availableFacilities: string[];
  availableRatings: number[];
}

export interface SelectedFilterState {
  maxPrice?: number;
  minRating?: number;
  facilities: string[];
  sortBy: 'recommended' | 'price_asc' | 'rating_desc';
}

export function deriveFilterOptions(holidays: NormalizedHoliday[]): DynamicFilterOptions {
  let maxPrice = 0;
  let minPrice = Infinity;
  const facilitySet = new Set<string>();
  const ratingSet = new Set<number>();

  holidays.forEach((h) => {
    if (h.pricePerPerson > maxPrice) maxPrice = h.pricePerPerson;
    if (h.pricePerPerson < minPrice) minPrice = h.pricePerPerson;

    h.facilities.forEach((f) => facilitySet.add(f));
    if (h.rating > 0) ratingSet.add(h.rating);
  });

  return {
    maxPrice: Math.ceil(maxPrice) || 3000,
    minPrice: minPrice === Infinity ? 0 : Math.floor(minPrice),
    availableFacilities: Array.from(facilitySet).sort(),
    availableRatings: Array.from(ratingSet).sort((a, b) => b - a),
  };
}

export function filterAndSortHolidays(
  holidays: NormalizedHoliday[],
  filters: SelectedFilterState
): NormalizedHoliday[] {
  return holidays
    .filter((h) => {
      // 1. Max Price Filter
      if (filters.maxPrice !== undefined && h.pricePerPerson > filters.maxPrice) {
        return false;
      }
      // 2. Minimum Star Rating Filter
      if (filters.minRating !== undefined && h.rating < filters.minRating) {
        return false;
      }
      // 3. Facilities Filter (AND logic)
      if (filters.facilities.length > 0) {
        const hasAllFacilities = filters.facilities.every((requiredFac) =>
          h.facilities.some(
            (f) => f.toLowerCase() === requiredFac.toLowerCase()
          )
        );
        if (!hasAllFacilities) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.pricePerPerson - b.pricePerPerson;
        case 'rating_desc':
          return b.rating - a.rating;
        case 'recommended':
        default:
          return 0; // Preserves raw fixture order
      }
    });
}

export type { NormalizedHoliday };
