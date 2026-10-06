'use client';

import React, { useState, useEffect } from 'react';
import { NormalizedHoliday } from '@/utils/normalize';

interface HolidayCardProps {
  holiday: NormalizedHoliday;
}

export function HolidayCard({ holiday }: HolidayCardProps) {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(holiday.pricePerPerson);

  // Preload image in background to ensure it only renders if valid & fully loaded
  useEffect(() => {
    const rawUrl = holiday.imageUrl?.trim();

    if (!rawUrl) {
      setImageStatus('error');
      return;
    }

    const img = new Image();
    img.src = rawUrl;

    img.onload = () => setImageStatus('loaded');
    img.onerror = () => setImageStatus('error');

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [holiday.imageUrl]);

  const showImage = imageStatus === 'loaded';

  return (
    <article className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col md:flex-row">
      {/* Image Container */}
      <div className="relative w-full md:w-64 h-48 md:h-auto bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 overflow-hidden">
        {showImage ? (
          <img
            src={holiday.imageUrl!}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          /* "No Preview Available" Fallback UI */
          <div className="flex flex-col items-center justify-center p-4 text-slate-400 text-center select-none">
            <svg
              className="w-9 h-9 mb-1.5 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs font-medium text-slate-400">
              No Preview Available
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                {holiday.destination} {holiday.subLocation ? `• ${holiday.subLocation}` : ''}
              </span>
              <h3 className="text-xl font-bold text-slate-900 line-clamp-1">
                {holiday.hotelName}
              </h3>
            </div>
            {holiday.rating > 0 && (
              <div
                className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs px-2 py-1 rounded font-medium"
                aria-label={`Rating ${holiday.rating} stars`}
              >
                <span>★</span>
                <span>{holiday.rating}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-600 mt-2">
            Board Basis: <span className="font-medium text-slate-800">{holiday.boardBasis}</span>
          </p>

          {holiday.facilities.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 mt-3" aria-label="Hotel Facilities">
              {holiday.facilities.slice(0, 5).map((facility) => (
                <li
                  key={facility}
                  className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full"
                >
                  {facility}
                </li>
              ))}
              {holiday.facilities.length > 5 && (
                <li className="text-xs text-slate-500 self-center">
                  +{holiday.facilities.length - 5} more
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Pricing Footer */}
        <div className="mt-4 pt-4 border-t flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold text-red-600">{formattedPrice}</span>
            <span className="text-xs text-slate-500 block">per person</span>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none">
            View Deal
          </button>
        </div>
      </div>
    </article>
  );
}