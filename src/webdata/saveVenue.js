import { GraphQLClient, gql } from "graphql-request";

export const saveVenue = async (venueData) => {
    const endpoint = 'http://localhost:4000/graphql'
    const graphQLClient = new GraphQLClient(endpoint)

    const mutation = gql`
        mutation Mutation($input: CreateVenueInput) {
            createVenue(input: $input) {
                address
                id
                lat
                lng
                name
                path
            }
        }
    `

    const variables = {
        input: venueData
    }
    const data = await graphQLClient.request(mutation, variables)
    return data;
}