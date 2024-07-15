import mongoose from 'mongoose';
import { eventSchema, historySchema, venueSchema } from './schema.js';
import { validateDateRange } from '../puppeteer/utils/parsers.js';

// GETS
export const getVenue = async (slug) => {
  const Venue = mongoose.model('Venue', venueSchema);
  return await Venue.findOne({ slug });
};

export const getAllVenues = async () => {
  const Venue = mongoose.model('Venue', venueSchema);
  return await Venue.find();
};

export const getAllVenueSlugs = async () => {
  const Venue = mongoose.model('Venue', venueSchema);
  // returns an array of slugs
  return await Venue.distinct('slug', {});
};

export const getIncompleteVenueSlugs = async () => {
  const Venue = mongoose.model('Venue', venueSchema);
  // returns an array of slugs
  return await Venue.find({ dateScraped: { $exists: false } });
};

export const getAllEvents = async (input) => {
  const { title, date: dateString, venueSlug } = input;
  const date = new Date(dateString);
  // @TODO: find events based on these fields ^^^
  const Event = mongoose.model('Event', eventSchema);
  return await Event.find({ venueSlug });
};

export const getAllEventsInRange = async ({ dateRange, limit }) => {
  const { start, end } = dateRange;
  const Event = mongoose.model('Event', eventSchema);
  return await Event.find({ dateString: { $gte: start, $lt: end } }).limit(limit);
};

export const getEvent = async (slug) => {
  const Event = mongoose.model('Event', eventSchema);
  return await Event.findOne({ slug });
};

export const getEarliestHistory = async () => {
  const History = mongoose.model('History', historySchema);
  return await History.find().sort({ date: 1 }).limit(1);
};

export const getMostRecentHistory = async () => {
  const History = mongoose.model('History', historySchema);
  return await History.find().sort({ date: -1 }).limit(1);
};

export const getHistory = async (dateString) => {
  const date = new Date(dateString);
  const History = mongoose.model('History', historySchema);
  return await History.findOne({ date });
};

export const getHistories = async ({ start, end }) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const History = mongoose.model('History', historySchema);
  return await History.find({ date: { $gte: startDate, $lte: endDate } });
};

export const getEventsByVenue = async ({ start, end }) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const Venue = mongoose.model('Venue', venueSchema);
  const res = await Venue.aggregate([
    {
      $lookup: {
        from: 'events',
        localField: 'slug',
        foreignField: 'venueSlug',
        as: 'events',
        pipeline: [{ $match: { date: { $gte: startDate, $lte: endDate } } }],
      },
    },
    {
      $project: {
        id: 1,
        slug: 1,
        name: 1,
        lat: 1,
        lng: 1,
        address: 1,
        googleId: 1,
        rating: 1,
        count: { $size: '$events' },
      },
    },
  ]);
  return res;
};

// CREATES & UPDATES
export const createOrUpdateVenue = async (venueData) => {
  const { slug, name } = venueData;
  const Venue = mongoose.model('Venue', venueSchema);
  await Venue.updateOne({ slug }, { $set: { name } }, { upsert: true });
  const updatedVenue = await getVenue(slug);
  return updatedVenue;
};

export const updateVenueData = async (venueData) => {
  const { address, lat, lng, slug, hasError, googleId, rating } = venueData;
  const dateScraped = new Date();
  const Venue = mongoose.model('Venue', venueSchema);
  await Venue.updateOne(
    { slug },
    { $set: { address, lat, lng, hasError, dateScraped, googleId, rating } },
    { upsert: true }
  );
  const updatedVenue = await getVenue(slug);
  return updatedVenue;
};

export const createOrUpdateEvent = async (parsedEvent) => {
  const { slug, dateString, venueSlug, time, title, date } = parsedEvent;
  const Event = mongoose.model('Event', eventSchema);
  await Event.updateOne(
    { slug },
    { $set: { venueSlug, time, dateString, title, date } },
    { upsert: true }
  );
  return getEvent(slug);
};

export const createOrUpdateHistory = async (historyData) => {
  const { dateString, hasError, venueErrors, eventErrors } = historyData;
  const date = new Date(dateString);
  const History = mongoose.model('History', historySchema);
  return await History.updateOne(
    { dateString },
    { $set: { hasError, venueErrors, eventErrors, date, dateString } },
    { upsert: true }
  );
};

export const sortHistories = async ({ start, end }) => {
  // function will throw an error and abandon the process if dates are invalid
  const dates = await validateDateRange(start, end, 365);
  let histories = await getHistories({ start, end });
  histories = histories.map((history) => history.dateString);
  const scraped = dates.filter((date) => histories.indexOf(date) > -1);
  const notScraped = dates.filter((date) => histories.indexOf(date) === -1);
  console.log('** ALREADY SCRAPED **', scraped);
  console.log('** NOT SCRAPED **', notScraped);
  return { scraped, notScraped };
};
