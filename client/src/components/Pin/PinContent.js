import React from "react"
import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import AccessTimeIcon from "@material-ui/icons/AccessTime"
import FaceIcon from "@material-ui/icons/Face"
import format from "date-fns/format"

import CreateComment from '../Comment/CreateComment'
import Comments from '../Comment/Comments'
import { useStoreContext } from "../../context"



const PinContent = ({ classes }) => {
  const {
    state: {
      currentPin: {
        title,
        content,
        author,
        createdAt,
        comments
      }
    }
  } = useStoreContext()

  return (
    <div className={classes.root}>
      <Typography
        component='h2'
        variant='h4'
        color='primary'
        gutterBottom
      >
        {title}
      </Typography>
      <Typography
        className={classes.text}
        component='h3'
        variant='h6'
        color='inherit'
        gutterBottom
      >
        <FaceIcon className={classes.icon} /> {author.name}
      </Typography>

      <Typography
        className={classes.text}
        component='h3'
        variant='subtitle2'
        color='inherit'
        gutterBottom
      >
        <AccessTimeIcon className={classes.icon} />
        {format(Number(createdAt), "MMM Do, yyyy")}

      </Typography>
      <Typography
        variant='subtitle1'
        gutterBottom
      >
        {content}
      </Typography>

      {/* Pin Comments  */}
      <CreateComment />
      <Comments comments={comments} />
    </div>
  )
}

const styles = theme => ({
  root: {
    padding: "1em 0.5em",
    textAlign: "center",
    width: "100%"
  },
  icon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
})

export default withStyles(styles)(PinContent)
