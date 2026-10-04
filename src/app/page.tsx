import { PartyComposition } from '@/types/booking';
import { normalizeBookingResponse } from '@/utils/normalize';
import rawFixtureData from '../../fixtures/search-results.json';
import styles from './page.module.css';
import Link from 'next/link';
import { Rooms } from '@/utils/composition.service';

export default function Home() {
  // Extract and normalize holidays directly from fixtures/search-results.json
  const rawList = Array.isArray(rawFixtureData)
    ? rawFixtureData
    : (rawFixtureData as any)?.holidays || (rawFixtureData as any)?.results || [];

  const normalizedHolidays = normalizeBookingResponse(rawList);

  // Default fallback party composition for link label formatting
  const defaultParty: PartyComposition[] = [{ adults: 2, childAges: [], infants: 0 }];

  return (
    <main className="wrapper py-8">
      <h1 className="text-3xl font-bold mb-4">Holiday Search Test</h1>
      <p className="mb-2 text-slate-700">Please review the `README.md` file for full instructions.</p>
      <p className="mb-4 text-slate-700">Available searches from fixture data:</p>

      <ul className={styles.list}>
        {normalizedHolidays.map((holiday) => {
          return (
            <li key={holiday.id} className={styles.listItem}>
              <Link
                href={`/results?bookingType=holiday&location=${encodeURIComponent(
                  holiday.destination.toLowerCase()
                )}&departureDate=${holiday.departureDate}&partyCompositions=a2`}
              >
                {`
                  ${holiday.hotelName} - ${holiday.destination} (${
                  holiday.boardBasis
                }, ${Rooms.prettyFormat(defaultParty)})
                `}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}