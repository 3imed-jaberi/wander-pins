import React, { useEffect } from 'react'
import {
  ApolloClient,   // apollo-client
  ApolloProvider, // @apollo/react-hooks
  InMemoryCache,  // apollo-cache-inmemory
  split,          // apollo-link
  createHttpLink  // apollo-link-http
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context'
import { onError as onErrorProvider } from '@apollo/client/link/error'
import { getMainDefinition } from '@apollo/client/utilities'

import { ME_QUERY } from '../../graphql'
import useDispatch from '../../hooks/useDispatch'
import { IS_LOGGED_IN, LOGIN_USER } from '../../context'

// ---> cache
const cache = new InMemoryCache()

// ---> http link
const httpLink = createHttpLink({
  uri: `http://${process.env.REACT_APP_BASE_URL}/graphql`,
  credentials: 'same-origin'
})

// ---> websocket link
const wsLink = new WebSocketLink({
  uri: `ws://${process.env.REACT_APP_BASE_URL}/graphql`,
  options: {
    reconnect: true
  }
})


// ---> authentication middleware link
const authMiddlewareLink = setContext((_, { headers }) => {
  // const token = window.gapi.auth2
  //   .getAuthInstance()
  //   .currentUser.get()
  //   .getAuthResponse().id_token
  const token = localStorage.getItem('token')

  return {
    headers: {
      ...headers,
      authorization: token || ''
    }
  }
})

// ---> on-error middleware link
const onErrorMiddlewareLink = onErrorProvider(({ graphQLErrors, networkError }) => {
  console.log({ graphQLErrors, networkError })
})

// ---> compose http link with middlewares
const httpLinkWithMiddleware = onErrorMiddlewareLink.concat(authMiddlewareLink.concat(httpLink))

// ---> compose ws and http links
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query) // definition

    return (
      kind === 'OperationDefinition' &&
      operation === 'subscription'
    )
  },
  wsLink,
  httpLinkWithMiddleware
)

// ---> apollo provider wrapper
export function ApolloClientProvider({ children }) {
  const dispatch = useDispatch()
  const client = new ApolloClient({ link, cache })

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      (async () => {
        const response = await client.query({ query: ME_QUERY })
        dispatch({ type: LOGIN_USER, payload: response?.data?.me })
        dispatch({ type: IS_LOGGED_IN, payload: true })
      })()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}
