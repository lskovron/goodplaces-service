import processEvents from "./processEvents.js";
import processVenues from "./processVenues.js";
import { scrapeDate } from "./utils/puppeteer.js";

const handleWebData = async (dateString) => {
  if (!dateString) return;
  // @TODO: validate date format

  console.log("Scraping events..........");
  const [{ events, venues }, error] = await scrapeDate(
    `https://www.wwoz.org/calendar/livewire-music?date=${dateString}`
  );

  if( error ) {
    console.error(error.msg)
    new Error(`Failed to save new event: ${ev.slug} - ${e}`)
  }
  
  await processEvents(events, dateString)
  await processVenues(venues, dateString)



  //@TODO: catch any failed promise and early return

  // @TODO: abstract the history function?
  // const history = {
  //   dateString,
  //   eventErrors: [],
  //   eventsScraped: true,
  //   eventsScrapedDate: new Date(),
  // }
  // await createOrUpdateHistory(history)
};


export default handleWebData;
