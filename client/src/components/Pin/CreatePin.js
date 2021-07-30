import React, { useState } from "react"
import { useMutation } from "@apollo/client"
import axios from "axios"
import { withStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone"
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined"
import ClearIcon from "@material-ui/icons/Clear"
import SaveIcon from "@material-ui/icons/SaveTwoTone"
import useMediaQuery from "@material-ui/core/useMediaQuery"

import { CREATE_PIN, DELETE_DRAFT, useStoreContext } from "../../context"
import { CREATE_PIN_MUTATION } from '../../graphql/mutations'

const CreatePin = ({ classes }) => {
  const mobileSize = useMediaQuery('(max-width: 650px)')

  const [createPin] = useMutation(CREATE_PIN_MUTATION)

  const { state, dispatch } = useStoreContext()

  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleTitle = event => setTitle(event.target.value)
  const handleImage = event => setImage(event.target.files[0])
  const handleContent = event => setContent(event.target.value)

  const handleDeleteDraft = () => {
    setTitle('')
    setImage('')
    setContent('')
    dispatch({ type: DELETE_DRAFT })
  }

  const handleImageUpload = async () => {
    try {
      const data = new FormData()

      data.append('file', image)

      // needed for cloudinary upload process 
      data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
      data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME)

      const response = await axios.post(process.env.REACT_APP_CLOUDINARY_ENDPOINT, data)

      return response.data.url
    } catch (err) {
      console.error('img upload to cloudinary error ', err)
    }
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault()
      setSubmitting(true)

      const url = await handleImageUpload()

      const variables = {
        title,
        image: url,
        content,
        latitude: state.draft.latitude,
        longitude: state.draft.longitude
      }

      const newPin = await createPin({ variables })
      dispatch({ type: CREATE_PIN, payload: newPin })
      handleDeleteDraft()
    } catch (err) {
      setSubmitting(false)
      console.error("create pin error ", err)
    }
  }

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component='h2'
        variant='h4'
        color='secondary'
      >
        <LandscapeIcon className={classes.iconLarge} /> Pin Location
      </Typography>
      <div>
        <TextField
          name='title'
          label='Title'
          placeholder='Insert pin title'
          onChange={handleTitle}
        />
        <input
          accept='image/*'
          id='image'
          type='file'
          className={classes.input}
          onChange={handleImage}
        />
        <label htmlFor='image'>
          <Button
            style={{ color: image && "#E11584" }}
            component='span'
            size='small'
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>

      <div className={classes.contentField}>
        <TextField
          name='content'
          label='Content'
          multiline
          rows={mobileSize ? '3' : '6'}
          margin='normal'
          fullWidth
          variant='outlined'
          onChange={handleContent}
        />
      </div>

      <div>
        <Button
          className={classes.button}
          variant='contained'
          color='primary'
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>

        <Button
          className={classes.button}
          variant='contained'
          color='secondary'
          disabled={!title.trim() || !content.trim() || !image || submitting}
          onClick={handleSubmit}
        >
          <SaveIcon className={classes.rightIcon} />
          Submit
        </Button>
      </div>
    </form>
  )
}

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing(1)
  },
  contentField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing(1)
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing(1)
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing(1)
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginLeft: 0
  }
})

export default withStyles(styles)(CreatePin)
