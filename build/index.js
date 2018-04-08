"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var graphqlHTTP = require("express-graphql");
var graphql_1 = require("graphql");
var schema = graphql_1.buildSchema("\n  type Person {\n    id: Int\n    firstName: String\n  }\n  type Query {\n    person(id: Int): Person\n  }\n");
var persons = [
    {
        id: 1,
        firstName: "Brian"
    },
    {
        id: 2,
        firstName: "John"
    }
];
var rootResolver = {
    person: function (_a) {
        var id = _a.id;
        console.log(id);
        var person = persons.filter(function (p) { return p.id === id; })[0];
        console.log(person);
        return persons.filter(function (p) { return p.id === id; })[0];
    }
};
var app = express();
app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: rootResolver,
    graphiql: true
}));
exports.APPLICATION_PORT = 3000;
app.listen(exports.APPLICATION_PORT, function () {
    console.log("Server is listening on port " + exports.APPLICATION_PORT);
});
