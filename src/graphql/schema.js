export default `
  type Mutation
  type Query

  input CreateVenueInput {
    name: String!
    lat: String!
    lng: String!
    address: String!
    googleId: String! 
  }

  type Venue {
    id: ID!
    path: String!
    name: String!
    lat: String!
    lng: String!
    address: String!
    googleId: String!
    events: [Event!]!
  }

  type Event {
    id: ID!
    venue: Venue!
    date: String!
    title: String!
  }

  extend type Query {
    venues: [Venue!]!
    venue(id: String!): Venue!
  }

  extend type Mutation {
    createVenue(input: CreateVenueInput): Venue!
  }
`