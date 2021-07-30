import React from "react"
import Header from "../components/Header"

function withHeader(Component) {
  return function (props) {
    return (
      <>
        <Header />
        <Component {...props} />
      </>
    )
  }
}
export default withHeader
