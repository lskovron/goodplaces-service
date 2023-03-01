import { eventSchema, venueSchema } from "./schema.js";
import mongoose from 'mongoose';

export const getVenue = async (slug) => {
    console.log(slug);
    const Venue = mongoose.model('Venue', venueSchema);
    return await Venue.findOne({ slug })
}

export const getAllVenues = async () => {
    const Venue = mongoose.model('Venue', venueSchema);
    return await Venue.find()
}

export const getAllEvents = async (input) => {
    const { title, date: dateString, venueSlug } = input;
    const date = new Date(dateString);
    // @TODO: find events based on these fields ^^^
    const Event = mongoose.model('Event', eventSchema);
    return await Event.find()
}

export const getEvent = async (slug) => {
    const Event = mongoose.model('Event', eventSchema);
    return await Event.findOne({ slug })
}

export const createOrUpdateVenue = async (venueData) => {
    const { address, lat, lng, slug, name } = venueData;
    const Venue = mongoose.model('Venue', venueSchema);
    await Venue.updateOne(
        { slug },
        { $set: { address, lat, lng, name } },
        { upsert: true }
    );
    const updatedVenue = await getVenue(slug)
    return updatedVenue;
}

export const createOrUpdateEvent = async (eventData) => {
    const { slug, date: dateString, venueSlug, time, title } = eventData;
    const date = new Date(dateString);
    const Event = mongoose.model('Event', eventSchema);
    await Event.updateOne(
        { slug },
        { $set: { venueSlug, time, date, title } },
        { upsert: true }
    )
    return getEvent(slug);
}