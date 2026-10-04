import { Holiday } from '@/types/booking';
import { normalizeHoliday } from '../normalize';

describe('normalizeHoliday defensive mapping', () => {
  const sampleHoliday: Holiday = {
    totalPrice: 2398,
    pricePerPerson: 1199,
    flyingClubMiles: 2400,
    virginPoints: 1199,
    tierPoints: 40,
    departureDate: '2026-09-14',
    selectedDate: '2026-09-14',
    hotel: {
      id: 'mco-beach-club-resort',
      name: 'Beach Club Resort',
      boardBasis: 'Room Only',
      content: {
        name: 'Beach Club Resort',
        vRating: '4.5',
        hotelDescription: 'Resort description',
        atAGlance: ['Theme park shuttle'],
        parentLocation: 'Orlando',
        images: [
          {
            RESULTS_CAROUSEL: {
              url: 'https://images.example.test/beach.jpg',
            },
          },
        ],
        holidayType: ['Family'],
        boardBasis: ['Room Only'],
        hotelLocation: ['Lake Buena Vista'],
        accommodationType: ['Hotel'],
        hotelFacilities: ['Pool', 'Free WiFi', 'free wifi'],
        starRating: '4.5',
        propertyType: 'Resort',
      },
    },
  };

  it('converts string star rating to a numeric value', () => {
    const result = normalizeHoliday(sampleHoliday, 0);
    expect(result.rating).toBe(4.5);
    expect(typeof result.rating).toBe('number');
  });

  it('deduplicates facility items regardless of casing', () => {
    const result = normalizeHoliday(sampleHoliday, 0);
    expect(result.facilities).toEqual(['Pool', 'Free WiFi']);
  });

  it('extracts nested RESULTS_CAROUSEL image URLs cleanly', () => {
    const result = normalizeHoliday(sampleHoliday, 0);
    expect(result.imageUrl).toBe('https://images.example.test/beach.jpg');
  });
});