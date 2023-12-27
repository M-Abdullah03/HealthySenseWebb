const express = require('express');
const patientController = require('../controllers/PatientController');
const auth = require('../auth/UserAuth');
const router = express.Router();


router.get('/favorites', auth, patientController.getFavorites);
router.post('/favorites', auth, patientController.addFavorite);
router.get("/consultations", patientController.consultations);
router.get("/consultations/:id", patientController.getConsultationById);
router.post("/consultations/reschedule", patientController.rescheduleAppt);
router.put("/consultations/cancel", patientController.cancelAppt);
router.get("/account/:id", patientController.getAccountDetails);
router.post("/update/:id", patientController.updateAccountDetails);
// router.put("/addSlots", doctorController.addSlots);

module.exports = router;