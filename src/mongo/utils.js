import { venueSchema } from "./schema.js";
import mongoose from 'mongoose';

export const getVenue = async (path) => {
    const Venue = mongoose.model('Venue', venueSchema);
    const venue = await Venue.findOne({ path })
    return venue;
}

export const createOrUpdateVenue = async (venueData) => {
    const { address, lat, lng, path, name } = venueData;
    const Venue = mongoose.model('Venue', venueSchema);
    await Venue.updateOne(
        { path },
        { $set: { address, lat, lng, name } },
        { upsert: true }
    );
    const updatedVenue = await getVenue(path)
    return updatedVenue;
}