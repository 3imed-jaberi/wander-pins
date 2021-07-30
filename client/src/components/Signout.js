import React from "react"
import { GoogleLogout } from 'react-google-login'
import ExitToApp from "@material-ui/icons/ExitToApp"
import Typography from "@material-ui/core/Typography"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { withStyles } from "@material-ui/core/styles"

import { useStoreContext, SIGNOUT_USER } from "../context"

function Signout({ classes }) {
  const mobileSize = useMediaQuery('(max-width: 650px)')
  const { dispatch } = useStoreContext()

  function onSignout() {
    dispatch({ type: SIGNOUT_USER })
  }

  function RenderScreen({ onClick }) {
    return (
      <span className={classes.root} onClick={onClick}>
        <Typography
          variant='body1'
          style={{ display: mobileSize ? 'none' : 'block' }}
          className={classes.buttonText}
        >
          Signout
        </Typography>

        <ExitToApp className={classes.buttonIcon} />
      </span>
    )
  }

  return (
    <GoogleLogout
      onLogoutSuccess={onSignout}
      render={RenderScreen}
      buttonText='Signout'
    />
  )
}

const styles = {
  root: {
    cursor: "pointer",
    backgroundColor: "white",
    padding: '8px',
    borderRadius: '24px',
    display: "flex"
  },
  buttonText: {
    color: "#E11584"
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "#E11584"
  }
}

export default withStyles(styles)(Signout)
