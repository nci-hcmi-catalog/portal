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







