import {
  getVenue,
  getAllVenues,
  createOrUpdateVenue,
  createOrUpdateEvent,
  getAllEvents,
  getEvent,
} from "../mongo/utils.js";

export const resolvers = {
  Query: {
    venues: async () => {
      return await getAllVenues();
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
  },
  Mutation: {
    createVenue: async (_, args) => {
      const { input } = args;
      return await createOrUpdateVenue(input);
    },
    createEvent: async (_, args) => {
      const { input } = args;
      return await createOrUpdateEvent(input);
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
};
