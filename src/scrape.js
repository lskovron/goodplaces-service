import mongoose from "mongoose";
import { startMongo } from "./mongo/mongo.js";
import scrapeAndSaveEvents from "./webdata/scrapeAndSaveEvents.js";
import scrapeAndSaveVenues from "./webdata/scrapeAndSaveVenues.js";



await startMongo()
await scrapeAndSaveVenues("2023-03-11")
await scrapeAndSaveEvents("2023-03-11").then(() => mongoose.connection.close());