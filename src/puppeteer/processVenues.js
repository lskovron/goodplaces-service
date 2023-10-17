import { createOrUpdateVenue, getAllVenueSlugs } from "../mongo/utils";
import { parseVenue } from "./utils/parsers";

const processVenues = async (venues, dateString) => {
  console.log("Saving new venues..........");
  console.log(`${venues.length} venues scraped for date ${dateString}`);

  console.log("Checking for new venues..........");
  let errors = [];
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
}

export default processVenues;