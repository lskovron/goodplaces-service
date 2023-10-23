import { createOrUpdateHistory } from '../mongo/utils.js';

const processHistory = async (eventErrors, venueErrors, dateString) => {
  if (eventErrors.length > 0) console.error(`(${eventErrors}) errors processing events for ${dateString}`);
  if (venueErrors.length > 0) console.error(`(${venueErrors}) errors processing venues for ${dateString}`);
  console.log("Saving history..........");

  const historyEvent = {
    eventErrors,
    venueErrors,
    dateString,
    hasError: eventErrors.length > 0 || venueErrors.length > 0
  }

    await createOrUpdateHistory(historyEvent).then(() => {
        console.log(`New history: ${dateString}`);
    })
    .catch((e) => {
        console.error(`Failed to save history: ${dateString} - ${e}`);
        throw new Error(`Failed to save history: ${dateString} - ${e}`)
    });
}

export default processHistory;