import React, { useState } from "react"
import { useLazyQuery } from '@apollo/client'
import { GoogleLogin } from 'react-google-login'
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"

import { IS_LOGGED_IN, LOGIN_USER, useStoreContext } from "../context"
import { ME_QUERY } from '../graphql'

function Login({ classes }) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const { dispatch } = useStoreContext()

  const [getUserInfo] = useLazyQuery(ME_QUERY, {
    fetchPolicy: "network-only",
    onCompleted({ me }) {
      dispatch({ type: LOGIN_USER, payload: me })
      dispatch({ type: IS_LOGGED_IN, payload: isSignedIn })
    },
    onError(err) {
      onFailure(err)
    }
  })

  const onSuccess = (googleUser) => {
    try {
      const token = googleUser.getAuthResponse().id_token
      localStorage.setItem('token', token)
      setIsSignedIn(googleUser.isSignedIn())
      getUserInfo()
    } catch (err) {
      onFailure(err)
    }
  }

  const onFailure = (err) => {
    console.error('google login error ', err)
    dispatch({ type: IS_LOGGED_IN, payload: true })
  }

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: 'rgb(66, 133, 244)' }}
      >
        Welcome !
      </Typography>
      <GoogleLogin
        clientId={process.env.REACT_APP_OAUTH_GOOGLE_CLIENT_ID}
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
        buttonText='Login With Google'
        theme="dark"
      />
    </div>
  )
}

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
}

export default withStyles(styles)(Login)
