import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Button,
    TextField,
    Link,
    Box,
    Hidden,
    Typography,
    Avatar,
    CssBaseline,
    Select,
    InputAdornment,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Paper,
    FormLabel,
    Input,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FlagIcon from '@mui/icons-material/Flag';
import DoctorIcon from '@mui/icons-material/LocalHospital';
import PatientIcon from '@mui/icons-material/Person';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
}));

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
}));

const StyledInput = styled(Input)(({ theme }) => ({
    display: 'none',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    "&:hover": {
        "&& fieldset": {
            borderColor: theme.palette.primary.main,
        }
    }
}));

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dob: '',
        country: '',
        phoneNumber: '',
        gender: '',
        blood: '',
    });

    const [showPassword, setShowPassword] = React.useState(false);

    const handleShowPassword = () => setShowPassword(!showPassword);


    const [contryCode, setCountryCode] = useState('');

    const [accountType, setAccountType] = useState('Patient');

    const [profilePicture, setProfilePicture] = useState(null);

    const [file, setFile] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleProfilePictureChange = (event) => {
        const f = event.target.files[0];

        setFile(f);

        const reader = new FileReader();

        reader.onloadend = () => {
            setProfilePicture(reader.result);
        };

        if (f) {
            reader.readAsDataURL(f);
        } else {
            setProfilePicture(null);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCountryCodeChange = (e) => {
        setCountryCode(e.target.value);
    };

    const formatPhoneNumber = (phoneNumberString) => {
        const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
        const number = contryCode + cleaned;
        return number;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSubmitting)
            return;

        setIsSubmitting(s => !s);

        const data = new FormData();
        data.append('profilePicture', file);
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('dob', formData.dob);
        data.append('country', formData.country);
        data.append('phoneNumber', formatPhoneNumber(formData.phoneNumber));
        data.append('gender', formData.gender);
        data.append('type', accountType);
        data.append('bloodGroup', formData.blood);

        api.post('/signup', data)
            .then(res => {
                console.log(res);
                document.cookie = `token=${res.data.token}`;
                if (res.data.result.type === 'Doctor') {
                    navigate(`/register`, { replace: true });
                } else if (res.data.result.type === 'Patient') {
                    navigate(`/${res.data.result._id}/patient`, { replace: true });
                }
            })
            .catch(err => {
                console.log(err);
                alert(err.response.data.message);
            });

        setIsSubmitting(s => !s);
    };

    return (
        <Box sx={{ width: '100%', height: { xs: 'auto', md: '100vh' } }} bgcolor={'#F1F1F1'}>
            <Grid container>
                <Grid container item xs={12} md={6}
                    sx={{
                        background: 'linear-gradient(to bottom, #0045F3 0%, #454545 126.02%)',
                        height: { xs: '15vh', md: '100vh' },
                        overflow: 'hidden',
                        position: { xs: 'fixed', md: 'relative' },
                        zIndex: '10',
                    }}
                    justifyContent="center"
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'row', md: 'column' },
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Hidden mdDown>
                            <img src="./imgs/LOGO.png" alt="Healthy Sense Logo" style={{ width: '300px', height: '300px' }} />
                            <Typography component="h1" variant="h2" color='white'>
                                HealthySense
                            </Typography>
                        </Hidden>
                        <Hidden mdUp>
                            <img src="./imgs/LOGO.png" alt="Healthy Sense Logo" style={{ width: '70px', height: '70px' }} />
                            <Typography component="h1" variant="h5" color='white'>
                                HealthySense
                            </Typography>
                        </Hidden>
                    </Box>
                </Grid>
                <Grid container item xs={12} md={6} justifyContent="center" alignItems="center"
                    sx={{ height: { xs: 'auto', md: '100vh' }, p: 2, marginTop: { xs: '150px', md: '0' }, overflow: 'auto' }}
                >
                    <CssBaseline />
                    <StyledBox>
                        <StyledAvatar>
                            <LockOutlinedIcon />
                        </StyledAvatar>
                        <Typography component='h1' variant='h5'>
                            Sign Up
                        </Typography>
                        <form noValidate autoComplete='off' onSubmit={handleSubmit}>
                            <StyledTextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                id='name'
                                label='Full Name'
                                name='name'
                                autoFocus
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <AccountCircleOutlinedIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormControl component="fieldset" margin="normal" >
                                <FormLabel component="legend">Profile Picture</FormLabel>
                                <StyledInput
                                    id="icon-button-file"
                                    type="file"
                                    onChange={handleProfilePictureChange}
                                    inputProps={{ accept: "image/png, image/jpeg , image/jpg" }}
                                />
                                <Grid container justifyContent="flex-start" alignItems="center" spacing={2}>
                                    <Grid item>
                                        <IconButton color="primary" component="span" onClick={() => document.getElementById('icon-button-file').click()}>
                                            <PhotoCamera />
                                        </IconButton>
                                    </Grid>
                                    <Grid item>
                                        {profilePicture && <img src={profilePicture} alt="Profile" style={{ width: '70px', height: '70px', borderRadius: '50%', marginTop: '10px' }} />}
                                    </Grid>
                                </Grid>
                            </FormControl>
                            <StyledTextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                id='email'
                                label='Email Address'
                                name='email'
                                autoComplete='off'
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <EmailOutlinedIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <StyledTextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                name='password'
                                label='Password'
                                type={showPassword ? 'text' : 'password'}
                                id='password'
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <VpnKeyOutlinedIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleShowPassword}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <StyledDatePicker
                                    margin='normal'
                                    id='dob'
                                    label='Date of Birth'
                                    name='dob'
                                    inputFormat='yyyy-MM-dd'
                                    fullWidth
                                    onChange={(date) => setFormData({ ...formData, dob: date })}
                                    maxDate={dayjs(new Date())}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            margin: 'normal',
                                            name: 'dob',
                                            required: true,
                                            InputProps: {
                                                startAdornment: (
                                                    <InputAdornment position='start'>
                                                        <CakeOutlinedIcon />
                                                    </InputAdornment>
                                                ),
                                            },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                            <FormControl variant="outlined" margin='normal' required fullWidth>
                                <InputLabel id="country-label">Country</InputLabel>
                                <StyledSelect
                                    labelId="country-label"
                                    id="country"
                                    name="country"
                                    label="Country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    startAdornment={
                                        <InputAdornment position='start'>
                                            <RoomOutlinedIcon />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value={'Pakistan'}>Pakistan</MenuItem>
                                </StyledSelect>
                            </FormControl>
                            <Grid container spacing={2} >
                                <Grid item xs={12} sm={3}>
                                    <FormControl variant="outlined" margin='normal' required fullWidth>
                                        <InputLabel id="country-code-label">Country Code</InputLabel>
                                        <StyledSelect
                                            labelId="country-code-label"
                                            id="country-code"
                                            label="Country Code"
                                            value={contryCode}
                                            onChange={handleCountryCodeChange}
                                            startAdornment={
                                                <InputAdornment position='start'>
                                                    <FlagIcon />
                                                </InputAdornment>
                                            }
                                        >
                                            <MenuItem value={'+92'}>+92</MenuItem>
                                        </StyledSelect>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <InputMask
                                        mask="9 9 9 - 9 9 9 9 9 9 9"
                                        onChange={handleChange}
                                    >
                                        {() =>
                                            <StyledTextField
                                                variant='outlined'
                                                margin='normal'
                                                required
                                                fullWidth
                                                name='phoneNumber'
                                                label='Phone Number'
                                                id='phoneNumber'
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position='start'>
                                                            <PhoneAndroidOutlinedIcon />
                                                        </InputAdornment >
                                                    ),
                                                }}
                                            />
                                        }
                                    </InputMask>
                                </Grid>
                            </Grid>
                            <FormControl variant="outlined" margin='normal' required fullWidth>
                                <InputLabel id="gender-label">Gender</InputLabel>
                                <StyledSelect
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    label="gender"
                                    onChange={handleChange}
                                    value={formData.gender}
                                    startAdornment={
                                        <InputAdornment position='start'>
                                            <PersonOutlineOutlinedIcon />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value={'Male'}>Male</MenuItem>
                                    <MenuItem value={'Female'}>Female</MenuItem>
                                    <MenuItem value={'Other'}>Other</MenuItem>
                                </StyledSelect>
                            </FormControl>
                            <Box margin='normal'>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" color="grey"> Account Type </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper
                                            elevation={accountType === 'Patient' ? 4 : 1}
                                            style={{ padding: '10px', borderRadius: '10px', cursor: 'pointer' }}
                                            onClick={() => setAccountType('Patient')}
                                        >
                                            <IconButton color={accountType === 'Patient' ? 'primary' : 'default'}>
                                                <PatientIcon fontSize="large" />
                                                <Typography variant="subtitle1">Patient</Typography>
                                            </IconButton>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper
                                            elevation={accountType === 'Doctor' ? 4 : 1}
                                            style={{ padding: '10px', borderRadius: '10px', cursor: 'pointer' }}
                                            onClick={() => { setAccountType('Doctor'); setFormData({ ...formData, blood: '' }) }}
                                        >
                                            <IconButton color={accountType === 'Doctor' ? 'primary' : 'default'}>
                                                <DoctorIcon fontSize="large" />
                                                <Typography variant="subtitle1">Doctor</Typography>
                                            </IconButton>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                            {accountType === 'Patient' && (
                                <FormControl variant="outlined" margin='normal' required fullWidth style={{ marginTop: '30px' }}>
                                    <InputLabel id="blood">Blood Group</InputLabel>
                                    <StyledSelect
                                        labelId="blood-label"
                                        id="blood"
                                        name="blood"
                                        label="blood group"
                                        value={formData.blood}
                                        onChange={handleChange}
                                        startAdornment={
                                            <InputAdornment position='start'>
                                                <LocalHospitalIcon />
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value={'A+'}>A+</MenuItem>
                                        <MenuItem value={'A-'}>A-</MenuItem>
                                        <MenuItem value={'B+'}>B+</MenuItem>
                                        <MenuItem value={'B-'}>B-</MenuItem>
                                        <MenuItem value={'AB+'}>AB+</MenuItem>
                                        <MenuItem value={'AB-'}>AB-</MenuItem>
                                        <MenuItem value={'O+'}>O+</MenuItem>
                                        <MenuItem value={'O-'}>O-</MenuItem>
                                    </StyledSelect>
                                </FormControl>
                            )}
                            <StyledButton
                                type='submit'
                                fullWidth
                                variant='contained'
                                color='primary'
                                disabled={isSubmitting}
                            >
                                Sign Up
                            </StyledButton>
                            <Typography component='p' variant='body2'>
                                Already have an account?&nbsp;
                                <Link href="" variant="body2" onClick={() => navigate('/login', { replace: true })} underline='none'>
                                    {'Log In'}
                                </Link>
                            </Typography>
                        </form>
                    </StyledBox>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Signup;