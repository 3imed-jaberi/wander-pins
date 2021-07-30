import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { useStoreContext } from '../context'

function ProtectedRoute({ component: Component, ...rest }) {
  const { state: { isAuth } } = useStoreContext()

  return (
    <Route
      {...rest}
      render={
        props => (
          !isAuth
            ? <Redirect to='/login' />
            : <Component {...props} />
        )
      }
    />
  )
}

export default ProtectedRoute
