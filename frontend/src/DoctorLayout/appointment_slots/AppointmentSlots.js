import "@fontsource/roboto";
import "./AppointmentSlots.css";
import { React, useState, createContext, useContext, useEffect } from "react";
import axios from "axios";  

import { format } from "date-fns";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControl } from "@mui/material";
import { Card } from "@mui/material";
import {CardContent} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { SingleInputTimeRangeField } from "@mui/x-date-pickers-pro/SingleInputTimeRangeField";


const groupSlotsByDate = (slotData) => {
  const groupedSlots = {};
  slotData.forEach((slot) => {
    let date = slot.date;
    date = format(new Date(date), "yyyy-MM-dd");
    if (!groupedSlots[date]) {
      groupedSlots[date] = [];
    }
    groupedSlots[date].push(slot);
  });

  return groupedSlots;
};

function findDayFromDate(inputDate) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dateObject = new Date(inputDate);
  const dayIndex = dateObject.getDay();

  return daysOfWeek[dayIndex];
}

const slotContext = createContext({
  slotList: {},
  setSlotList: () => {},
});

const AddSlotDialog = ({ open, setOpen }) => {
  const [timeRangeFields, setTimeRangeFields] = useState([]);
  const [date, setDate] = useState();
  const [timeList, setTimeList] = useState([]);
  const { slotList, setSlotList } = useContext(slotContext);
  const [type,setType]=useState("Online");
  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    const responseObj=await axios.put(`http://localhost:3000/doctor/addSlots`,{slots: timeList})
                      .then(response=>response.data);

    if (responseObj.message === "Success") {
      alert("Slots added successfully!");
      setSlotList((prevSlotList) => {
        const currentDateKey = format(new Date(date), "yyyy-MM-dd");
        const updatedSlotList = { ...prevSlotList };
        if (!updatedSlotList[currentDateKey]) {
          updatedSlotList[currentDateKey] = [];
        }
        return {
          ...updatedSlotList,
          [currentDateKey]: [...updatedSlotList[currentDateKey], ...timeList],
        };
      });
    }
    else{
      alert("Slots could not be added!");
    }
    handleClose();
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleTimeChange = (newTime) => {
    console.log("newTime:", newTime);

    if (newTime) {
      if (
        Array.isArray(newTime) &&
        newTime.length === 2 &&
        newTime[0] &&
        newTime[1]
      ) {
        const startTime = newTime[0].toDate();
        const endTime = newTime[1].toDate();
        if (startTime && endTime && startTime < endTime) {
          const startTimeStr =
            (startTime.getHours() % 12) +
            ":" +
            startTime.getMinutes() +
            " " +
            (startTime.getHours() >= 12 ? "PM" : "AM");
          const endTimeStr =
            (endTime.getHours() % 12) +
            ":" +
            endTime.getMinutes() +
            " " +
            (endTime.getHours() >= 12 ? "PM" : "AM");
          const timeStr = startTimeStr + " - " + endTimeStr;
          if (!timeList.includes(timeStr) && !timeStr.includes("NaN")) {
            const timeObj = {
              time: timeStr,
              availability: true,
              type:type,
              date: format(new Date(date), "yyyy-MM-dd"),
            };
            setTimeList([...timeList, timeObj]);
          }
        }
      }
    }
  };

  const addAnotherSlot = () => {
    if (date) {
      setTimeRangeFields((prevFields) => [
        ...prevFields,
        <SingleInputTimeRangeField
          disablePast
          slotProps={{ textField: { variant: "standard", size: "medium" } }}
          key={prevFields.length}
          label="HH:MM (AM/PM)"
          onChange={handleTimeChange}
          style={{ width: "100%", padding: "0px" }}
        />,
      ]);
    }
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth={true}
      open={open}
      onClose={handleClose}
      classes={{ paper: "MuiDialog-paper" }}
    >
      <DialogTitle
        style={{
          display: "flex",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
          background: "#f4f9fb",
        }}
      >
        Add Slots
      </DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          justifyContent: "center",
          background: "#f4f9fb",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="typeSetter">
              <FormControl sx={{ width: "100%", margin: "5px",marginBottom:'0px' }}>
                <Card onClick={()=>{setType("Online")}} sx={type && type==="Online"? styles.card1:styles.card2}>
                 <CardContent>Online Session</CardContent>
                </Card>
              </FormControl> 
              <FormControl sx={{ width: "100%", margin: "5px" }}>
                <Card onClick={()=>{setType("Clinic")}} sx={type && type==="Clinic"? styles.card1:styles.card2}>
                 <CardContent>Clinic Session</CardContent>
                </Card>
              </FormControl>
            </div>
          <h3 style={{ margin: "5px" }}>Select Date</h3>
          <DatePicker
            format="YYYY - MM - DD "
            disablePast
            slotProps={{ textField: { variant: "filled" } }}
            label="MM/DD/YYYY"
            style={{ margin: "5px" }}
            onChange={handleDateChange}
            dateAdapter={AdapterDayjs}
          />
          <h3 style={{ margin: "5px" }}>Add Time Slots</h3>
          {timeRangeFields.length === 0 && addAnotherSlot()}
          {timeRangeFields &&
            timeRangeFields.map((field, index) => (
              <div key={index} style={{ marginTop: "10px" }}>
                {field}
              </div>
            ))}
        </LocalizationProvider>
      </DialogContent>
      <DialogActions style={{ background: "#f4f9fb" }}>
        <Button onClick={addAnotherSlot} className="actionButton">
          {" "}
          Add Another Slot
        </Button>
        <Button onClick={handleClose} className="actionButton">
          Cancel
        </Button>
        <Button onClick={handleSave} className="actionButton">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AppointmentSlots() {
  const [open, setOpen] = useState(false);
  const [slotList, setSlotList] = useState(null);
  const [groupedSlots, setGroupedSlots] = useState(null); // [date, slots
  const handleClickOpen = () => {
    setOpen(true);
  };

  console.log("slotList:", slotList);
  const getSlots = async () => {
    try{
      const responseObj = await axios.get(`http://localhost:3000/doctor/slots`);
      if (responseObj.data.message === "Success") {
        setSlotList(groupSlotsByDate(responseObj.data.slots));
        // setslotList(groupSlotsByDate(responseObj.data.slots));
        
      }else
      {
        alert("Slots could not be fetched!");
      }
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchFunc = async () => {
    getSlots();
    };
    fetchFunc();
  },[]);
 

  return (
    <div className="appointmentDetailsScreen">
      <div className="ScreenBodyAppointment">
        <div className="halfApp">
          <div className="slotList">
            {slotList &&
              Object.keys(slotList).map((date) => {
                return (
                  <slotContext.Provider value={{ slotList, setSlotList }}>
                  <SlotList date={date} slotListByDate={slotList[date]} />
                  </slotContext.Provider>
                  )
              })}
          </div>

          <div className="appointmentBtns">
            <Button
              variant="contained"
              style={{
                background: "#2854c3",
                margin: "10px",
                width: "25%",
                padding: "10px",
                textTransform: "none",
                borderRadius: "10px",
              }}
              onClick={handleClickOpen}
            >
              Add Slots
            </Button>
          </div>
          {open ? (
            <slotContext.Provider value={{ slotList, setSlotList }}>
              <AddSlotDialog open={open} setOpen={setOpen} />
            </slotContext.Provider>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const SlotList = ({ date, slotListByDate }) => {
  const [open, setOpen] = useState(false);
  const {slotList,setSlotList}=useContext(slotContext);
  function checkDate(date) {
    const today = new Date();
    const todayDate = format(today, "yyyy-MM-dd");
    if (date >= format(today.setDate(today.getDate() + 1), "yyyy-MM-dd")) {
      return true;
    } else {
      return false;
    }
  }

  const deleteSlot = async (time,type) => {
    console.log("e.target.value:", time);
    console.log("e.target.value2:", type);
    const responseObj=await axios.put(`http://localhost:3000/doctor/deleteSlot`,{date:date, time:time, type:type})
                      .then(response=>response.data);
    if (responseObj.message === "Success") {
      alert("Slot deleted successfully!");
      setSlotList(groupSlotsByDate(responseObj.slots))
    }
  }

  const day = findDayFromDate(date);
  return (
    <div className="slotDay">
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <thead>
          <tr>
            <th
              colSpan={3}
              style={{
                background: "#2854C3",
                color: "#ffff",
                padding: "15px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              {date} {day}
            </th>
          </tr>
          <tr
            style={{
              background: "#f9f9f9",
              color: "#2854C3",
              fontWeight: "bold",
            }}
          >
            <td style={{ padding: "10px", textAlign: "left" }}>Slot Timing</td>
            <td style={{ padding: "10px", textAlign: "center" }}>
              Availability
            </td>
            <td style={{ padding: "10px", textAlign: "right" }}>Actions</td>
          </tr>
        </thead>
        <tbody>
          {slotListByDate &&
            slotListByDate.map((slot) => {
              return (
                <tr>
                  <td style={{ padding: "10px" }}>{slot.time}</td>
                  <td style={{ padding: "10px" }}>
                    {slot.availability ? "Available" : "Unavailable"}
                  </td>
                  <td style={{ padding: "10px", textAlign: "right" }}>
                    <Button
                      disabled={!checkDate(date)}
                      onClick={()=>deleteSlot(slot.time, slot.type)}
                      style={{
                        textTransform: "none",
                        background: !checkDate(date) ? "gray" : "#2854c3",
                        color: "#ffffff",
                      }}
                    >
                      Delete Slot
                    </Button>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  );
};


const styles={
  card1:{
    width: "90%",
    marginBottom:'0px',
    background: "#2854c3",
    color: "white",
    borderRadius: "10px",
    padding: "10px",
  },
  card2:{
    width: "90%",
    margin: "5px",
    background: "#f7f7f7",
    color: "black",
    borderRadius: "10px",
    padding: "10px",
  }
}



export default AppointmentSlots;