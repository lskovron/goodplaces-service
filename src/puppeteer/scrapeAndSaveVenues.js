import { getVenueInfo } from "./utils/placesApi.js";
import { scrapeForVenues } from "./utils/puppeteer.js";
// import { getAllVenues, saveVenue } from "./utils/mongo.js";
import { createOrUpdateHistory, createOrUpdateVenue, getAllVenueSlugs } from "../mongo/utils.js";

const scrapeAndSaveVenues = async (date) => {
  if (!date) return;
  // @TODO: validate date format

  console.log("Scraping venues..........");
  const [todaysVenues, error] = await scrapeForVenues(
    `https://www.wwoz.org/calendar/livewire-music?date=${date}`
  );

  if( error ) {
    console.error(error.msg)
    return;
  }

  console.log(`${todaysVenues.length} venues scraped for date ${date}`);

  console.log("Checking for new venues..........");
  let errors = [];
  const existingVenues = await getAllVenueSlugs();
  const newVenues = todaysVenues.filter(
    ({ slug }) => existingVenues.indexOf(slug) === -1
  );

  if (newVenues.length > 0) {
    console.log(`${newVenues.length} new venue(s) detected`);
    let placeList = [];
    await Promise.all(
      newVenues.map(async (venue) => {
        console.log(`Getting place data for new venue: ${venue.slug}`);
        placeList.push({
          lat: 29.9511,
          lng: -90.0715,
          address: "123 Canal St",
          ...venue,
        })
        // @TODO: implement google places integration
        // @TODO: decide what to do google API errors
        // await getVenueInfo(venue.name).then((res) => {
        //   placeList.push({
        //     ...res,
        //     ...venue,
        //   });
        // }).catch((e) => {
        //   placeErrors.push({
        //     ...venue,
        //     error: e
        //   })
        //   console.error(`Error getting place data for ${place.slug}`)
        // });
      })
    );

    const errorTest = ["test-venue-slug","hello-world","pikachu","123-venue"]
    errors.push(...errorTest)

    console.log("Saving new venues..........");
    await Promise.all(
      placeList.map(async (place) => {
        await createOrUpdateVenue(place)
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

  // @TODO: abstract the history function?
  const history = {
    dateString: date,
    venuesScraped: true,
    venuesScrapedDate: new Date(),
  }
  if( errors.length ) history.venueErrors = errors;
  await createOrUpdateHistory(history)
};

export default scrapeAndSaveVenues;
