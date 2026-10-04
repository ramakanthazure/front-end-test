import { filterAndSortHolidays } from '../filter-sort';
import { NormalizedHoliday } from '../normalize';

describe('filterAndSortHolidays engine', () => {
  const mockHolidays: NormalizedHoliday[] = [
    {
      id: '1',
      hotelName: 'Alpha Hotel',
      destination: 'Orlando',
      subLocation: '',
      rating: 3,
      pricePerPerson: 500,
      totalPrice: 1000,
      departureDate: '2026-09-14',
      boardBasis: 'Room Only',
      facilities: ['Pool', 'WiFi'],
      highlights: [],
      imageUrl: null,
      virginPoints: 500,
      tierPoints: 10,
    },
    {
      id: '2',
      hotelName: 'Beta Hotel',
      destination: 'Orlando',
      subLocation: '',
      rating: 5,
      pricePerPerson: 1200,
      totalPrice: 2400,
      departureDate: '2026-09-14',
      boardBasis: 'All Inclusive',
      facilities: ['Pool', 'WiFi', 'Gym'],
      highlights: [],
      imageUrl: null,
      virginPoints: 1200,
      tierPoints: 20,
    },
  ];

  it('filters by max price correctly', () => {
    const results = filterAndSortHolidays(mockHolidays, {
      maxPrice: 600,
      facilities: [],
      sortBy: 'recommended',
    });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('1');
  });

  it('sorts by price ascending', () => {
    const results = filterAndSortHolidays(mockHolidays, {
      facilities: [],
      sortBy: 'price_asc',
    });
    expect(results[0].pricePerPerson).toBe(500);
    expect(results[1].pricePerPerson).toBe(1200);
  });
});