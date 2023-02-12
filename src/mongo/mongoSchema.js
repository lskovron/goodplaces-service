import mongoose from 'mongoose';
const { Schema } = mongoose;

const venueSchema = new Schema({
  name: String,
  path: String,
  lat: String,
  lng: String,
  address: String,
  events: [String],
  googleId: String,
});

export const createVenue = async ({input}) => {
    const Venue = mongoose.model('Venue', venueSchema);
    const newVenue = new Venue(input);
    await newVenue.save();
    return newVenue;
}