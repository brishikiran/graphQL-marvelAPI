export const typeDefs = `
scalar Date

  type Comic {
    id: ID!
    title: String!
    description: String
    images: [Image]
    dates: [ComicDate]
    prices: [ComicPrice]
    isbn: String!
    resourceURI: String!
    issn: String!
    format: String!
  }

  type Image {
    path: String
    extension: String
  }

  type ComicDate {
    type: String
    date: Date  
  }

  type ComicPrice {
    type: String
    price: Float
  }

  type Query {
    comicsPage(pagenum: Int!): [Comic]
    comic(id: ID!): Comic
  }
`;