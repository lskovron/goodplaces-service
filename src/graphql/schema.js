export default `
  scalar Date

  type Query

  input DateRangeInput {
    start: String!
    end: String!
  }

  input GetEventsInput {
    venueSlug: String
    date: Date
    title: String
  }

  type Venue {
    id: ID!
    slug: String!
    name: String!
    lat: Float
    lng: Float
    address: String
    events: [Event!]!
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
  
  extend type Query {
    events(input: GetEventsInput): [Event!]!
    event(slug: String!): Event!
    venues: [Venue!]!
    venue(slug: String!): Venue!
    history(dateRange: DateRangeInput!): [History!]!
    fullHistory: [History]!
    date(dateString: String!): History!
  }
`;

// Most common queries:
// 1. Find all events by Date
// 2. Find all events by Venue
// 3. Find all events by Artist (event title)
