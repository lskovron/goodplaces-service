import axios from 'axios';
import { config } from 'dotenv';

config({ path: '.env' });
const { GOOGLE_API_KEY } = process.env;

export const getVenuePlacesFromSlug = async (venueName) => {
  const location = '29.9511,-90.0715'; // New Orleans
  let places;
  await axios
    .get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${venueName}&location=${location}&radius=50&key=${GOOGLE_API_KEY}`
    )
    .then((res) => {
      const { data } = res;
      if (data?.results?.length) {
        places = data.results.map((result) => {
          const {
            name: googleName,
            business_status: businessStatus,
            formatted_address: address,
            place_id: googleId,
            geometry: {
              location: { lat, lng },
            },
            rating,
            types,
          } = result;
          return {
            lat,
            lng,
            address,
            googleId,
            rating,
            types,
            googleName,
            businessStatus,
          };
        });
      } else {
        console.error(`${venueName} not found`);
        places = [];
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });

  return places;
};

// Not currently in use
export const getVenueDetails = async (googleId) => {
  let place;
  await axios
    .get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googleId}&key=${GOOGLE_API_KEY}`
    )
    .then((res) => {
      console.log(res);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });

  return place;
};
