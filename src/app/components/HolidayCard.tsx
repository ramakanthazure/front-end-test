'use client';

import React from 'react';
import { NormalizedHoliday } from '@/utils/normalize';

interface HolidayCardProps {
  holiday: NormalizedHoliday;
}

export function HolidayCard({ holiday }: HolidayCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(holiday.pricePerPerson);

  return (
    <article className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col md:flex-row">
      {/* Image Container */}
      <div className="relative w-full md:w-64 h-48 md:h-auto bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400">
        {holiday.imageUrl ? (
          <img
            src={holiday.imageUrl}
            alt={holiday.hotelName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <span className="text-xs">No Image Available</span>
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