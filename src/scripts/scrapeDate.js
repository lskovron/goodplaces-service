import mongoose from "mongoose";
import { config } from "dotenv";
import { getOffsetDate, validateDateRange, validateDateString } from "../puppeteer/utils/parsers.js";
import { startMongo } from "../mongo/mongo.js";
import handleDate from "../puppeteer/handleDate.js";


config({path: '.env'})
const { DATE_RANGE_START, DATE_RANGE_END, DATE} = process.env;

await startMongo()

if( DATE_RANGE_START && DATE_RANGE_END ) {
    // function will throw an error and abandon the process if dates are invalid
    const dates = await validateDateRange(DATE_RANGE_START, DATE_RANGE_END)
    const scrapeSequentially = async (items) => {
        for (let i = 0; i < items.length; i++) {
          await handleDate(items[i]);
        }
    }
    await scrapeSequentially(dates)
} else if ( DATE ) {
    // function will throw an error and abandon the process if date is invalid
    await validateDateString(DATE);
    await handleDate(DATE);
} else {
    console.log('Must have DATE or DATE_RANGE variables set')
}

mongoose.connection.close()