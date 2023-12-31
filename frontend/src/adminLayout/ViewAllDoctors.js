import { React, useEffect, useState } from "react";
import "./ViewAllPatients.css";
import DoctorCard from "../components/DoctorCard";
import { Box } from "@mui/material";
import api from "../services/api";

function ViewAlldoctors() {
  const [doctorList, setDoctorList] = useState([]);

  const fetchUsers = async () => {
    const docList = await api.get("/admin/doctorList")
      .then(response => response.data);
    setDoctorList(docList);
    console.log(docList);
  }


  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
      console.log(doctorList)
    };
    fetchData();
    console.log(doctorList.length)
  }, []);


  return (

    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', p: 2, justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
      {doctorList?.length > 0 && doctorList.map((doctor, index) => {
        return (
          <DoctorCard user={doctor} key={index} />
        );
      })}
    </Box>

  );
}



export default ViewAlldoctors;
