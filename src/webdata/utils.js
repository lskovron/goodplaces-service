import { GraphQLClient, gql } from "graphql-request";

const getClient = () => {
    const endpoint = 'http://localhost:4000/graphql'
    const graphQLClient = new GraphQLClient(endpoint)
    return graphQLClient;
}

export const saveVenue = async (venueData) => {
    const client = getClient();

    const mutation = gql`
        mutation Mutation($input: CreateVenueInput) {
            createVenue(input: $input) {
                address
                id
                lat
                lng
                name
                slug
            }
        }
    `

    const variables = {
        input: venueData
    }
    const data = await client.request(mutation, variables)
    return data;
}

export const getAllVenues = async () => {
    const client = getClient();

    const query = gql`
        query Venues {
            venues {
                slug
            }
        }
    `

    const variables = {}
    const data = await client.request(query, variables)
    return data;
}