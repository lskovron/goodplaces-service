import mongoose from "mongoose";
import { config } from "dotenv";
import { startMongo } from "../mongo/mongo.js";
import processIncompleteVenues from "../puppeteer/processIncompleteVenues.js";


config({path: '.env'})
const { MONGO_URI } = process.env;

await startMongo(MONGO_URI);

await processIncompleteVenues();

mongoose.connection.close()