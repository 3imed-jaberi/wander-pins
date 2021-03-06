import React from "react"
import PlaceTwoTone from "@material-ui/icons/PlaceTwoTone"

function PinIcon({ size, color, onClick }) {
  return <PlaceTwoTone onClick={onClick} style={{ fontSize: size, color }} />
}

export default PinIcon
