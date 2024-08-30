import {
  getVenue,
  getAllVenues,
  getAllEvents,
  getEvent,
  getHistory,
  getHistories,
  getEarliestHistory,
  getMostRecentHistory,
  getEventsByVenue,
  getAllEventsInRange,
  updateVenueData,
  getEventCountByTimeFrame,
} from '../mongo/utils.js';
import { getVenueDetails, getVenuePlacesFromSlug } from '../puppeteer/utils/placesApi.js';

export const resolvers = {
  Query: {
    history: async () => {
      return await getAllVenues();
    },
    venues: async () => {
      return await getAllVenues();
    },
    eventsByVenue: async (_, args) => {
      const { dateRange } = args;
      return await getEventsByVenue(dateRange);
    },
    events: async (_, args) => {
      const { input } = args;
      return await getAllEvents(input);
    },
    eventsInRange: async (_, args) => {
      const { dateRange, limit } = args;
      return await getAllEventsInRange({ dateRange, limit: limit || 100 });
    },
    venue: async (_, args) => {
      const { slug } = args;
      return await getVenue(slug);
    },
    venueGeoData: async (_, args) => {
      const { slug, name: nameInput } = args;
      const { name: venueName } = (await getVenue(slug)) || {};
      console.log(`Getting place data for venue: ${slug}`);
      const venues = await getVenuePlacesFromSlug(nameInput || venueName);
      if (venues.length > 0) {
        return venues.map(
          ({ lat, lng, address, googleId, types, rating, businessStatus, googleName }) => ({
            name: venueName,
            slug,
            lat,
            lng,
            address,
            googleId,
            types,
            rating,
            businessStatus,
            googleName,
          })
        );
      }
      return [
        {
          slug,
          name: venueName,
        },
      ];
    },
    // not currently in use
    venueGeoDetails: async (_, args) => {
      const { googleId } = args;
      console.log(`Getting place details for venue: ${googleId}`);
      await getVenueDetails(googleId);
      return true;
    },
    event: async (_, args) => {
      const { slug } = args;
      return await getEvent(slug);
    },
    date: async (_, args) => {
      const { dateString } = args;
      return await getHistory(dateString);
    },
    history: async (_, args) => {
      const { dateRange } = args;
      return await getHistories(dateRange);
    },
    fullHistory: async () => {
      const earliest = await getEarliestHistory();
      const mostRecent = await getMostRecentHistory();
      return await getHistories({ start: earliest[0].dateString, end: mostRecent[0].dateString });
    },
    eventCountByFrame: async (_, args) => {
      const { timeFrame } = args;
      return await getEventCountByTimeFrame(timeFrame);
    },
  },
  Event: {
    venue: async (parent) => {
      return await getVenue(parent.venueSlug);
    },
  },
  Venue: {
    events: async (parent) => {
      // @TODO: finish this resolver
      return await getAllEvents({ venueSlug: parent.slug });
    },
  },

  Mutation: {
    saveVenueData: async (_, args) => {
      const { venue } = args;
      return await updateVenueData(venue);
    },
  },
};
