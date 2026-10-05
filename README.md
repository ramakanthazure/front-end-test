
# Virgin Atlantic Front-end Test

Thank you for your interest in joining our front-end team and taking the time to do the test. We think it will provide a nice and interesting challenge and a good talking point for the next stage of the process.

This exercise uses React, TypeScript, and Next.js App Router. The starter app provides sample holiday searches and a fixture-backed results route.

## Rules

You must write the application in React and TypeScript with Next.js. This is already set up in the project.

For the test you should adhere to the following conditions:

1. The code must be your own work. If you use a small external snippet, clearly comment and attribute it.
2. Include the tests you think are appropriate.
3. Give consideration to performance, accessibility, responsive behaviour, and empty states.
4. Code should be clear, concise, typed, and human readable.
5. You may use small, headless, or primitive component libraries where they help, but avoid assembling the page from a large opinionated UI kit. We want to see your component and styling decisions.
6. Use the included CSS setup or whatever CSS approach you are comfortable with.
7. You may use AI tools, but tell us which tools or models you used and what you used them for. You remain responsible for understanding and owning the submitted code.

## What it should do

Build the search results page. It should display useful holiday cards for a selected location and departure date, with enough information for a customer to compare options.

Select the data items you think matter most. As a guide, a useful card might include hotel name, destination, imagery, rating, board basis, duration, price per person, total price, and a small set of facilities or highlights.

Add the ability to filter the results by:

1. Price per person
2. Hotel facilities
3. Star rating

Filters should work together, and customers should be able to clear or reset their choices. Filter state should be reflected in the URL so the page can be refreshed or shared without losing the selected filters. Show a helpful empty state when no holidays match the selected filters.

Add a sort control for:

1. Recommended
2. Price, low to high
3. Rating, high to low

Derive filter options from the fixture data rather than hard-coding them.

We are interested in your judgement as well as the implementation. Make pragmatic decisions about filter usability, missing data, responsive layout, and how much information to show.

## Data

Sample links are provided on the home route as entry points into the results page.

Holiday package data is provided in fixtures/search-results.json. Use this fixture as the source of truth for the exercise; do not integrate with a live API.

The fixture includes varied prices, facilities, rating formats, selected dates, duplicate hotels with different board bases, inconsistent facility casing, long hotel names, and missing image/facility data so the app can be reviewed without relying on a live service.

Typings for the fixture data are provided in src/types/booking.ts.

Treat the fixture as if it came from a real service boundary. We are interested in how you model, normalize, and validate imperfect external data before rendering it. You may use a schema library such as Zod if you think it is appropriate.

## A good result

A good submission should:

1. Render a responsive list of comparable holiday cards.
2. Provide accessible, labelled filter controls.
3. Combine price, facility, and star-rating filters correctly.
4. Preserve filter and sort state in the URL.
5. Derive available filter options from the data.
6. Handle missing images, empty facilities, duplicate/cased facilities, duplicate hotels, long names, and string/number ratings gracefully.
7. Keep component, data-shaping, and filtering logic easy to follow.
8. Include focused tests where they add confidence.

## What we will review

We will focus on:

1. Correct, accessible, responsive UI.
2. Clear state and data flow.
3. Good TypeScript modelling and defensive handling of imperfect data.
4. Sensible test coverage for filtering, rendering, and edge cases.
5. Performance choices such as image sizing, server/client boundaries, and avoiding unnecessary work.

---

## Complete Project File Structure

front-end-test/
├── .babelrc                               # Babel configuration for Jest TypeScript transformation
├── jest.config.js                         # Jest test runner setup with Next.js App Router integration
├── jest.setup.js                          # Testing Environment extensions (@testing-library/jest-dom)
├── tsconfig.json                          # TypeScript compilation options and path aliases
├── package.json                           # Dependencies, dev dependencies, and execution scripts
└── src/
    ├── app/
    │   └── results/
    │       └── page.tsx                   # Next.js Server/Client Page boundary for Search Results
    ├── components/
    │   ├── HolidayCard/
    │   │   ├── HolidayCard.tsx            # Presentational card component for single holiday items
    │   │   ├── HolidayCard.module.css     # Scoped CSS module for card layout & responsive rules
    │   │   └── HolidayCard.test.tsx       # Unit tests for HolidayCard rendering and fallbacks
    │   ├── FilterPanel/
    │   │   ├── FilterPanel.tsx            # Form controls for facilities, price, and rating filters
    │   │   ├── FilterPanel.module.css     # CSS module for filter layout and mobile drawer styling
    │   │   └── FilterPanel.test.tsx       # Component tests for filter selections and reset actions
    │   ├── SortDropdown/
    │   │   ├── SortDropdown.tsx          # Accessible selector for sorting strategies
    │   │   ├── SortDropdown.module.css    # CSS module for sorting dropdown input
    │   │   └── SortDropdown.test.tsx      # Tests for sort change handlers
    │   └── EmptyState/
    │       ├── EmptyState.tsx             # Zero-results feedback component with clear-filter trigger
    │       ├── EmptyState.module.css      # CSS module for empty state layout
    │       └── EmptyState.test.tsx        # Tests for clear filter button triggers
    └── utils/
        ├── normalize.ts                   # Defensive data normalization pipeline
        ├── filter-sort.ts                 # Data filtering and sorting engine
        └── --tests--/
            ├── normalize.test.ts          # Edge-case tests for normalization logic
            └── filter-sort.test.ts        # Combination tests for filtering and sorting functions

---

## Detailed Breakdown of Components & Utility Usage

### UI Component Layer

1. HolidayCard (src/components/HolidayCard/)
Usage & Purpose: Renders individual holiday package details retrieved from normalized dataset models.
Key Features & Responsibility:
- Displays hotel name (with truncated overflow for long names), star rating, board basis badge, duration, price per person, total price, and earned Flying Club miles.
- Implements Next.js <Image/> optimization with local static image fallbacks when image URLs are missing or broken.
- Formats numeric ratings (1–5) into visual star components.

2. FilterPanel (src/components/FilterPanel/)
Usage & Purpose: Form control panel providing user inputs to filter holiday search results.
Key Features & Responsibility:
- Price Range Slider/Input: Sets max price per person threshold.
- Star Rating Selectors: Checkbox choices allowing filtering across 1–5 star ratings.
- Facility Checkboxes: Dynamically rendered facilities derived directly from the normalized dataset (deduplicated and title-cased).
- Reset Action: "Clear All Filters" button resetting all query parameters in the URL.
- Accessibility: Full <label> bindings and keyboard-navigable ARIA states.

3. SortDropdown (src/components/SortDropdown/)
Usage & Purpose: Accessible selector to change sorting criteria for listed holiday cards.
Key Features & Responsibility:
- Options: Recommended, Price: Low to High, Rating: High to Low.
- Syncs active choice directly with the sort search parameter in the URL.

4. EmptyState (src/components/EmptyState/)
Usage & Purpose: Fallback display shown when no holiday matches active filter combinations.
Key Features & Responsibility:
- Provides helpful customer copy and a direct action button to reset active filters without manual checkbox deselecting.

---

### Utility & Core Business Logic Layer

1. Data Normalization Engine (src/utils/normalize.ts)
Usage & Purpose: Cleans raw boundary JSON payload (fixtures/search-results.json) prior to component rendering.
Defensive Mechanisms:
- Facility Deduplication & Normalization: Converts facility strings ("wifi", "Wi-Fi", "WI-FI") to uniform title-cased values ("Wi-Fi") and removes duplicate entries.
- Rating Sanitization: Normalizes string ratings (e.g., "4", "4.5 Stars") and numbers into strict float ranges (1.0 to 5.0).
- Fallback Handling: Maps missing image arrays to fallback placeholder images and assigns default labels for missing board basis or descriptions.

2. Filtering & Sorting Engine (src/utils/filter-sort.ts)
Usage & Purpose: Core engine executing filtering and sorting operations over the normalized dataset.
Key Mechanisms:
- Multi-Filter Combination: Filters holidays against price threshold, active facility tags (AND logic), and selected star ratings.
- Dynamic Sorting: Sorts matching items according to selected criteria (Recommended, Price, Rating).

---

## Data Flow & Architecture Pipeline

[ Raw Fixture JSON ] 
         │
         ▼
[ normalizeHolidays() ]  ───► Sanitizes casing, parses ratings, applies fallbacks
         │
         ▼
[ Derive Filter Options ] ──► Dynamically extracts available facilities & price boundaries
         │
         ▼
[ URL State Sync ]       ───► Syncs Filter/Sort selections via Next.js useSearchParams
         │
         ▼
[ filterAndSortHolidays() ] ─► Computes filtered and ordered array
         │
         ▼
[ UI Components Render ] ──► Renders HolidayCard list, FilterPanel, SortDropdown, or EmptyState

---

## Comprehensive AI Usage & Collaboration Disclosure

AI models (specifically Gemini / LLMs) were utilized throughout development to resolve build environment issues, generate defensive test coverage, and streamline accessibility compliance. The developer retained full ownership over architecture, UI layout, and business logic decisions.

Area / Component | Specific Task / Issue | AI Tool Contribution & Workflow

Tooling & Test Setup:
- Issue: npm test Jest Babel Parser Error ("Missing initializer in const declaration").
- AI Workflow: Analyzed stack trace and provided full @babel/preset-typescript integration for .babelrc and jest.config.js to strip TS annotations before Jest execution.

Data Normalization:
- Issue: Parsing edge-case boundary data from search-results.json.
- AI Workflow: Assisted in writing robust Regex matchers in src/utils/normalize.ts to convert mixed string/number rating representations into standardized numeric types.

Utility Testing:
- Issue: Writing comprehensive test suites in src/utils/--tests--/.
- AI Workflow: Generated mock fixtures containing empty facilities, duplicate entries, missing images, and long titles to test normalize.test.ts and filter-sort.test.ts.

Accessibility (a11y):
- Issue: Keyboard navigation & screen reader accessibility.
- AI Workflow: Audited FilterPanel.tsx and SortDropdown.tsx to ensure semantic HTML tags, explicit <label htmlFor="..."> associations, and appropriate ARIA attributes.

Documentation:
- Issue: Documenting project architecture and technical decisions.
- AI Workflow: Generated structured plain-text documentation summarizing component responsibility, data pipeline flow, and test execution commands.

---

## Supplying your code

Please create and commit your code into a public Github repository and supply the link to the recruiter for review.

Thanks for your time, we look forward to hearing from you!

## Running the app

npm run dev - starts the application in development mode.

npm run build - checks a production build.

npm run lint - runs ESLint.

npm run typecheck - runs TypeScript without emitting files.

npm test - runs the Jest unit and component test suites.

Use Node.js 20.19+, 22.13+, or 24+.
EOF