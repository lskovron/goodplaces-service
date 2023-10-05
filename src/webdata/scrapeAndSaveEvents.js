import { scrapeForEvents } from "./utils/puppeteer.js";
import { getTime } from "./utils/parsers.js";
import { createOrUpdateEvent, createOrUpdateHistory } from "../mongo/utils.js";

const scrapeAndSaveEvents = async (date) => {
  if (!date) return;
  // @TODO: validate date format

  console.log("Scraping events..........");
  const [todaysEvents, error] = await scrapeForEvents(
    `https://www.wwoz.org/calendar/livewire-music?date=${date}`
  );

  if( error ) {
    console.error(error.msg)
    return;
  }
  
  console.log(`${todaysEvents.length} events scraped for date ${date}`);

  let parsedEvents = todaysEvents.map((ev) => ({
    slug: ev.id,
    time: getTime(ev),
    title: ev.name,
    date,
    venueSlug: "30-90", // @TODO: obviously replace this
  }));

  console.log(parsedEvents);

  console.log("Saving new events..........");
  await Promise.all(
    parsedEvents.map(async (ev) => {
      await createOrUpdateEvent(ev)
        .then(() => {
          console.log(`New event saved: ${ev.slug}`);
        })
        .catch((e) => {
          console.error(`Failed to save new event: ${ev.slug} - ${e}`);
        });
    })
  );
  //@TODO: catch any failed promise and early return

  // @TODO: abstract the history function?
  const history = {
    dateString: date,
    eventErrors: [],
    eventsScraped: true,
    eventsScrapedDate: new Date(),
  }
  await createOrUpdateHistory(history)
};


export default scrapeAndSaveEvents;
