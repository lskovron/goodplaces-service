import { getVenueInfo } from "./getVenueInfo.js";
import { saveVenue } from "./saveVenue.js";
import { scrapeForVenues, scrapeForEvents } from "./scrapers.js";

const saveVenuesToDatabase = async () => {
  console.log('******************** SCRAPING VENUES ********************')

  const venues = await scrapeForVenues(
    "https://www.wwoz.org/calendar/livewire-music?date=2023-02-10"
  );
  console.log(venues);
  console.log('******************** GETTING VENUE DATA ********************')

  let placeList = [];
  await Promise.all(
    venues.map(async (venue) => {
      await getVenueInfo(venue.name).then((res) => {
        placeList.push({
          ...res,
          ...venue
        });
      });
    })
  );
  
  console.log('******************** UPDATE VENUES ********************')
  console.log(placeList);
  let updatedVenues = [];
  await Promise.all(
    placeList.map(
      async (place) => {
        const updatedPlace = await saveVenue(place)
        updatedVenues.push(updatedPlace);
      }
    )
  )


  console.log('******************** UPDATED VENUES ********************')
  console.log(updatedVenues)


  // // get events
  // console.log('******************** SCRAPING EVENTS ********************')
  // console.log(placeList[0])

  // const path = `https://www.wwoz.org${placeList[0].path}`;
  // const events = await scrapeForEvents(path);
  // console.log(events);
};

saveVenuesToDatabase();
