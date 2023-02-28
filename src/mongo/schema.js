import mongoose from 'mongoose';
const { Schema } = mongoose;

export const venueSchema = new Schema({
  _id: String,
  name: String,
  path: String,
  lat: Number,
  lng: Number,
  address: String,
  events: [String],
  googleId: String,
});