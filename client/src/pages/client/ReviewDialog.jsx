// ReviewDialog.jsx

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams } from "react-router-dom";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import { openAlert } from "../../redux/features/messageSlice";
import { PropTypes } from "prop-types";

const ReviewDialog = ({ open, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState("");

  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date();

      dispatch(showLoading());
      const date = moment(currentDate).format("YYYY-MM-DD");
      const reviewData = {
        clientId: user?._id,
        caregiverId: params.userId,
        date,
        rating,
        comment,
        feedback,
      };
      const res = await axios.post(
        "http://localhost:8070/api/v1/user/addReview",
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(
          openAlert({
            severity: "success",
            content: res.data.message,
          })
        );
        handleClose();
        window.location.reload();
      }
    } catch (error) {
      dispatch(hideLoading());
      if (error.response && error.response.status === 403) {
        dispatch(
          openAlert({
            severity: "info",
            content: error.response.data.message,
          })
        );
      } else {
        console.log(error);
        dispatch(
          openAlert({
            severity: "error",
            content: "Something went wrong!",
          })
        );
      }
    } finally {
      dispatch(hideLoading());
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Write a Review</DialogTitle>
      <DialogContent>
        {/* Rating Component */}
        <Rating
          name="rating"
          value={rating}
          precision={1}
          onChange={handleRatingChange}
          size="large"
        />

        {/* Comment Select */}
        <FormControl fullWidth variant="filled" style={{ marginTop: "16px" }}>
          <InputLabel id="comment-label">Comment</InputLabel>
          <Select
            labelId="comment-label"
            label="Select Option"
            value={comment}
            onChange={handleCommentChange}
            required
          >
            <MenuItem value="excellent">Excellent</MenuItem>
            <MenuItem value="satisfactory">Satisfactory</MenuItem>
            <MenuItem value="good">Good</MenuItem>
            <MenuItem value="poor">Poor</MenuItem>
            <MenuItem value="unsatisfactory">Unsatisfactory</MenuItem>
          </Select>
        </FormControl>

        {/* Feedback Textarea */}
        <TextField
          required
          multiline
          rows={5}
          variant="filled"
          label="Feedback"
          fullWidth
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={{ marginTop: "16px" }}
        />
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          className="bg-[#1976d2] hover:bg-[#1565c0]"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ReviewDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReviewDialog;
