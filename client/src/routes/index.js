import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Map from '../pages/Map'
import Login from '../pages/Login'
import ProtectedRoute from './ProtectedRoute'
import { StoreContextProvider } from '../context'
import { ApolloClientProvider } from '../graphql'
import withSplash from '../hoc/withSplash'

function Routes() {
  const App = withSplash(() => (
    <Switch>
      <ProtectedRoute exact path='/' component={Map} />
      <Route exact path='/login' component={Login} />
    </Switch>
  ))

  return (
    <Router>
      <ApolloClientProvider>
        <StoreContextProvider>
          <App />
        </StoreContextProvider>
      </ApolloClientProvider>
    </Router >
  )
}

export default Routes
