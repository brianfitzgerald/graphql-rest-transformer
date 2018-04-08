import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { graphql, buildSchema, GraphQLType } from "graphql";

const schema = buildSchema(`
  type Person {
    id: Int
    firstName: String
  }
  type Query {
    person(id: Int): Person
  }
`);

const persons = [
  {
    id: 1,
    firstName: "Brian"
  },
  {
    id: 2,
    firstName: "John"
  }
];

const rootResolver = {
  person: ({ id }: { id: number }) => {
    console.log(id);
    const person = persons.filter(p => p.id === id)[0];
    console.log(person);
    return persons.filter(p => p.id === id)[0];
  }
};

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: rootResolver,
    graphiql: true
  })
);

export const APPLICATION_PORT = 3000;

app.listen(APPLICATION_PORT, () => {
  console.log(`Server is listening on port ${APPLICATION_PORT}`);
});
