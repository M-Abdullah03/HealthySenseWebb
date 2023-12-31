const express = require('express');
const auth = require('../middleware/auth/UserAuth');
const doctorAuth = require('../middleware/auth/DoctorAuth');
const doctorController = require('../controllers/DoctorController');

const router = express.Router();

router.post('/register', auth, doctorAuth, doctorController.registerDoctor);

router.get("/consultations", auth, doctorAuth, doctorController.consultations);
router.get("/consultations/:id", auth, doctorAuth, doctorController.getConsultationById);
router.post("/consultations/reschedule", auth, doctorAuth, doctorController.rescheduleAppt);
router.put("/consultations/cancel", auth, doctorAuth, doctorController.cancelAppt);
router.put("/consultations/complete", auth, doctorAuth, doctorController.completeAppt);

router.put("/addSlots",auth, doctorAuth, doctorController.addSlots);
router.get("/slots", auth, doctorAuth, doctorController.getSlots);
router.put("/deleteSlot", auth, doctorAuth, doctorController.deleteSlots);

router.get("/specialties", doctorController.getSpecialties);
router.get("/search", doctorController.searchDoctors);
router.get("/appointments/:id", doctorController.getAppintmentDetails);

router.post("/appointments/:id/diagnosis", doctorController.createDiagnosis);
router.get("/account/:id", doctorController.getAccountDetails);
router.put("/account/:id", doctorController.updateAccount);
router.get("/:appid/history/:id", doctorController.getPatientHistory);
router.put("/diagnosis/update/:id", doctorController.updateDiagnosis);

router.post("/complaint/:id",auth, doctorController.addComplaint);
router.get("/patient-detail/:id", doctorController.getPatientDetails);

module.exports = router;