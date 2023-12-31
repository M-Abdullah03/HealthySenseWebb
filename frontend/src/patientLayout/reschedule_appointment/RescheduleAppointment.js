import PatientIcon from "@mui/icons-material/PeopleAltOutlined";
import ExperienceIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import StarIcon from "@mui/icons-material/StarBorderOutlined";
import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";
import TimeIcon from "@mui/icons-material/AccessTime";
import ReschedIcon from '@mui/icons-material/EditCalendarOutlined';
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import NoteAltIcon from "@mui/icons-material/NoteAlt";

import "@fontsource/roboto";

import "@fontsource/roboto";
import { Box, Grid, Container, Typography, Card, CardContent, FormControl, RadioGroup, FormControlLabel, Radio, TextareaAutosize, Button, InputLabel, Select, MenuItem } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { format } from "date-fns";

import { useImmer } from "use-immer";
import { useState, useEffect, createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import AppointmentCard from "../../components/AppointmentCard";
import api from "../../services/api";

const apptContext = createContext();

const groupSlotsByDate = (slotData) => {
  const groupedSlots = {};
  if (slotData && slotData.length !== 0) {
    slotData.forEach((slot) => {
      let date = slot.date;
      date = format(new Date(date), "yyyy-MM-dd");
      if (!groupedSlots[date]) {
        groupedSlots[date] = [];
      }
      groupedSlots[date].push(slot);
    });
  }

  return groupedSlots;
};

export const RescheduleAppointment = () => {
  const [reason, setReason] = useState("Something urgent came up");
  const [appointment, setAppointment] = useImmer(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [groupedSlots, setGroupedSlots] = useState(null);
  const [type, setType] = useState("Online");
  const [open, setOpen] = useState(false);
  const { id } = useParams();

  function setReasonHandler(event) {
    setReason(event.target.value);
  }

  const getAppointment = async () => {
    try {
      const formattedStr = `/patient/consultations/${id}`;
      const appoinmentList = await api.get(formattedStr).then((response) => response.data);
      setAppointment(appoinmentList);
      setGroupedSlots(groupSlotsByDate(appoinmentList.doctorId.appointmentSlots));
    }
    catch (err) {
      alert(err);
    }

  };

  const rescheduleAppt = async () => {
    try {
      const resched = await api.post("/patient/consultations/reschedule", ({
        id: id,
        date: selectedDate,
        time: selectedTime,
        type: type,
        reason: reason,
      }))
      .then(response=>response.data);
      if (resched.message==="Success") {
      setOpen(true);
        setAppointment(draft=>{
          draft.date=resched.appointment.date;
          draft.time=resched.appointment.time;
          draft.updateReason=reason;
          draft.doctorId.appointmentSlots=resched.appointment.doctorId.appointmentSlots;
          draft.type=resched.appointment.type;
      })
      setGroupedSlots(groupSlotsByDate(resched.appointment.doctorId.appointmentSlots));  
    } 
    else {
      alert("Something went wrong");
    }}
    catch(err)
    {
      alert(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAppointment();
    };
    fetchData();
  }, []);


  const setDate = (e) => {
    setSelectedDate(e.target.value);
    console.log("e.target.value:", e.target.value);
  };

  const setTime = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Container width="100%" sx={{}} >
      <Box sx={{width:{ md:"100%"}, mt:3}}>
      <Grid container alignItems="stretch">
        <Grid item md={6} sm={12}>
          {appointment && <AppointmentCard type="doctor" appt={appointment} />}
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="70%"
            padding="10px"
            sx={{margin:{xs:1,md:3}, backgroundColor: "#eeeeee", borderRadius: "10px" }}
          >
            <PatientIcon fontSize="large" />
            <Typography variant="body1">
              <b>90</b>
            </Typography>
            <Typography variant="body2">Patients</Typography>
          </Box>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Box
           display="flex"
           flexDirection="column"
           alignItems="center"
           justifyContent="center"
           height="70%"
           padding="10px"
           sx={{margin:{xs:1, md:3}, backgroundColor: "#eeeeee", borderRadius: "10px" }}
          >
            <ExperienceIcon fontSize="large" />
            <Typography variant="body1">
              <b>{appointment?.doctorId?.experience} Years</b>
            </Typography>
            <Typography variant="body2">Experience</Typography>
          </Box>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="70%"
            padding="10px"
            sx={{margin:{xs:1,md:3}, backgroundColor: "#eeeeee", borderRadius: "10px" }}
          >
            <StarIcon fontSize="large" />
            <Typography variant="body1">
              <b>4.5</b>
            </Typography>
            <Typography variant="body2">Rating</Typography>
          </Box>
        </Grid>

      </Grid>
      <Container sx={{display:'flex', flexDirection:{md:'row', sm:'column', xs:"column"}, gap: 2, marginTop:2}}>
  <Box width="100%" display="flex" flexDirection="column">
    <Typography variant="h6" color="primary">Reason for Rescheduling</Typography>
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="Something urgent came up"
        name="radio-buttons-group"
      >
        <FormControlLabel
          value="Something urgent came up"
          control={<Radio />}
          label="Something urgent came up"
          onChange={setReasonHandler}
        />
        <FormControlLabel
          value="I'm not feeling well"
          control={<Radio />}
          label="I'm not feeling well"
          onChange={setReasonHandler}
        />
        <FormControlLabel
          value="other"
          control={<Radio />}
          label="Other"
          onChange={setReasonHandler}
        />
      </RadioGroup>
    </FormControl>
    <TextareaAutosize
      minRows={10}
      placeholder="Enter your reason here"
      cols={50}
      disabled={reason !== "I'm not feeling well" && reason !== "Something urgent came up" ? false : true}
      onChange={setReasonHandler}
      sx={{ borderRadius: "10px" }}
    />
  </Box>
  <Box  width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
    <Typography variant="h6" color="primary">Select a New Slot</Typography>
    <Box width="100%">
    {appointment?.doctorId?.session && appointment?.doctorId?.session.map((session) => {
  return (
    <Card sx={{ display: 'flex', mb: 2, width: {md: "100%"}, color: type===session.type? "white":"#2854C3", background: type===session.type? "#2854C3":"white"  }}>
      <Box
      onClick={()=>{setType(session.type)}} 
      sx={{ display: 'flex', alignItems: 'center'}}>
{session.type === "Online" ? 
                        <VideoCameraFrontIcon sx={{color: type===session.type? "white":"#2854C3", ml:{xs:0, md:1}}}/>:
                        <NoteAltIcon sx={{color: type===session.type? "white":"#2854C3", ml:{xs:0, md:1}}}/>}      </Box>
      <CardContent>
      <Box
  onClick={()=>{setType(session.type)}}  
  sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
  <Typography variant="body1" sx={{mr:20}}>{session.type} Session</Typography>
  <Typography variant="body1">Rs. {session.fee} /Session</Typography>
</Box>
</CardContent>
    </Card>
  );
})}
    </Box>
    <FormControl sx={styles.selector}>
      <InputLabel sx={styles.text}>
        <CalendarIcon sx={styles.icon2} /> YYYY - MM - DD
      </InputLabel>
      <Select
        labelId="date-label"
        id="demo-simple-select-filled"
        value={selectedDate ? selectedDate : ""}
        onChange={setDate}
      >
        {groupedSlots &&
          Object.keys(groupedSlots).map((slot) => (
            <MenuItem key={slot} value={slot}>
              {slot}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
    <FormControl sx={styles.selector}>
      <InputLabel id="time-label" sx={styles.text}>
        <TimeIcon sx={styles.icon2} />
        HH:MM (AM/PM)
      </InputLabel>
      <Select
        labelId="time-label"
        value={selectedTime ? selectedTime : ""}
        onChange={setTime}
      >
        {selectedDate &&
          groupedSlots &&
          groupedSlots[selectedDate].map(
            (slot) =>
              slot.availability === true && slot.type===type && (
                <MenuItem key={slot.time} value={slot.time}>
                  {slot.time}
                </MenuItem>
              )
          )}
      </Select>
    </FormControl>
    <Button sx={styles.button} onClick={rescheduleAppt} startIcon={<ReschedIcon/>}>
      Reschedule
    </Button>
  </Box>
</Container>
      </Box>
      <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
         <MuiAlert elevation={6} variant="filled">
          Your appointment has been rescheduled successfully!
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}


const styles = {
  button:{
    padding:2, width:"50%", m:1, textAlign:'left', textTransform:'none', background:'#2854C3', color:'white',
    "&:hover": {
      cursor: "pointer",
      boxShadow: "10px 0px 10px 0px rgba(0, 0, 0, 0.15)",
      background:'#2854C3',
    }
  },
  icon: {
    fontSize: "30px",
    margin: "5%",
    verticalAlign: "middle",
  },
  selector: {
    width: "100%",
    marginTop: "20px",

  },
  text: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

};


