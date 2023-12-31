import React, { useState } from 'react';
import {
    Button,
    Typography,
    Box,
    Container,
    Grid,
    Paper,
    CircularProgress,
    LinearProgress,
    Hidden,
    Dialog,
    DialogTitle,
    DialogContent,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import School from '@mui/icons-material/School';
import ViewListIcon from '@mui/icons-material/ViewList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarRatings from 'react-star-ratings';
import styles from './NotFound.module.css';
import { styled } from '@mui/system';

const BlackLinearProgress = styled(LinearProgress)({
    '& .MuiLinearProgress-bar': {
        backgroundColor: '#000000',
    },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
}));

function NotFoundPage() {

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const rating = 5;
    const checkupRating = 100;
    const clinicRating = 100;
    const staffRating = 100;

    const ratingPercentage = (rating / 5) * 100;

    const doctor = {
        name: "Dr. Muhammad Musa Haroon Satti",
        specialization: "Ophthalmologist",
        rating: 5,
        experience: '20',
        patients: 404,
        certifications: ["Bad at frontend", "Overconfident"],
        services: ["URL Alignment Therapy", "Imaginary Redirect Implants", "URL Correction Surgery"],
        reviews: [
            {
                comment: "Now i can write correct URLs",
                rating: 5,
                date: "2021-10-10 12:00:00",
            },
            {
                comment: "I'm a girl so i can't write URLs but thanks for trying",
                rating: 5,
                date: "2021-10-10 13:00:00",
            },
            {
                comment: "Why am i here again?",
                rating: 1,
                date: "2021-10-10 14:00:00",
            },
        ],
    };

    return (
        <div>
            <Container>
                <Box className={styles.bigPane} p={3}>
                    <Hidden mdDown>
                        <Grid container spacing={3} justifyContent={'center'}>
                            <Grid item xs={12} sm={doctor.name.length > 20 || doctor.specialization.length > 20 ? 4 : 3}>
                                <Paper className={styles.innerBigPane1}>
                                    <Box display="flex" alignItems="center" marginLeft={2} height={100}>
                                        <img src={require('../assets/images/notFound.png')} alt="notFound" style={{ height: '100px', width: '100px' }} />
                                        <Box ml={2} mt={-2}>
                                            <Box>
                                                <Typography variant="h6" color={'black'} fontWeight={'bold'}>
                                                    {doctor.name}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" fontSize={12} color="textSecondary">
                                                {doctor.specialization}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Paper className={styles.innerBigPane1}>
                                    <Box display="flex" alignItems="center" height={100} flexDirection={'column'} justifyContent={'center'} >
                                        <PeopleIcon fontSize="large" color="black" />
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
                                        <School fontSize="large" color="black" />
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
                                            starRatedColor="black"
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
                    <Grid container spacing={3} mt={2}>
                        <Grid item xs={12}>
                            <Grid container spacing={3} alignItems={'center'}>
                                <Grid item xs={12} sm={3}>
                                    <Grid container spacing={3} alignItems={'center'}>
                                        <Grid item xs={3}>
                                            <Box position="relative" display="inline-flex">
                                                <CircularProgress variant="determinate" value={ratingPercentage} style={{ color: 'black' }} size={50} />
                                                <Box
                                                    top={0}
                                                    left={0}
                                                    bottom={0}
                                                    right={0}
                                                    position="absolute"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <Typography variant="subtitle1" fontWeight="bold" component="div" color="textSecondary">
                                                        {`${Math.round(ratingPercentage)}%`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={9}>
                                            <Typography variant="subtitle1" fontWeight="bold">Satisfied patients</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Doctor Checkup
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={10} md={7} >
                                            <Grid container direction="column" justifyContent="center">
                                                <BlackLinearProgress value={checkupRating} variant="determinate" className={styles.linearProgress} />
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={2} md={2}>
                                            <Typography variant="subtitle1" color="textSecondary">{`${checkupRating}%`}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} alignItems={'center'}>
                                        <Grid item xs={12} md={3} >
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Clinic Environment
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={10} md={7}>
                                            <Grid container direction="column" justifyContent="center">
                                                <BlackLinearProgress value={clinicRating} variant="determinate" className={styles.linearProgress} />
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={2} md={2}>
                                            <Typography variant="subtitle1" color="textSecondary">{`${clinicRating}%`}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} alignItems={'center'}>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Staff Behaviour
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={10} md={7}>
                                            <Grid container direction="column" justifyContent="center">
                                                <BlackLinearProgress value={staffRating} variant="determinate" className={styles.linearProgress} />
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={2} md={2}>
                                            <Typography variant="subtitle1" color="textSecondary">{`${staffRating}%`}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Button onClick={handleClickOpen} startIcon={<ViewListIcon />} style={{ marginTop: '20px' }}>View Certifications</Button>
                    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'sm'}>
                        <DialogTitle alignContent={'center'}>Doctor Certifications</DialogTitle>
                        <DialogContent>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell>Certification Name</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {doctor.certifications.map((certification, index) => (
                                            <StyledTableRow key={index}>
                                                <TableCell>{certification}</TableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DialogContent>
                    </Dialog>
                    <Grid container spacing={2} p={2} bgcolor='#eff6fc' mt={3} borderRadius={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={'bold'} fontSize={18}>
                                About Doctor
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom fontSize={14}>
                                <b>404-Not Found</b>, Struggling with typing the right web addresses? Don't stress—meet Muhammad Musa Haroon Satti, the friendly URL Expert at HealthySense.
                                One appointment with him and you'll be typing URLs like a professional. He's a specialist in URL Alignment Therapy, Imaginary Redirect Implants,
                                and URL Correction Surgery. He's also a member of the Pakistan URL Association and the American URL Association. He's been practicing for 5 years
                                and has helped over 10000 patients. His journey started when he was a child and he couldn't type URLs correctly. He was bullied by his classmates
                                and his parents were worried. He went to a doctor who helped him type URLs correctly. He was so inspired by the doctor that he decided to become a doctor himself.
                                He's been helping people type URLs correctly ever since. He's available for online and in-person appointments, so book an appointment with him now!
                            </Typography>
                        </Grid>
                        <Grid container spacing={2} alignItems="flex-end" p={2}>
                            <Grid item xs={12} md={8}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={'bold'} fontSize={18}>
                                        Services
                                    </Typography>
                                    {doctor.services.map((service, index) => (
                                        <Typography key={index} variant="body2" color="text.secondary" gutterBottom fontSize={14}>
                                            - {service}
                                        </Typography>
                                    ))}
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box p={2} bgcolor={'#ffffff'} borderRadius={2}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={2}>
                                                    <Typography variant="h6" color="text.secondary" gutterBottom fontSize={14} fontWeight={'bold'}>
                                                        Fee:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom fontSize={14} align='right'>
                                                        Rs. 000
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Divider />
                                            <Grid container mt={3}>
                                                <Grid item xs={1}>
                                                    <LocationOnIcon color="action" />
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <Typography variant="h6" color="text.secondary" gutterBottom fontSize={14} fontWeight={'bold'}>
                                                        Address:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom fontSize={14} align='right'>
                                                        NUCES Hospital, FAST, Karachi
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Divider />
                                            <Grid container alignItems="center" mt={1} spacing={2}>
                                                <Hidden mdDown>
                                                    <Grid item md={1}>
                                                        <CheckCircleIcon color="success" />
                                                    </Grid>
                                                </Hidden>
                                                <Grid item xs={12} md={10} ml={1}>
                                                    <Typography variant="h6" color="text.secondary" gutterBottom fontSize={14} fontWeight={'bold'}>
                                                        <span style={{ color: '#26b937' }}>Available</span>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Typography variant="h6" color="text.primary" mb={2} mt={3} fontWeight={'bold'} fontSize={18}>
                        Latest Reviews
                    </Typography>
                    {doctor.reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).map((review, index) => (
                        <Paper key={index} sx={{ p: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2, boxShadow: 3 }}>
                            <Typography variant="body1" color="text.secondary" sx={{ pr: 2, fontSize: 14, fontWeight: 'bold' }}>
                                {review.comment}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <StarRatings
                                        rating={review.rating / 5}
                                        starRatedColor="black"
                                        numberOfStars={1}
                                        name='rating'
                                        starDimension="20px"
                                    />
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontSize: 14, fontWeight: 'bold' }}>
                                        {review.rating}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Container>
        </div >
    );
}

export default NotFoundPage;