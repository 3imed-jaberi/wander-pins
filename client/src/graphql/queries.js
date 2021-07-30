import { gql } from '@apollo/client'

export const ME_QUERY = gql`
  query {
    me {
      _id
      name
      email
      picture
    }
  }
`

export const GET_PINS_QUERY = gql`
  query {
    getPins {
      _id
      createdAt
      title
      image
      content
      latitude
      longitude
      author {
        _id
        name
        email
        picture
      }
      comments {
        text
        createdAt
        author {
          _id
          name
          picture
        }
      }
    }
  }
`
