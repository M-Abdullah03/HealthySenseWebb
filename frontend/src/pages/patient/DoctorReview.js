import React, { useState, useEffect } from 'react';
import api from '../../services/api';
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
  CircularProgress,
  Avatar,
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

const StyledAvatar = styled(Avatar)({
  width: '70px',
  height: '70px',
});

function DoctorReviewForm() {

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [checkupRating, setCheckupRating] = useState(0);
  const [clinicRating, setClinicRating] = useState(0);
  const [staffRating, setStaffRating] = useState(0);
  const [recommend, setRecommend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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

  const [doctor, setDoctor] = useState({
    name: '',
    specialization: '',
    patients: 0,
    experience: 0,
    rating: 0,
  });

  useEffect(() => {

    const fetchData = () => {
      console.log("cookie: ", document.cookie);
      api.post('/doctor-compact/658c46d48180f6a9f753706c')
        .then(res => {
          setDoctor({
            name: res.data.name,
            specialization: res.data.specialization,
            patients: res.data.patients,
            experience: res.data.experience,
            rating: res.data.rating,
          });
          setIsLoaded(true);
        })
        .catch(err => {
          console.log(err);
          alert(err.response.data.message);
        });
    };

    fetchData();

  }, []);

  const handleSubmit = () => {

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const review = {
      experience: rating,
      comment: comment,
      checkupRating: checkupRating,
      environmentRating: clinicRating,
      staffRating: staffRating,
      recommendation: recommend,
    };

    api.post('/patient/review/658c46d48180f6a9f753706c', review)
      .then(res => {
        console.log(res);
        alert(res.data.message);
      }
      )
      .catch(err => {
        console.log(err);
        alert(err.response.data.message);
      });

    setIsSubmitting(false);
  };

  const url = process.env.REACT_APP_SERVER_URL;

  if (!isLoaded) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Container>
        <Box className={styles.bigPane} p={3}>
          <Hidden smDown>
            <Grid container spacing={3} justifyContent={'center'} mb={2}>
              <Grid item xs={12} sm={6} md={doctor.name.length > 20 || doctor.specialization.length > 20 ? 4 : 3}>
                <Paper className={styles.innerBigPane1}>
                  <Box display="flex" alignItems="center" marginLeft={2} height={100} pr={2} justifyContent={'center'} >
                    <Box>
                      {doctor.image ? (
                        <StyledAvatar src={`${url}/uploads/${doctor.image}`} alt="Profile Picture" />
                      ) : (
                        <StyledAvatar src="/images/photo.png" />
                      )}
                    </Box>
                    <Box ml={2} mt={-2}>
                      <Typography variant="h7" color={'black'} fontWeight={'bold'}>
                        {doctor.name}
                      </Typography>
                      <Typography variant="body2" fontSize={12} color="textSecondary" mt={1}>
                        {doctor.specialization}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Paper className={styles.innerBigPane1}>
                  <Box display="flex" alignItems="center" height={100} flexDirection={'column'} justifyContent={'center'} >
                    <PeopleIcon fontSize="large" color="black" />
                    <Typography variant="h7">{doctor.patients}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Patients
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Paper className={styles.innerBigPane1}>
                  <Box display="flex" alignItems="center" height={100} flexDirection={'column'} justifyContent={'center'} >
                    <School fontSize="large" color="black" />
                    <Typography variant="h7">{doctor.experience}+ Years</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Experience
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Paper className={styles.innerBigPane1}>
                  <Box display="flex" alignItems="center" height={100} flexDirection={'column'} justifyContent={'center'} >
                    <StarRatings
                      rating={doctor.rating / 5}
                      starRatedColor="black"
                      numberOfStars={1}
                      name='rating'
                      starDimension="30px"
                    />
                    <Typography variant="h7">{doctor.rating}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Ratings
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Hidden>
          <Grid container justifyContent={'center'}>
            <Grid item xs={12} sm={9}>
              <Box mt={1}>
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
              <Grid container justifyContent={'center'}>
                <Grid item xs={12} md={7}>
                  <CustomTextField
                    name="comment"
                    label="Comment"
                    multiline
                    margin='normal'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <InsertDriveFile />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Hidden smDown>
                  <Grid style={{ flexGrow: 1 }} />
                </Hidden>
                <Grid item xs={12} md={4} mt={1}>
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
              <Box mt={1}>
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
            <Grid item xs={12} sm={9} mt={3}>
              <Button
                className={styles.submitButton}
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default DoctorReviewForm;