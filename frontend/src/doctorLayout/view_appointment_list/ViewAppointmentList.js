import {React, useEffect, useState} from 'react';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';

import ApptCardForList from '../../components/ApptCardForList';







async function fetchAppointments() {
  try{
    const appoinmentList= await fetch(`/doctor/consultations`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response =>  response.json());
    if(appoinmentList.message=== 'Success')
    {
        return appoinmentList.appt;
    }
    else
    {
        return null;
    }
  }catch(error){
    console.log(error);
    alert("Something went wrong");
  }
}

 function AppointmentList() {
  const [value, setValue] = useState('Booked');
  const [appointmentList, setAppointmentList] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAppointments();
      if (data) {
        setAppointmentList(data);
      }
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="secondary tabs example"
        >
          <Tab value="Booked" label="Scheduled" sx={{ textTransform: 'none' }} />
          <Tab value="Completed" label="Completed" sx={{ textTransform: 'none' }} />
          <Tab value="Cancelled" label="Cancelled" sx={{ textTransform: 'none' }} />
        </Tabs>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems:'center', justifyContent:'center' }}>
        {appointmentList && appointmentList.map((app, index) => 
          app?.status === value ? (
              <ApptCardForList type="patient" appt={app} />
          ) : null
        )}
      </Box>
    </Container>
  );
}

export default AppointmentList;