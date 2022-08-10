import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import addToCart from './addToCart';
import checkout from './checkout';

export const extendGraphQLSchemaExtension = graphQLSchemaExtension({
    typeDefs: `
    type Mutation {
        addToCart(productId: ID): CartItem
        checkout(token: String!): Order
    }
    `,
    resolvers: {
        Mutation: {
            addToCart,
            checkout,
        },
    },
});
