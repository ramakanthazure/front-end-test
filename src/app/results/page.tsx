'use client';

import React, { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import rawFixtureData from '../../../fixtures/search-results.json';
import { normalizeBookingResponse } from '@/utils/normalize';
import { deriveFilterOptions, filterAndSortHolidays } from '@/utils/filter-sort';
import { FilterSidebar } from '../components/FilterSidebar';
import { SortControl } from '../components/SortControl';
import { EmptyState } from '../components/EmptyState';
import { HolidayCard } from '../components/HolidayCard';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const location = searchParams.get('location') || 'Orlando';
  const departureDate = searchParams.get('departureDate') || '2026-09-14';

  const holidays = useMemo(() => {
    let rawList: any[] = [];
    if (Array.isArray(rawFixtureData)) {
      rawList = rawFixtureData;
    } else if (Array.isArray((rawFixtureData as any)?.holidays)) {
      rawList = (rawFixtureData as any).holidays;
    } else if (Array.isArray((rawFixtureData as any)?.results)) {
      rawList = (rawFixtureData as any).results;
    }
    return normalizeBookingResponse(rawList);
  }, []);

  const meta = useMemo(() => deriveFilterOptions(holidays), [holidays]);

  const selectedMaxPrice = searchParams.get('price')
    ? Number(searchParams.get('price'))
    : meta.maxPrice;

  // Parse multi-select ratings from query param e.g. "3,4" -> [3, 4]
  const selectedRatings = searchParams.get('ratings')
    ? searchParams.get('ratings')!.split(',').map(Number).filter(Boolean)
    : undefined;

  const selectedFacilities = searchParams.get('facilities')
    ? searchParams.get('facilities')!.split(',').filter(Boolean)
    : [];

  const sortBy = (searchParams.get('sort') as any) || 'recommended';

  const filteredHolidays = useMemo(() => {
    return filterAndSortHolidays(holidays, {
      maxPrice: selectedMaxPrice,
      ratings: selectedRatings,
      facilities: selectedFacilities,
      sortBy,
    });
  }, [holidays, selectedMaxPrice, selectedRatings, selectedFacilities, sortBy]);

  const handleUpdateParams = (updates: Record<string, string | number | undefined | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.get('bookingType')) params.set('bookingType', searchParams.get('bookingType')!);
    if (searchParams.get('location')) params.set('location', searchParams.get('location')!);
    if (searchParams.get('departureDate')) params.set('departureDate', searchParams.get('departureDate')!);
    if (searchParams.get('partyCompositions')) params.set('partyCompositions', searchParams.get('partyCompositions')!);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Search results</h1>
        <p className="text-slate-600 text-sm mt-1">
          Showing fixture results for <span className="font-semibold capitalize">{location}</span> departing {departureDate}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <FilterSidebar
            meta={meta}
            filters={{
              maxPrice: selectedMaxPrice,
              ratings: selectedRatings,
              facilities: selectedFacilities,
              sortBy,
            }}
            onFilterChange={(newFilters) => {
              handleUpdateParams({
                price: newFilters.maxPrice,
                ratings: newFilters.ratings?.join(','),
                facilities: newFilters.facilities?.join(','),
              });
            }}
            onReset={handleResetFilters}
          />
        </div>

        <div className="md:col-span-3 space-y-4">
          <SortControl
            currentSort={sortBy}
            resultCount={filteredHolidays.length}
            onSortChange={(newSort) => handleUpdateParams({ sort: newSort })}
          />

          {filteredHolidays.length > 0 ? (
            <div className="space-y-4">
              {filteredHolidays.map((holiday, idx) => (
                <HolidayCard key={holiday.id || `holiday-${idx}`} holiday={holiday} />
              ))}
            </div>
          ) : (
            <EmptyState onReset={handleResetFilters} />
          )}
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading holiday search results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}