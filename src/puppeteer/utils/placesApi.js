import axios from "axios";

const key = "###";
export const getVenueInfo = async (venueName) => {
  const location = "29.9511,-90.0715";
  let place;
  await axios
    .get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${venueName}&location=${location}&radius=5000&key=${key}`
    )
    .then((res) => {
      const { data } = res;
      if (data?.results?.length) {
        const {
          name,
          formatted_address: address,
          geometry: {
            location: { lat, lng },
          },
        } = data.results[0];
        place = {
          lat,
          lng,
          address,
          name,
        };
      } else {
        console.error(`${venueName} not found`);
      }
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
