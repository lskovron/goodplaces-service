import mongoose from 'mongoose';
const { Schema } = mongoose;

export const venueSchema = new Schema({
  _id: String,
  name: String,
  slug: String,
  lat: Number,
  lng: Number,
  address: String,
  googleId: String,
  dateScraped: Date,
  hasError: Boolean,
});

export const eventSchema = new Schema({
  _id: String,
  venueSlug: String,
  slug: String,
  dateString: String,
  date: Date,
  time: String,
  title: String,
});

export const historySchema = new Schema({
  _id: String,
  dateString: String,
  date: Date,
  hasError: Boolean,
  venueErrors: [String],
  eventErrors: [String],
});
