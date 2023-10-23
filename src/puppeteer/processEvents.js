import { parseEvent } from './utils/parsers.js';
import { createOrUpdateEvent } from '../mongo/utils.js';

const processEvents = async (events, dateString) => {
  console.log(`Parsing ${events.length} events for date ${dateString}`);
  let eventErrors = [];
  let parsedEvents = await Promise.all(
    events.map(async (event) => await parseEvent(event, dateString))
  );

  console.log("Saving new events..........");
  await Promise.all(
    parsedEvents.map(async (ev) => {
      await createOrUpdateEvent(ev)
        .then(() => {
          console.log(`New event saved: ${ev.slug}`);
        })
        .catch((e) => {
          eventErrors.push(ev.slug);
          console.error(`Failed to save new event: ${ev.slug} - ${e}`);
          new Error(`Failed to save new event: ${ev.slug} - ${e}`)
        });
    })
  );

  return eventErrors;
}

export default processEvents;