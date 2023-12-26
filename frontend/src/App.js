import NavBar from './Components/NavBar.js';
import AppointmentDetail from './DoctorLayout/AppointmentDetail.js';
import CustomTabPanel from './DoctorLayout/ViewAppointmentList.js';
import CancelAppointment from './DoctorLayout/CancelAppointment.js';
import AppointmentSlots from './DoctorLayout/AppointmentSlots.js';
import RescheduleAppointment from './DoctorLayout/RescheduleAppointment.js';

import ViewAllDoctors from './AdminLayout/ViewAllDoctors.js';
import ViewAllPatients from './AdminLayout/ViewAllPatients.js';

import { Routes, Route } from 'react-router-dom';
import Search from './pages/Search.js';
function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/admin" element={<NavBar />}>
          <Route index element={<ViewAllPatients />} />
          <Route path="/admin/doctors" element={<ViewAllDoctors />} />
          <Route path='/admin/patients' element={<ViewAllPatients />} />
        </Route>
        <Route path="/doctor" element={<NavBar />}>
          <Route index element={<CustomTabPanel />} />
          <Route path="/doctor/appointments/:id" element={<AppointmentDetail />} />
          <Route path="/doctor/appointments" element={<CustomTabPanel />} />
          <Route path="/doctor/appointments/cancel/:id" element={<CancelAppointment />} />
          <Route path="/doctor/appointmentSlots" element={<AppointmentSlots />} />
          <Route path="/doctor/appointments/reschedule/:id" element={<RescheduleAppointment />} />
        </Route>

      </Routes>
    </div >
  );
}

export default App;
