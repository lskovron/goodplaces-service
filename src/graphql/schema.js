export default `
  scalar Date

  type Mutation
  type Query

  input CreateVenueInput {
    name: String!
    lat: Float!
    lng: Float!
    address: String!
    slug: String!
  }

  input CreateEventInput {
    slug: String!
    venueSlug: String!
    date: Date!
    time: String!
    title: String!
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
  }
`;

// Most common queries:
// 1. Find all events by Date
// 2. Find all events by Venue
// 3. Find all events by Artist (event title)
