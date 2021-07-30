import React from "react"
import { Marker as MapMarker } from "react-map-gl"
import { withStyles, createStyles } from "@material-ui/core/styles";

import PinIcon from './PinIcon'
import { DEFAULT_OFFSET, DEFAULT_PIN_ICON_SIZE } from "../constants"

function Marker({ latitude, longitude, iconColor, iconOnClick }) {
  return (
    <MapMarker
      latitude={latitude}
      longitude={longitude}
      offsetLeft={DEFAULT_OFFSET.left}
      offsetTop={DEFAULT_OFFSET.top}
    >
      <PinIcon size={DEFAULT_PIN_ICON_SIZE} color={iconColor} onClick={iconOnClick} />
    </MapMarker>
  )
}

Marker.defaultProps = {
  latitude: 0,
  longitude: 0,
  iconColor: 'red',
  iconOnClick: null
}

const styles = createStyles({
  pinIcon: {
    cursor: "pointer"
  }
});

export default withStyles(styles)(Marker)
