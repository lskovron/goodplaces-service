import mongoose from 'mongoose';
const { Schema } = mongoose;

export const venueSchema = new Schema({
  _id: String,
  name: String,
  path: String,
  lat: String,
  lng: String,
  address: String,
  events: [String],
  googleId: String,
});