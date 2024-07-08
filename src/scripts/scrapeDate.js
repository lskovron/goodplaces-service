import mongoose from 'mongoose';
import { config } from 'dotenv';
import { excludeDates, validateDateRange, validateDateString } from '../puppeteer/utils/parsers.js';
import { startMongo } from '../mongo/mongo.js';
import handleDate from '../puppeteer/handleDate.js';
import { sortHistories } from '../mongo/utils.js';

config({ path: '.env' });
const { DATE_RANGE_START, DATE_RANGE_END, DATE, MONGO_URI } = process.env;

await startMongo(MONGO_URI);

if (DATE_RANGE_START && DATE_RANGE_END) {
  // function will throw an error and abandon the process if dates are invalid
  const { scraped } = await sortHistories({ start: DATE_RANGE_START, end: DATE_RANGE_END });
  let dates = await validateDateRange(DATE_RANGE_START, DATE_RANGE_END);
  dates = excludeDates({ range: dates, exclude: scraped });

  if (dates.length === 0) {
    console.log('No new dates in range');
  }

  const scrapeSequentially = async (items) => {
    for (let i = 0; i < items.length; i++) {
      console.log(items[i]);
      await handleDate(items[i]);
    }
  };
  await scrapeSequentially(dates);
} else if (DATE) {
  // function will throw an error and abandon the process if date is invalid
  await validateDateString(DATE);
  await handleDate(DATE);
} else {
  console.log('Must have DATE or DATE_RANGE variables set');
}

mongoose.connection.close();
