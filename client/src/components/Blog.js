import React from "react"
import { withStyles } from "@material-ui/core/styles"
import { Paper } from "@material-ui/core"
import useMediaQuery from "@material-ui/core/useMediaQuery"

import NoContent from "./Pin/NoContent"
import CreatePin from "./Pin/CreatePin"
import PinContent from "./Pin/PinContent"

import { useStoreContext } from "../context"

const Blog = ({ classes }) => {
  const mobileSize = useMediaQuery('(max-width: 650px)')

  const { state: { draft, currentPin } } = useStoreContext()

  let BlogContent

  if (!draft && !currentPin) {
    // no content ..
    BlogContent = NoContent
  } else if (draft && !currentPin) {
    // create content 
    BlogContent = CreatePin
  } else if (!draft && currentPin) {
    BlogContent = PinContent
  }


  return <Paper
    className={mobileSize ? classes.rootMobile : classes.root}
    children={
      <>
        <BlogContent />
      </>
    }
  />
}

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: "calc(100vh - 64px)",
    overflowY: "scroll",
    display: "flex",
    justifyContent: "center"
  },
  rootMobile: {
    maxWidth: "100%",
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll"
  }
}

export default withStyles(styles)(Blog)
