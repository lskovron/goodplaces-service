import { eventSchema, historySchema, venueSchema } from "./schema.js";
import mongoose from "mongoose";

export const getVenue = async (slug) => {
  const Venue = mongoose.model("Venue", venueSchema);
  return await Venue.findOne({ slug });
};

export const getAllVenues = async () => {
  const Venue = mongoose.model("Venue", venueSchema);
  return await Venue.find();
};

export const getAllVenueSlugs = async () => {
  const Venue = mongoose.model("Venue", venueSchema);
  // returns an array of slugs
  return await Venue.distinct("slug", {});
};

export const getAllEvents = async (input) => {
  const { title, date: dateString, venueSlug } = input;
  const date = new Date(dateString);
  // @TODO: find events based on these fields ^^^
  const Event = mongoose.model("Event", eventSchema);
  return await Event.find({ venueSlug });
};

export const getEvent = async (slug) => {
  const Event = mongoose.model("Event", eventSchema);
  return await Event.findOne({ slug });
};

export const createOrUpdateVenue = async (venueData) => {
  const { address, lat, lng, slug, name } = venueData;
  const Venue = mongoose.model("Venue", venueSchema);
  console.log(Venue);
  await Venue.updateOne(
    { slug },
    { $set: { address, lat, lng, name } },
    { upsert: true }
  );
  const updatedVenue = await getVenue(slug);
  return updatedVenue;
};

export const createOrUpdateEvent = async (eventData) => {
  const { slug, date: dateString, venueSlug, time, title } = eventData;
  const date = new Date(dateString);
  const Event = mongoose.model("Event", eventSchema);
  await Event.updateOne(
    { slug },
    { $set: { venueSlug, time, date, title } },
    { upsert: true }
  );
  return getEvent(slug);
};

export const createOrUpdateHistory = async (historyData) => {
  const { dateString, ...props } = historyData;
  const date = new Date(dateString);
  const History = mongoose.model("History", historySchema);
  return await History.updateOne(
    { dateString },
    { $set: { ...props, date } },
    { upsert: true }
  );
}