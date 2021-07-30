import React, { useState } from "react"
import { useMutation } from "@apollo/client"
import { withStyles } from "@material-ui/core"
import InputBase from "@material-ui/core/InputBase"
import IconButton from "@material-ui/core/IconButton"
import ClearIcon from "@material-ui/icons/Clear"
import SendIcon from "@material-ui/icons/Send"
import Divider from "@material-ui/core/Divider"

import { CREATE_COMMENT_MUTATION } from '../../graphql/mutations'
import { useStoreContext } from "../../context"

const CreateComment = ({ classes }) => {
  const [createCommentMutation] = useMutation(CREATE_COMMENT_MUTATION)

  const {
    state: {
      currentPin: {
        _id: pinId
      }
    }
  } = useStoreContext()

  const [comment, setComment] = useState('')

  const handleCommentInput = (event) => setComment(event.target.value)
  const handleClearCommentInput = () => setComment('')
  const handleCommentSubmit = async (event) => {
    event.preventDefault()
    await createCommentMutation({
      variables: {
        pinId,
        text: comment
      }
    })
    setComment('')
  }

  return (
    <>
      <form className={classes.form}>
        <IconButton
          onClick={handleClearCommentInput}
          disabled={!comment.trim()}
          className={classes.clearButton}
        >
          <ClearIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder='Add Comment !'
          multiline={true}
          value={comment}
          onChange={handleCommentInput}
        />
        <IconButton
          onClick={handleCommentSubmit}
          disabled={!comment.trim()}
          className={classes.sendButton}
        >
          <SendIcon />
        </IconButton>
      </form>
      <Divider />
    </>
  )
}

const styles = theme => ({
  form: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
    color: "red"
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
})

export default withStyles(styles)(CreateComment)
