import React from "react"
import { withStyles } from "@material-ui/core/styles"
import ExploreIcon from "@material-ui/icons/Explore"
import Typography from "@material-ui/core/Typography"

const NoContent = ({ classes }) => (
  <div className={classes.root}>
    <ExploreIcon className={classes.icon} />
    <Typography
      noWrap
      component='h2'
      variant='h6'
      align='center'
      color='textSecondary'
      gutterBottom
    >
      Click on the map to add a new pin
    </Typography>
  </div>
)

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  icon: {
    margin: theme.spacing(1),
    color: "#E11584",
    fontSize: "80px"
  }
})

export default withStyles(styles)(NoContent)
