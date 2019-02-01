# Introduction

The HCMI Searchable Catalog was built with an extensive API providing programmatic access to any data currently available through the user interface.

Two types of APIs are currently provided:

* A GraphQL API supporting search and exploration features
* A REST API providing HCMI-specific business logic

# Discover GraphQL

The HCMI GraphQL endpoint, available at `https://hcmi-searchable-catalog.nci.nih.gov/api/hcmi/graphql` is a standard GraphQL implementation. Those not familiar with GraphQL can find documentation and resources on [GraphQL official website](https://graphql.org/learn/).

This documentation will provide initial elements to start exploring HCMI data through Graphql.

## Install and start GraphiQL electron app

The [Graphil electron app](https://electronjs.org/apps/graphiql) is an easy solution to start querying the HCMI API. 

Once the application is installed, joint specify `https://hcmi-searchable-catalog.nci.nih.gov/api/hcmi/graphql` in the `GraphQL Endpoint` field.

INSERT SCREENSHOT

## Sample Query

In this first sample, we'll be requesting the first 5 cancer models, sorted by name as well as the total count of models available.

INSERT SCREENSHOT

GraphQL Query
```graphQL
query ($sort: [Sort], $first: Int, $offset: Int, $sqon: JSON) {
  models {
    hits(first: $first, offset: $offset, sort: $sort, filters: $sqon) {
      total
      edges {
        node {
          name
        }
      }
    }
  }  
}
```

Variables
```json
{"first": 5, "offset": 0, "sort": [{"field": "name", "order": "asc"}]}
```

Results
```json
{
  "data": {
    "models": {
      "hits": {
        "total": 15,
        "edges": [
          {
            "node": {
              "name": "HCM-BROD-0003-C71"
            }
          },
          {
            "node": {
              "name": "HCM-BROD-0011-C71"
            }
          },
          {
            "node": {
              "name": "HCM-BROD-0012-C71"
            }
          },
          {
            "node": {
              "name": "HCM-BROD-0014-C71"
            }
          },
          {
            "node": {
              "name": "HCM-BROD-0028-C71"
            }
          }
        ]
      }
    }
  }
}
```







