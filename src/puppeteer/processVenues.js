import { createOrUpdateVenue, getAllVenueSlugs } from "../mongo/utils.js";
import { parseVenue } from "./utils/parsers.js";

const processVenues = async (venues, dateString) => {
  console.log("Saving new venues..........");
  console.log(`${venues.length} venues scraped for date ${dateString}`);

  console.log("Checking for new venues..........");
  let venueErrors = [];
  const existingVenues = await getAllVenueSlugs();
  const newVenues = venues.filter(
    ({ slug }) => existingVenues.indexOf(slug) === -1
  ).map(parseVenue);

  if (newVenues.length > 0) {
    console.log(`${newVenues.length} new venue(s) detected`);
    let placeList = [];
    await Promise.all(
      newVenues.map(async (venue) => {
        console.log(`Getting place data for new venue: ${venue.slug}`);
        placeList.push(venue)
      })
    );

    console.log("Saving new venues..........");
    await Promise.all(
      placeList.map(async (place) => {
        await createOrUpdateVenue(place)
          .then(() => {
            console.log(`New venue saved: ${place.slug}`);
          })
          .catch((e) => {
            venueErrors.push(place.slug);
            console.error(`Failed to save new venue: ${place.slug} - ${e}`);
          });
      })
    );
    //@TODO: catch any failed promise and early return
  } else {
    console.log(`No new venues found`);
  }
  return venueErrors;
}

export default processVenues;