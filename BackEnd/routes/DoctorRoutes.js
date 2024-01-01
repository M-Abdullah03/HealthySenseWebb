const express = require('express');
const auth = require('../middleware/auth/UserAuth');
const doctorAuth = require('../middleware/auth/DoctorAuth');
const doctorController = require('../controllers/DoctorController');

const router = express.Router();

router.post('/register', auth, doctorAuth, doctorController.registerDoctor);

router.get("/consultations", doctorController.consultations);
router.get("/consultations/:id", doctorController.getConsultationById);
router.post("/consultations/reschedule", doctorController.rescheduleAppt);
router.put("/consultations/cancel", doctorController.cancelAppt);
router.put("/consultations/complete", doctorController.completeAppt);

router.put("/addSlots", doctorController.addSlots);
router.get("/slots", doctorController.getSlots);
router.put("/deleteSlot", doctorController.deleteSlots);

router.get("/specialties", doctorController.getSpecialties);
router.get("/search", doctorController.searchDoctors);
router.get("/appointments/:id", doctorController.getAppintmentDetails);

router.post("/appointments/:id/diagnosis", doctorController.createDiagnosis);
router.get("/account/:id", doctorController.getAccountDetails);
router.put("/account/:id", doctorController.updateAccount);
router.get("/:appid/history/:id", doctorController.getPatientHistory);
router.put("/diagnosis/update/:id", doctorController.updateDiagnosis);

router.post("/complaint/:id",auth, doctorController.addComplaint); //add doctor auth

module.exports = router;