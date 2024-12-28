var { ApolloServer } = require("@apollo/server");
// var { startStandaloneServer } = require("@apollo/server/standalone");
const GraphQLSchema = require('./schema/schema');
const garaphQLResolvers = require('./resolvers/resolvers');

const connectGraphQL = async () => {
    const server = new ApolloServer({
        typeDefs: GraphQLSchema,
        resolvers: garaphQLResolvers,
        // introspection: true,
      });

      return server;

    //   startStandaloneServer(server, {
    //     listen: { port },
    //     context: async ({ req }) => {
    //       let token = req.headers.authorization;
    //       return { token };
    //     }
    //   }).then(({ url }) => {
    //     console.log(`GraphQL Server ready at ${url}`);
    //   }).catch((err) => {
    //     console.log(err);
    //   });
}

module.exports = connectGraphQL;