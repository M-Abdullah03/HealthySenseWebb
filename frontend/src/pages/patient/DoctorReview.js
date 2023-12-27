import React, { useState } from 'react';
import {
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  TextField,
  Hidden,
} from '@mui/material';
import { styled } from '@mui/system';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import School from '@mui/icons-material/School';
import InsertDriveFile from '@mui/icons-material/InsertDriveFile';
import StarRatings from 'react-star-ratings';
import ReactStars from "react-rating-stars-component";
import styles from './DoctorReview.module.css';

const CustomTextField = styled(TextField)({
  '& .MuiInputAdornment-root.MuiInputAdornment-positionStart': {
    marginTop: '0.7rem',
    marginBottom: 'auto',
  },
});

// Main Functional Component
function DoctorReviewForm() {

  const [rating, setRating] = useState(0);
  const [checkupRating, setCheckupRating] = useState(0);
  const [clinicRating, setClinicRating] = useState(0);
  const [staffRating, setStaffRating] = useState(0);
  const [recommend, setRecommend] = useState(false);

  const onRatingChange = (e) => {
    setRating(e);
    console.log(rating);
  };

  const onCheckupRatingChange = (e) => {
    setCheckupRating(e);
    console.log(checkupRating);
  };

  const onClinicRatingChange = (e) => {
    setClinicRating(e);
    console.log(clinicRating);
  };

  const onStaffRatingChange = (e) => {
    setStaffRating(e);
    console.log(staffRating);
  };

  const doctor = {
    name: "Dr. Amna Irum",
    specialization: "Dermatologist",
    rating: 3,
    experience: 5,
    patients: 100,
  };

  return (
    <div>
      <Container>
        <Box className={styles.bigPane} p={3}>
          <Hidden smDown>
            <Grid container spacing={3} justifyContent={'center'}>
              <Grid item xs={12} sm={3}>
                <Paper className={styles.innerBigPane1}>
                  <Box display="flex" alignItems="center" marginLeft={2} height={100}>
                    <PersonIcon fontSize="large" color="primary" />
                    <Box ml={2}>
                      <Typography variant="h6">{doctor.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {doctor.specialization}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Paper className={styles.innerBigPane1}>
                  <Box display="flex" alignItems="center" height={100} flexDirection={'column'} justifyContent={'center'} >
                    <PeopleIcon fontSize="large" color="primary" />
                    <Typography variant="h6">{doctor.patients}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Patients
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Paper className={styles.innerBigPane1}>
                  <Box display="flex" alignItems="center" height={100} flexDirection={'column'} justifyContent={'center'} >
                    <School fontSize="large" color="primary" />
                    <Typography variant="h6">{doctor.experience}+ Years</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Experience
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Paper className={styles.innerBigPane1}>
                  <Box display="flex" alignItems="center" height={100} flexDirection={'column'} justifyContent={'center'} >
                    <StarRatings
                      rating={doctor.rating / 5}
                      starRatedColor="#2854C3"
                      numberOfStars={1}
                      name='rating'
                      starDimension="30px"
                    />
                    <Typography variant="h6">{doctor.rating}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Ratings
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Hidden>
          <Grid container spacing={3} justifyContent={'center'}>
            <Grid item xs={12} sm={9}>
              <Box mt={3}>
                <Typography variant="h7" color="#2854C3" mb={-1}> How was your overall experience with the doctor?</Typography>
                <ReactStars
                  count={5}
                  value={rating}
                  size={40}
                  activeColor="#2854C3"
                  isHalf={true}
                  edit={true}
                  color={"lightblue"}
                  onChange={onRatingChange}
                />
              </Box>
              <Grid container spacing={5} >
                <Grid item xs={12} sm={9}>
                  <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                    <CustomTextField
                      name="comment"
                      label="Comment"
                      multiline
                      margin='normal'
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <InsertDriveFile />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="h7" color="#2854C3" mb={-1}>Rate the checkup</Typography>
                  <ReactStars
                    count={5}
                    value={checkupRating}
                    size={40}
                    activeColor="#2854C3"
                    isHalf={true}
                    edit={true}
                    color={"lightblue"}
                    onChange={onCheckupRatingChange}
                  />
                  <Typography variant="h7" color="#2854C3" mb={-1}>Clinic environment</Typography>
                  <ReactStars
                    count={5}
                    value={clinicRating}
                    size={40}
                    activeColor="#2854C3"
                    isHalf={true}
                    edit={true}
                    color={"lightblue"}
                    onChange={onClinicRatingChange}
                  />
                  <Typography variant="h7" color="#2854C3" mb={-1}>Staff behaviour</Typography>
                  <ReactStars
                    count={5}
                    value={staffRating}
                    size={40}
                    activeColor="#2854C3"
                    isHalf={true}
                    edit={true}
                    color={"lightblue"}
                    onChange={onStaffRatingChange}
                  />
                </Grid>
              </Grid>
              <Box mt={3}>
                <Typography variant="h7" color="#2854C3" mb={-2}>Would you recommend them to a friend?</Typography>
                <RadioGroup row aria-label="recommend" name="recommend">
                  <FormControlLabel
                    value="yes"
                    control={
                      <Radio
                        color="primary"
                        checked={recommend}
                        onClick={() => setRecommend(!recommend)}
                      />
                    }
                    label="Yes"
                    className={styles.radioButtons}
                  />
                </RadioGroup>
              </Box>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Button
              className={styles.submitButton}
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default DoctorReviewForm;