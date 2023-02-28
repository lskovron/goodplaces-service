export default `
  type Mutation
  type Query

  input CreateVenueInput {
    name: String!
    lat: Float!
    lng: Float!
    address: String!
    path: String!
  }

  type Venue {
    id: ID!
    path: String!
    name: String!
    lat: Float!
    lng: Float!
    address: String!
    events: [Event!]!
  }

  type Event {
    id: ID!
    venue: Venue!
    date: String!
    time: String!
    title: String!
  }
  
  extend type Query {
    venues: [Venue!]!
    venue(input: String!): Venue!
  }

  extend type Mutation {
    createVenue(input: CreateVenueInput): Venue!
  }
`


// Most common queries:
// 1. Find all events by Date
// 2. Find all events by Venue
// 3. Find all events by Artist (event title)