import { ApolloClient, InMemoryCache } from "@apollo/client"

export const client = new ApolloClient({
	uri: "http://localhost:8080/graphql", // GraphQL API 的地址
	cache: new InMemoryCache(),
})