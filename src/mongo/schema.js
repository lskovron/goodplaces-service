import mongoose from "mongoose";
const { Schema } = mongoose;

export const venueSchema = new Schema({
  _id: String,
  name: String,
  slug: String,
  lat: Number,
  lng: Number,
  address: String,
  events: [String],
  googleId: String,
});

export const eventSchema = new Schema({
  _id: String,
  venueSlug: String,
  slug: String,
  date: Date,
  time: String,
  title: String,
});
