// import mongoose from "mongoose";
// import { startMongo } from "./mongo/mongo.js";
// import scrapeAndSaveEvents from "./puppeteer/scrapeAndSaveEvents.js";
// import scrapeAndSaveVenues from "./puppeteer/scrapeAndSaveVenues.js";
import { config } from "dotenv";
import { validateDateRange, validateDateString } from "./puppeteer/utils/parsers.js";


config({path: '../.env'})

const { DATE_RANGE_START, DATE_RANGE_END, DATE} = process.env;

if( DATE_RANGE_START && DATE_RANGE_END ) {
    // function will throw an error and abandon the process if invalid
    validateDateRange(DATE_RANGE_START, DATE_RANGE_END)
} else if ( DATE ) {
    // function will throw an error and abandon the process if invalid
    validateDateString(DATE);
}




// const numberOfDays = diffInDays(process.env.DATE_RANGE_START, process.env.DATE_RANGE_END);
// console.log(numberOfDays);

// await startMongo()
// await scrapeAndSaveVenues("2023-03-11")
// await scrapeAndSaveEvents("2023-03-11").then(() => mongoose.connection.close());