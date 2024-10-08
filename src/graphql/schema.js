export default `
  scalar Date

  type Query
  type Mutation

  input DateRangeInput {
    start: String!
    end: String!
  }

  input GetEventsInput {
    venueSlug: String
    date: Date
    title: String
  }

  type Count {
    name: String
    count: Int
  }

  type Venue {
    _id: ID!
    slug: String!
    name: String!
    lat: Float
    lng: Float
    address: String
    events: [Event!]!
    count: Int
    googleId: String
    rating: Float
    businessStatus: String
  }

  input VenueDetailsInput {
    slug: String!
    name: String!
    lat: Float
    lng: Float
    address: String
    googleId: String
    businessStatus: String
    rating: Float
  }

  type VenueDetails {
    slug: String!
    name: String!
    lat: Float
    lng: Float
    address: String
    googleId: String
    googleName: String
    businessStatus: String
    rating: Float
    types: [String]
  }

  type Event {
    id: ID!
    venue: Venue!
    date: Date!
    time: String!
    title: String!
    slug: String!
  }

  type History {
    id: ID!
    dateString: String!,
    date: Date!,
    hasError: Boolean!,
    venueErrors: [String],
    eventErrors: [String],
  }

  type CountByDate {
    _id: String
    count: Int
  }
  
  extend type Query {
    events(input: GetEventsInput): [Event!]!
    eventsByVenue(dateRange: DateRangeInput): [Venue!]!
    eventsInRange(dateRange: DateRangeInput, limit: Int): [Event!]!
    eventCountByFrame(timeFrame: String): [CountByDate!]!
    event(slug: String!): Event!
    venues: [Venue!]!
    venue(slug: String!): Venue!
    venueGeoData(slug: String!, name: String): [VenueDetails]
    venueGeoDetails(googleId: String!): Boolean!
    history(dateRange: DateRangeInput!): [History!]!
    fullHistory: [History]!
    date(dateString: String!): History!
  }

  extend type Mutation {
    saveVenueData(venue: VenueDetailsInput!): Venue!
  }
`;

// Most common queries:
// 1. Find all events by Date
// 2. Find all events by Venue
// 3. Find all events by Artist (event title)
