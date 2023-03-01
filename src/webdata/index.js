import { getVenueInfo } from "./getVenueInfo.js";
import { scrapeForVenues } from "./scrapers.js";
import { getAllVenues, saveVenue } from "./utils.js";

const scrapeAndSaveVenues = async (date) => {
  if( !date ) return;
  console.log('******************** SCRAPING VENUES ********************')
  const todaysVenues = await scrapeForVenues(
    `https://www.wwoz.org/calendar/livewire-music?date=${date}`
  );

  console.log(`${todaysVenues.length} venues scraped for date ${date}`);

  let existingVenues;
  await getAllVenues()
    .then(
      ({venues}) => {
        existingVenues = venues.map(v => v.slug)
      }
  );

  const newVenues = todaysVenues.filter(({slug}) => existingVenues.indexOf(slug) === -1 )

  if( newVenues.length > 0 ){
    console.log('******************** SAVING NEW VENUES ********************')
    let placeList = [];
    await Promise.all(
      newVenues.map(async (venue) => {
        console.log(`******************** New venue detected: ${venue.slug} ********************`);
        await getVenueInfo(venue.name).then((res) => {
          placeList.push({
            ...res,
            ...venue
          });
        });
      })
    );

    let updatedVenues = [];
    await Promise.all(
      placeList.map(
        async (place) => {
          const updatedPlace = await saveVenue(place).then(() => {
            console.log(`New venue saved: ${place.slug}`)
          }).catch({

          })
          updatedVenues.push(updatedPlace);
        }
      )
    )


  } else {
    console.log(`No new venues scraped`);
  }
  


  // console.log('******************** UPDATED VENUES ********************')
  // console.log(updatedVenues)


  // // get events
  // console.log('******************** SCRAPING EVENTS ********************')
  // console.log(placeList[0])

  // const slug = `https://www.wwoz.org${placeList[0].slug}`;
  // const events = await scrapeForEvents(slug);
  // console.log(events);
};

// scrapeAndSaveVenues("2023-02-10");
