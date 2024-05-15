import mongoose from 'mongoose';
import { config } from 'dotenv';
import { validateDateRange, validateDateString } from '../puppeteer/utils/parsers.js';
import { startMongo } from '../mongo/mongo.js';
import { getHistories } from '../mongo/utils.js';
import handleDate from '../puppeteer/handleDate.js';

config({ path: '.env' });
const { DATE_RANGE_START, DATE_RANGE_END, DATE, MONGO_URI } = process.env;

await startMongo(MONGO_URI);

if (DATE_RANGE_START && DATE_RANGE_END) {
  // function will throw an error and abandon the process if dates are invalid
  const dates = await validateDateRange(DATE_RANGE_START, DATE_RANGE_END);
  let histories = await getHistories({ start: DATE_RANGE_START, end: DATE_RANGE_END });
  histories = histories.map((history) => history.dateString);
  const scraped = dates.filter((date) => histories.indexOf(date) > -1);
  const notScraped = dates.filter((date) => histories.indexOf(date) === -1);
  console.log('** ALREADY SCRAPED **', scraped);
  console.log('** NOT SCRAPED **', notScraped);
} else if (DATE) {
  // handle looking for a single date
} else {
  console.log('Must have DATE or DATE_RANGE variables set');
}

mongoose.connection.close();
