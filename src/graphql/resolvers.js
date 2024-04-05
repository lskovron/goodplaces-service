import {
  getVenue,
  getAllVenues,
  getAllEvents,
  getEvent,
  getHistory,
  getHistories,
  getEarliestHistory,
  getMostRecentHistory,
  getEventsByVenue
} from "../mongo/utils.js";

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
    venue: async (_, args) => {
      const { slug } = args;
      return await getVenue(slug);
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
      const earliest = await getEarliestHistory()
      const mostRecent = await getMostRecentHistory()
      return await getHistories({ start: earliest[0].dateString, end: mostRecent[0].dateString});
    }
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
};
