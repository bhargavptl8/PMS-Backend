const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

// Custom BigInt Scalar Implementation
const BigIntScalar = new GraphQLScalarType({
  name: "BigInt",
  description: "A BigInt custom scalar for large integers",
  serialize(value) {
    return value.toString(); // Convert outgoing BigInt to string
  },
  parseValue(value) {
    return BigInt(value); // Convert incoming value to BigInt
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      return BigInt(ast.value); // Convert literal to BigInt
    }
    throw new Error("BigInt can only parse string or integer values.");
  },
});

module.exports = { BigIntScalar };
