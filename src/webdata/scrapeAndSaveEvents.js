import { getVenueInfo } from "./utils/placesApi.js";
import { scrapeForEvents, scrapeForVenues } from "./utils/puppeteer.js";
import { getAllVenues, saveEvent, saveVenue } from "./utils/mongo.js";
import { getTime } from "./utils/parsers.js";

const scrapeAndSaveEvents = async (date) => {
  if (!date) return;
  // @TODO: validate date format

  console.log("Scraping events..........");
  const todaysEvents = await scrapeForEvents(
    `https://www.wwoz.org/calendar/livewire-music?date=${date}`
  );
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
      await saveEvent(ev)
        .then(() => {
          console.log(`New event saved: ${ev.slug}`);
        })
        .catch((e) => {
          console.error(`Failed to save new event: ${ev.slug} - ${e}`);
        });
    })
  );
  //@TODO: catch any failed promise and early return
};

// console.log('******************** UPDATED VENUES ********************')
// console.log(updatedVenues)

// // get events
// console.log('******************** SCRAPING EVENTS ********************')
// console.log(placeList[0])

// const slug = `https://www.wwoz.org${placeList[0].slug}`;
// const events = await scrapeForEvents(slug);
// console.log(events);
scrapeAndSaveEvents("2023-02-10");

export default scrapeAndSaveEvents;
