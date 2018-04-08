import * as express from "express"
import * as graphqlHTTP from "express-graphql"
import { graphql, buildSchema, GraphQLType, ExecutionResult } from "graphql"

const schema = buildSchema(`
  type Person {
    id: Int
    firstName: String
  }
  type Query {
    person(id: Int): Person
  }
`)

const persons = [
  {
    id: 1,
    firstName: "Brian"
  },
  {
    id: 2,
    firstName: "John"
  },
  {
    id: 3,
    firstName: "Conner"
  }
]

const rootResolver = {
  person: ({ id }: { id: number }) => {
    const person = persons.filter(p => p.id === id)[0]
    return persons.filter(p => p.id === id)[0]
  }
}

const app = express()

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: rootResolver,
    graphiql: true
  })
)

const queryTemplate = (itemType: string, id: string, child: string) => `
${itemType}(id: ${id}) {
  ${child}
}
`

export function restToGraphQL(req: express.Request, res: express.Response) {
  const requestParams = req.url.split("/").slice(2)

  const reducedStatement = requestParams
    .reverse()
    .reduce((accumulator, currentValue, currentIndex, array) => {
      if (currentIndex % 2 === 0) {
        return accumulator
      } else {
        if (array.length === currentIndex + 1) {
          return queryTemplate(
            currentValue,
            array[currentIndex - 1],
            "firstName"
          )
        } else {
          return queryTemplate(
            currentValue,
            array[currentIndex - 1],
            accumulator
          )
        }
      }
    })

  graphql(schema, `{ ${reducedStatement} }`, rootResolver)
    .then((value: ExecutionResult) => {
      res.json(value.data)
    })
    .catch(err => {
      console.error(err)
    })
}

app.get(RegExp("api/*"), restToGraphQL)

export const APPLICATION_PORT = 3000

app.listen(APPLICATION_PORT, () => {
  console.log(`Server is listening on port ${APPLICATION_PORT}`)
})
