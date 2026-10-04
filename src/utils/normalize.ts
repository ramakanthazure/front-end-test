import { Holiday, HotelContent } from '@/types/booking';

export interface NormalizedHoliday {
  id: string;
  hotelName: string;
  destination: string;
  subLocation: string;
  rating: number;
  pricePerPerson: number;
  totalPrice: number;
  departureDate: string;
  boardBasis: string;
  facilities: string[];
  highlights: string[];
  imageUrl: string | null;
  virginPoints: number;
  tierPoints: number;
}

export function normalizeHoliday(holiday: Holiday, index: number): NormalizedHoliday {
  const hotel = holiday?.hotel;
  const content: Partial<HotelContent> = hotel?.content || {};

  // Safe Rating Parsing (handles string "4.5", number 4.5, and missing values)
  const rawRating = content.starRating ?? content.vRating ?? 0;
  let rating = typeof rawRating === 'string' ? parseFloat(rawRating) : Number(rawRating);
  if (isNaN(rating) || rating < 0) rating = 0;

  // Facilities Normalization (deduplication & casing cleanup)
  const facilityMap = new Map<string, string>();
  const rawFacilities = Array.isArray(content.hotelFacilities) ? content.hotelFacilities : [];

  rawFacilities.forEach((f) => {
    if (typeof f === 'string' && f.trim()) {
      const clean = f.trim();
      const key = clean.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!facilityMap.has(key)) {
        facilityMap.set(key, clean.charAt(0).toUpperCase() + clean.slice(1));
      }
    }
  });

  // Deeply nested image URL extraction
  let imageUrl: string | null = null;
  if (Array.isArray(content.images) && content.images.length > 0) {
    const firstImg = content.images[0];
    if (firstImg?.RESULTS_CAROUSEL?.url) {
      imageUrl = firstImg.RESULTS_CAROUSEL.url;
    }
  }

  // Board Basis resolution
  let boardBasis = hotel?.boardBasis || 'Room Only';
  if (Array.isArray(content.boardBasis) && content.boardBasis.length > 0) {
    boardBasis = content.boardBasis[0];
  }

  // Generate a guaranteed unique composite ID using hotel.id and array index
  const baseId = hotel?.id || 'holiday';
  const uniqueId = `${baseId}-${index}`;

  return {
    id: uniqueId,
    hotelName: content.name || hotel?.name || 'Featured Accommodation',
    destination: content.parentLocation || 'Destination',
    subLocation: Array.isArray(content.hotelLocation) && content.hotelLocation.length > 0
      ? content.hotelLocation[0]
      : '',
    rating,
    pricePerPerson: Number(holiday.pricePerPerson || 0),
    totalPrice: Number(holiday.totalPrice || 0),
    departureDate: holiday.departureDate || holiday.selectedDate || '',
    boardBasis,
    facilities: Array.from(facilityMap.values()),
    highlights: Array.isArray(content.atAGlance) ? content.atAGlance : [],
    imageUrl,
    virginPoints: Number(holiday.virginPoints || 0),
    tierPoints: Number(holiday.tierPoints || 0),
  };
}

export function normalizeBookingResponse(holidays: Holiday[]): NormalizedHoliday[] {
  if (!Array.isArray(holidays)) return [];
  return holidays.map((holiday, idx) => normalizeHoliday(holiday, idx));
}