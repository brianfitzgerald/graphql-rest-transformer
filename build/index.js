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
    },
    {
        id: 3,
        firstName: "Conner"
    }
];
var rootResolver = {
    person: function (_a) {
        var id = _a.id;
        var person = persons.filter(function (p) { return p.id === id; })[0];
        return persons.filter(function (p) { return p.id === id; })[0];
    }
};
var app = express();
app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: rootResolver,
    graphiql: true
}));
var queryTemplate = function (itemType, id, child) { return "\n" + itemType + "(id: " + id + ") {\n  " + child + "\n}\n"; };
function restToGraphQL(req, res) {
    var requestParams = req.url.split("/").slice(2);
    var parsedParams = requestParams.map(function (element, index) {
        var item = {
            element: element,
            type: "kind"
        };
        if (index % 2 === 0) {
            item.type = "id";
        }
    });
    var reducedStatement = requestParams
        .reverse()
        .reduce(function (accumulator, currentValue, currentIndex, array) {
        if (currentIndex % 2 === 0) {
            return accumulator;
        }
        else {
            if (array.length === currentIndex + 1) {
                return queryTemplate(currentValue, array[currentIndex - 1], "firstName");
            }
            else {
                return queryTemplate(currentValue, array[currentIndex - 1], accumulator);
            }
        }
    });
    graphql_1.graphql(schema, "{ " + reducedStatement + " }", rootResolver)
        .then(function (value) {
        res.json(value.data);
    })
        .catch(function (err) {
        console.error(err);
    });
}
exports.restToGraphQL = restToGraphQL;
app.get(RegExp("api/*"), restToGraphQL);
exports.APPLICATION_PORT = 3000;
app.listen(exports.APPLICATION_PORT, function () {
    console.log("Server is listening on port " + exports.APPLICATION_PORT);
});
