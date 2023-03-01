import { getVenueInfo } from "./utils/placesApi.js";
import { scrapeForVenues } from "./utils/puppeteer.js";
import { getAllVenues, saveVenue } from "./utils/mongo.js";

const scrapeAndSaveVenues = async (date) => {
  if (!date) return;
  // @TODO: validate date format

  console.log("Scraping venues..........");
  const todaysVenues = await scrapeForVenues(
    `https://www.wwoz.org/calendar/livewire-music?date=${date}`
  );
  console.log(`${todaysVenues.length} venues scraped for date ${date}`);

  console.log("Checking for new venues..........");
  let existingVenues;
  await getAllVenues().then(({ venues }) => {
    existingVenues = venues.map((v) => v.slug);
  });
  const newVenues = todaysVenues.filter(
    ({ slug }) => existingVenues.indexOf(slug) === -1
  );

  if (newVenues.length > 0) {
    console.log(`${newVenues.length} new venue(s) detected`);
    let placeList = [];
    await Promise.all(
      newVenues.map(async (venue) => {
        console.log(`Getting place data for new venue: ${venue.slug}`);
        await getVenueInfo(venue.name).then((res) => {
          placeList.push({
            ...res,
            ...venue,
          });
        });
      })
    );
    //@TODO: catch any failed promise and early return

    console.log("Saving new venues..........");
    await Promise.all(
      placeList.map(async (place) => {
        await saveVenue(place)
          .then(() => {
            console.log(`New venue saved: ${place.slug}`);
          })
          .catch((e) => {
            console.error(`Failed to save new venue: ${place.slug} - ${e}`);
          });
      })
    );
    //@TODO: catch any failed promise and early return
  } else {
    console.log(`No new venues found`);
  }
};

// console.log('******************** UPDATED VENUES ********************')
// console.log(updatedVenues)

// // get events
// console.log('******************** SCRAPING EVENTS ********************')
// console.log(placeList[0])

// const slug = `https://www.wwoz.org${placeList[0].slug}`;
// const events = await scrapeForEvents(slug);
// console.log(events);
scrapeAndSaveVenues("2023-02-11");

export default scrapeAndSaveVenues;
