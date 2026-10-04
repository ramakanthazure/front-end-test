'use client';

import React from 'react';

interface EmptyStateProps {
  onReset: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm my-4">
      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
        🔍
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">No holidays found</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
        We couldn’t find any options matching all your selected filters. Try broadening your budget or clearing facility selections.
      </p>
      <button
        onClick={onReset}
        className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none"
      >
        Clear all filters
      </button>
    </div>
  );
}