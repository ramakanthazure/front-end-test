'use client';

import React from 'react';
import { DynamicFilterOptions, SelectedFilterState } from '@/utils/filter-sort';

interface FilterSidebarProps {
  meta: DynamicFilterOptions;
  filters: SelectedFilterState;
  onFilterChange: (newFilters: Partial<SelectedFilterState>) => void;
  onReset: () => void;
}

export function FilterSidebar({ meta, filters, onFilterChange, onReset }: FilterSidebarProps) {
  const currentMaxPrice = filters.maxPrice ?? meta.maxPrice;
  const selectedRatings = filters.ratings || [];

  const handleFacilityToggle = (facility: string) => {
    const isSelected = filters.facilities.includes(facility);
    const updated = isSelected
      ? filters.facilities.filter((f) => f !== facility)
      : [...filters.facilities, facility];

    // Only pass the facility partial update
    onFilterChange({ facilities: updated });
  };

  const handleRatingToggle = (star: number) => {
    const isSelected = selectedRatings.includes(star);
    const updated = isSelected
      ? selectedRatings.filter((r) => r !== star)
      : [...selectedRatings, star];

    // Only pass the ratings partial update (undefined when empty to clear param)
    onFilterChange({ ratings: updated.length > 0 ? updated : undefined });
  };

  return (
    <aside className="w-full md:w-64 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-lg font-bold text-slate-800">Filter Results</h2>
        <button
          onClick={onReset}
          className="text-xs text-red-600 hover:text-red-700 font-semibold underline focus:outline-none"
        >
          Reset All
        </button>
      </div>

      {/* Price Range Filter */}
      <div>
        <label htmlFor="price-range" className="block text-sm font-medium text-slate-700 mb-2">
          Max Price per person: <span className="font-bold text-slate-900">£{currentMaxPrice}</span>
        </label>
        <input
          id="price-range"
          type="range"
          min={meta.minPrice}
          max={meta.maxPrice}
          step={50}
          value={currentMaxPrice}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-red-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>£{meta.minPrice}</span>
          <span>£{meta.maxPrice}</span>
        </div>
      </div>

      {/* Star Rating Filter */}
      <div>
        <span className="block text-sm font-medium text-slate-700 mb-2">Star Rating</span>
        <div className="flex gap-2">
          {[3, 4, 5].map((star) => {
            const isSelected = selectedRatings.includes(star);
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingToggle(star)}
                className={`flex-1 py-1.5 px-2 text-xs rounded border transition-colors ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-600 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {star}★
              </button>
            );
          })}
        </div>
      </div>

      {/* Facilities Filter */}
      <div>
        <span className="block text-sm font-medium text-slate-700 mb-2">Hotel Facilities</span>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {meta.availableFacilities.map((facility) => {
            const isChecked = filters.facilities.includes(facility);
            return (
              <label key={facility} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleFacilityToggle(facility)}
                  className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                />
                <span>{facility}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}