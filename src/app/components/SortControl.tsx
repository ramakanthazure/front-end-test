'use client';

import React from 'react';

interface SortControlProps {
  currentSort: 'recommended' | 'price_asc' | 'rating_desc';
  onSortChange: (sortBy: 'recommended' | 'price_asc' | 'rating_desc') => void;
  resultCount: number;
}

export function SortControl({ currentSort, onSortChange, resultCount }: SortControlProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-3">
      <span className="text-sm font-medium text-slate-600" aria-live="polite">
        Showing <strong className="text-slate-900">{resultCount}</strong> holidays
      </span>

      <div className="flex items-center gap-2">
        <label htmlFor="sort-select" className="text-sm text-slate-600 font-medium">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
        >
          <option value="recommended">Recommended</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="rating_desc">Star Rating: High to Low</option>
        </select>
      </div>
    </div>
  );
}