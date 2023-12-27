import Button from '@mui/material/Button';
import "@fontsource/roboto";
import Avatar from '@mui/material/Avatar';
import './AppointmentDetail.css';

import UserCard from '../../components/UserCard';
import DetailComponent from './DetailComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AppointmentList from '../view_appointment_list/ViewAppointmentList';

function AppointmentDetail() {
  const [appointment, setAppointment] = useState(null)
  const Navigate = useNavigate();
  const { id } = useParams();

  const getAppointment = async () => {
    try {
      const formattedStr = `http://localhost:3000/doctor/consultations/${id}`;
      const appoinmentList = await fetch(formattedStr, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => response.json());
      if (appoinmentList.message === "Success") {
        setAppointment(appoinmentList.appt);
        console.log(appoinmentList)
      }
      else {
        console.log(appoinmentList.message);
        alert("Something went wrong");
      }
    } catch (error) {
      console.log(error.message);
      alert("Something went wrong");
    }
  }


  function rescheduleNav() {
    Navigate(`/doctor/appointments/reschedule/${id}`);
  }

  function cancelNav() {
    Navigate(`/doctor/appointments/cancel/${id}`);
  }

  useEffect(() => {
    const fetchData = async () => {
      await getAppointment();
    };
    fetchData();
  }, []);


  return (
    <div className="appointmentDetailsScreen">
      <div className="ScreenBodyAD">
        <div className="halfAD">
          {appointment &&
            <>
              <UserCard user={appointment} />
              <DetailComponent appt={appointment} />
            </>
          }

          <div className='appointmentBtns'>
            <Button variant="contained" onClick={rescheduleNav}
              sx={styles.button}>Reschedule Appointment</Button>
            <Button variant="contained" onClick={cancelNav} sx={styles.button}>Cancel Appointment</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  button: {
    background: "#2854c3",
    width: "100%",
    margin: "10px",
    padding: "10px",
    color: "white",
    fontSize: '1rem',
    textTransform: "none",
    borderRadius: "10px",
  },
};

export default AppointmentDetail;