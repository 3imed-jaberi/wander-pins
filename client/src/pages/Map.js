import React, { useState, useEffect } from "react"
import { useQuery, useMutation, useSubscription } from "@apollo/client"
import ReactMapGL, { NavigationControl, Popup } from "react-map-gl"
import Button from "@material-ui/core/Button"
import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import DeleteIcon from "@material-ui/icons/DeleteTwoTone"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import differenceInMinutes from 'date-fns/differenceInMinutes'

import Blog from "../components/Blog"
import Marker from "../components/Marker"
import withHeader from '../hoc/withHeader'
import withRootStyle from "../hoc/withRootStyle"

import {
  GET_PINS_QUERY,
  DELETE_PIN_MUTATION,
  PIN_ADDED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION
} from "../graphql"
import { INITIAL_VIEWPORT } from "../constants"
import { CREATE_COMMENT, CREATE_DRAFT, CREATE_PIN, DELETE_PIN, GET_PINS, SET_PIN, UPDATE_DRAFT_LOCATION, useStoreContext } from "../context"

import 'mapbox-gl/dist/mapbox-gl.css'

function Map({ classes }) {
  const mobileSize = useMediaQuery('(max-width: 650px)')

  const { data } = useQuery(GET_PINS_QUERY)
  const [deletePin] = useMutation(DELETE_PIN_MUTATION)

  // subscripe to added pin
  useSubscription(PIN_ADDED_SUBSCRIPTION, {
    onSubscriptionData({ subscriptionData }) {
      const { pinAdded } = subscriptionData.data
      // console.log('Hey added subscription !')

      dispatch({ type: CREATE_PIN, payload: pinAdded })
    }
  })

  // subscripe to updated pin
  useSubscription(PIN_UPDATED_SUBSCRIPTION, {
    onSubscriptionData({ subscriptionData }) {
      const { pinUpdated } = subscriptionData.data
      // console.log('Hey updated subscription !')

      dispatch({ type: CREATE_COMMENT, payload: pinUpdated })
    }
  })

  // subscripe to deleted pin
  useSubscription(PIN_DELETED_SUBSCRIPTION, {
    onSubscriptionData({ subscriptionData }) {
      const { pinDeleted } = subscriptionData.data
      // console.log('Hey deleted subscription !')

      dispatch({ type: DELETE_PIN, payload: pinDeleted })
    }
  })

  const { state, dispatch } = useStoreContext()
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
  const [userPosition, setUserPosition] = useState(null)
  const [popup, setPopup] = useState(null)

  const onViewportChange = newViewport => setViewport(newViewport)

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        setViewport({ ...viewport, latitude, longitude })
        setUserPosition({ latitude, longitude })
      })
    }
  }

  useEffect(() => {
    getUserPosition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // get pins
    if (data) {
      dispatch({ type: GET_PINS, payload: data.getPins })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return
    if (!state.draft) dispatch({ type: CREATE_DRAFT })

    const [longitude, latitude] = lngLat

    dispatch({
      type: UPDATE_DRAFT_LOCATION,
      payload: { longitude, latitude }
    })
  }

  const highlightNewPin = pin => {
    const isNewPin = differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30
    return isNewPin ? "limegreen" : "darkblue"
  }

  const handleSelectPin = pin => {
    setPopup(pin)
    dispatch({ type: SET_PIN, payload: pin })
  }

  const isAuthUser = () => state.currentUser._id === popup.author._id

  const handleDeletePin = async pin => {
    const {
      data: {
        deletePin: deletedPin
      }
    } = await deletePin({ variables: { pinId: pin._id } })

    dispatch({ type: DELETE_PIN, payload: deletedPin })
    setPopup(null)
  }

  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <ReactMapGL
        width="100%"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken={process.env.REACT_APP_MAP_BOX_API_TOKEN}
        scrollZoom={!mobileSize}
        onViewportChange={onViewportChange}
        onClick={handleMapClick}
        {...viewport}
        children={
          <React.Fragment>
            <div className={classes.navigationControl}>
              <NavigationControl onViewportChange={onViewportChange} />
            </div>

            {
              /* Pin for user's current position */
              userPosition && (
                <Marker
                  latitude={userPosition.latitude}
                  longitude={userPosition.longitude}
                  iconColor="red"
                />
              )
            }

            {
              /* Draft Pin */
              state.draft && (
                <Marker
                  latitude={state.draft.latitude}
                  longitude={state.draft.longitude}
                  iconColor="hotpink"
                />
              )
            }

            {
              /* Created Pins */
              state.pins.map((pin, index) => {
                return (
                  <Marker
                    key={pin._id + '___i__' + index}
                    latitude={pin.latitude}
                    longitude={pin.longitude}
                    iconColor={highlightNewPin(pin)}
                    iconOnClick={() => handleSelectPin(pin)}
                  />
                )
              })
            }

            {
              /* Popup Dialog for Created Pins .. */
              popup && (
                <Popup
                  anchor='top'
                  latitude={popup.latitude}
                  longitude={popup.longitude}
                  closeOnClick={false}
                  onClose={() => setPopup(null)}
                >
                  <img
                    className={classes.popupImage}
                    src={popup.image}
                    alt={popup.title}
                  />

                  <div className={classes.popupTab}>
                    <Typography>
                      {/* toFixed --> only take 6 chiffre next to the , */}
                      {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
                    </Typography>

                    {
                      /* only display this button for authenticated user [related] */
                      isAuthUser() && (
                        <Button onClick={() => handleDeletePin(popup)}>
                          <DeleteIcon className={classes.deleteIcon} />
                        </Button>
                      )
                    }
                  </div>
                </Popup>
              )
            }
          </React.Fragment>
        }
      />

      {/* Blog SideArea to add pin content */}
      <Blog />
    </div>
  )
}

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
}

export default withRootStyle(withHeader(withStyles(styles)(Map)))
