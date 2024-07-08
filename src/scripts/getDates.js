import mongoose from 'mongoose';
import { config } from 'dotenv';
import { startMongo } from '../mongo/mongo.js';
import { sortHistories } from '../mongo/utils.js';

config({ path: '.env' });
const { DATE_RANGE_START, DATE_RANGE_END, DATE, MONGO_URI } = process.env;

await startMongo(MONGO_URI);

if (DATE_RANGE_START && DATE_RANGE_END) {
  await sortHistories({ start: DATE_RANGE_START, end: DATE_RANGE_END });
} else if (DATE) {
  // handle looking for a single date
} else {
  console.log('Must have DATE or DATE_RANGE variables set');
}

mongoose.connection.close();
