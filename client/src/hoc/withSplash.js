import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { useStoreContext } from '../context'

function withSplash(Component) {
  return function (props) {

    const history = useHistory()
    const { pathname } = useLocation()
    const { state: { isAuth } } = useStoreContext()

    useEffect(() => {
      history.push(isAuth ? '/' : '/login')
    }, [history, pathname, isAuth])

    return <Component {...props} />
  }
}

export default withSplash
