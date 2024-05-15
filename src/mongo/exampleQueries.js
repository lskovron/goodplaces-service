// Aggregation over venues collection and include event count
// 1. lookup all events whose venueSlug matches the current venue and add them in an array "events"
// 2. save the event count to a new field "count" and specify all other fields to include
const aggregation1 = [
  {
    $lookup: {
      from: 'events',
      localField: 'slug',
      foreignField: 'venueSlug',
      as: 'events',
      pipeline: [{ $match: { date: { $gte: startDate, $lte: endDate } } }],
    },
  },
  {
    $project: {
      name: 1,
      events: 1,
      lat: 1,
      lng: 1,
      address: 1,
      count: { $size: '$events' },
    },
  },
];
