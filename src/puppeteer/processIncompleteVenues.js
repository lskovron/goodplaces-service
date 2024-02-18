import { getVenueInfo } from "./utils/placesApi.js";
import { getIncompleteVenueSlugs, updateVenueData } from "../mongo/utils.js";

const processIncompleteVenues = async () => {
  console.log("Finding incomplete venues..........");
  // get all values without "dateScraped" property
  const incompletePlaces = await getIncompleteVenueSlugs();

  // loop through them all and get the data
  if (incompletePlaces.length > 0) {
    console.log(`Scraping Google places API for ${incompletePlaces.length} venues`);
    let placeList = [];
    await Promise.all(
      incompletePlaces.map(async ({ slug, name }) => {
        console.log(`Getting place data for venue: ${slug}`);
        // @TODO: decide what to do google API errors
        await getVenueInfo(name).then((res) => {
          placeList.push({
            ...res,
            slug, 
            name,
            hasError: false
          });
        }).catch((e) => {
          placeList.push({
            slug, 
            name,
            hasError: true
          })
          console.error(`Error getting place data for ${slug} - ${e}`)
        });
      })
    );

    // loop through them all and save to Mongo
    console.log("Saving new venues..........");
    await Promise.all(
      placeList.map(async (place) => {
        await updateVenueData(place)
          .then(() => {
            console.log(`Venue data updated: ${place.slug}`);
          })
          .catch((e) => {
            console.error(`Failed to update venue data: ${place.slug} - ${e}`);
          });
      })
    );
    //@TODO: catch any failed promise and early return
  } else {
    console.log(`No new venues found`);
  }
}

export default processIncompleteVenues;