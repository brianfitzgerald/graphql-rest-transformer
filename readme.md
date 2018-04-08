# GraphQL-Rest

Allows you to query a GraphQL interface like you'd query a REST URL.
I wrote this to help me learn GraphQL, but it might have some practical use as well, as a means of ensuring backwards compatibility with REST APIs.

# Usage

`npm install graphql-rest-transformer --save`

then

`import restToGraphQL from 'graphql-rest-transformer'`

finally

`app.get(RegExp("api/*"), restToGraphQL)`

We use regex for the endpoint, so that anything beyond the `api/` route is sent to the middleware.

# TODO

* add a way to specify fields you want
