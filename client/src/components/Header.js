import React from "react"
import { withStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Map from "@material-ui/icons/Map"
import Typography from "@material-ui/core/Typography"
import useMediaQuery from "@material-ui/core/useMediaQuery"

import { useStoreContext } from '../context'
import Signout from './Signout'


function Header({ classes }) {
  const mobileSize = useMediaQuery('(max-width: 650px)')
  const { state: { currentUser } } = useStoreContext()

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          {/* Title / Logo  */}
          <div className={classes.grow}>
            <Map className={classes.icon} />
            <Typography
              className={mobileSize ? classes.mobile : ""}
              component='h1'
              variant='h6'
              color='inherit'
              noWrap
            >
              GeoPins
            </Typography>
          </div>

          {/* Current User Info */}
          {
            currentUser && (
              <div className={classes.grow}>
                <img
                  className={classes.picture}
                  src={currentUser.picture}
                  alt={currentUser.name}
                />

                <Typography
                  className={mobileSize ? classes.mobile : ""}

                  variant='h5'
                  color='inherit'
                  noWrap
                >
                  {currentUser.name}
                </Typography>
              </div>
            )
          }

          {/* Signout Button */}
          <Signout />
        </Toolbar>
      </AppBar>
    </div>
  )
}

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginRight: theme.spacing(1),
    color: "#E11584",
    fontSize: 45
  },
  mobile: {
    display: "none"
  },
  picture: {
    height: "50px",
    borderRadius: "90%",
    marginRight: theme.spacing(1) * 2
  }
})

export default withStyles(styles)(Header)
