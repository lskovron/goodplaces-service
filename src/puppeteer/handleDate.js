import processEvents from './processEvents.js';
import processHistory from './processHistory.js';
import processVenues from './processVenues.js';
import { scrapeDate } from './utils/puppeteer.js';

const handleDate = async (dateString) => {
  if (!dateString) return;
  // @TODO: validate date format

  console.log(`Scraping data for ${dateString}..........`);
  const [{ events, venues }, error] = await scrapeDate(
    `https://www.wwoz.org/calendar/livewire-music?date=${dateString}`
  );

  if (error) {
    console.error(`Failed to scape date ${dateString} - ${error.msg}`);
  }

  const eventsErr = await processEvents(events, dateString);
  const venueErr = await processVenues(venues, dateString);
  await processHistory(eventsErr, venueErr, dateString);
};

export default handleDate;
