const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Apointments');
const fs = require('fs');
const Chat = require('../models/Message');
const Patient = require('../models/Patient');
const Diagnosis = require('../models/Diagnosis');
const path = require('path');

const doctorController = {

    registerDoctor: async (req, res) => {
        const { specialization, description, location, experience, session, services, appointmentSlots, certificates } = req.body;

        const files = req.files;

        const fileNames = [];

        for (let key in files) {
            if (key.startsWith('certificates')) {
                const file = files[key];
                const fileName = Date.now() + file.name;

                const URL = './uploads/' + fileName;

                await file.mv(URL);

                fileNames.push(fileName);
            }
        }

        try {

            certificates.forEach((certificate, index) => {
                certificate.file = fileNames[index];
            });

            await Doctor.create({ user: req.user._id, specialization, description, location, experience, session, services, appointmentSlots, certificates });

            return res.status(201).json({ id: req.user._id });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },

    getAllDoctors: async (req, res) => {
        const docList = await Doctor.find();
        return res.status(200).json({ docList });
    },


    // view all consultations of a doctor, both pending and completed
    consultations: async (req, res) => {
        const UserId = req.user._id;
        try {
            const doc = await Doctor.findOne({ user: UserId });
            console.log(doc);

            const apptList = await Appointment.find({ doctorId: doc._id })
                .populate({ path: "doctorId", populate: { path: "user" } })
                .populate({ path: "patientId", populate: { path: "user" } })
                .exec();
            return res.status(200).json(apptList);
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },

    // view details of a specific appointment 
    getConsultationById: async (req, res) => {
        const { id } = req.params;
        try {
            const apptList = await Appointment.findById({ _id: id })
                .populate({ path: 'doctorId', populate: { path: 'user' } }).
                populate({ path: 'patientId', populate: { path: 'user' } }).exec();
            return res.status(200).json({ message: "Success", appt: apptList });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },

    // update consultation
    updateConsultation: async (req, res) => {
        const { id, date, time, updateReason, status } = req.body;
        const consultation = await Appointment.findById(id);
        if (!consultation)
            return res.status(404).json({ message: "Consultation not found" });
        consultation.date = date;
        consultation.time = time;
        consultation.updateReason = updateReason;
        consultation.status = status;
        await consultation.save();
        return res.status(200).json({ consultation });
    },


    // add Appointment Slots
    addAppointmentSlots: async (req, res) => {
        const { doctorId, date, time } = req.body;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor)
            return res.status(404).json({ message: "Doctor not found" });
        const appointmentSlots = doctor.appointmentSlots;
        appointmentSlots.push({ date, time });
        await doctor.save();
        return res.status(200).json({ doctor });
    },

    getSpecialties: async (req, res) => {
        console.log("hello");
        const specialties = await Doctor.distinct("specialization");
        return res.status(200).json({ specialties });
    },

    rescheduleAppt: async (req, res) => {
        const { id, date, time, type, reason } = req.body;
        try {
            const appointment = await Appointment.findByIdAndUpdate({ _id: id }, { date: date, time: time, type: type, updateReason: reason }, { new: true })
                .populate({ path: 'doctorId', populate: { path: 'user' } }).
                populate({ path: 'patientId', populate: { path: 'user' } }).exec();
            if (!appointment)
                return res.status(404).json({ message: "Appointment not found" });
            const slots = appointment.doctorId.appointmentSlots.filter(slot => (slot.date !== appointment.date && slot.time !== appointment.time));
            slots.push({ date: appointment.date, time: appointment.time, availability: true });
            const slots2 = appointment.doctorId.appointmentSlots.filter(slot => (slot.date !== date && slot.time !== time));
            slots2.push({ date, time, availability: false });
            appointment.doctorId.appointmentSlots = slots;
            await appointment.save();
            return res.status(200).json({ message: 'Success', appointment: appointment });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },

    cancelAppt: async (req, res) => {
        const { id, reason } = req.body;
        try {
            const app = await Appointment.findByIdAndUpdate({ _id: id }, { status: "Cancelled", updateReason: reason }, { new: true })
                .populate({ path: 'doctorId', populate: { path: 'user' } }).
                populate({ path: 'patientId', populate: { path: 'user' } }).exec();
            console.log(app);
            const doc = app.doctorId;
            const slots = doc.appointmentSlots.filter(slot => (slot.date !== app.date && slot.time !== app.time));
            slots.push({ date: app.date, time: app.time, availability: true });
            doc.appointmentSlots = slots;
            doc.appointmentSlots.save();
            doc.save();
            await app.save();
            return res.status(200).json({ message: 'Success', appointment: app });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },

    completeAppt: async (req, res) => {
        try {
            const { id } = req.body;
            await Appointment.findByIdAndUpdate({ _id: id }, { status: "Completed" }, { new: true })
            return res.status(200).json({ message: 'Success' });
        }
        catch (err) {
            console.log(err.message);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },
    addSlots: async (req, res) => {
        const { slots } = req.body;
        const userId = req.user._id;
        try {
            const doc = await User.findOne({ _id: userId });
            const doctor = await Doctor.findOne({ user: doc._id });
            if (!doctor)
                return res.status(404).json({ message: "Doctor not found" });
            const newSlots = doctor.appointmentSlots.concat(slots);
            doctor.appointmentSlots = newSlots;
            await doctor.save();
            return res.status(200).json({ message: "Success" });
        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },
    getSlots: async (req, res) => {
        const userId = req.user._id;
        try {
            const doc = await User.findOne({ _id: userId });
            console.log(doc)
            const appointment_slots = await Doctor.findOne({ user: doc._id }, { appointmentSlots: 1 });
            if (!appointment_slots)
                return res.status(404).json({ message: "Doctor not found" });
            return res.status(200).json({ message: "Success", slots: appointment_slots.appointmentSlots });
        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },

    deleteSlots: async (req, res) => {
        const { date, time } = req.body;
        const userId = req.user._id;
        try {
            const doc = await User.findOne({ _id: userId })
            const doctor = await Doctor.findOne({ user: doc._id });
            if (!doctor)
                return res.status(404).json({ message: "Doctor not found" });
            const newSlots = doctor.appointmentSlots.filter(slot1 => slot1.date !== date)
            const slots3 = newSlots.filter(slot1 => slot1.time !== time)
            doctor.appointmentSlots = slots3;
            await doctor.save();
            return res.status(200).json({ message: "Success", slots: slots3 });
        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },


    //Abdullah's endpoints
    searchDoctors: async (req, res) => {
        const { query, sort, sortOrder, specialty, minRating, skip } = req.query;

        try {
            const q = User.find({ name: { $regex: query, $options: 'i' } }).where('isBanned').equals(false).where('type').equals('Doctor');
            const users = await q.exec();
            const userIds = users.map(user => user._id);
            let filter = { user: { $in: userIds } };
            if (specialty) {
                filter.specialization = specialty;
            }
            if (minRating) {
                console.log(minRating)
                filter.rating = { $gte: Number(minRating), $exists: true };
            }
            let doctors = await Doctor.find(filter).where('approvedStatus').equals(true).populate('user');
            if (doctors.length !== 0) {
                if (sort == 'A-Z') {
                    doctors = doctors.sort((a, b) => {
                        const [nameA, numberA = ''] = a.user.name.toUpperCase().split(' ');
                        const [nameB, numberB = ''] = b.user.name.toUpperCase().split(' ');

                        if (nameA < nameB) {
                            return sortOrder === 'asc' ? -1 : 1;
                        }
                        if (nameA > nameB) {
                            return sortOrder === 'asc' ? 1 : -1;
                        }

                        // If names are equal, compare the numbers
                        const numA = parseInt(numberA, 10);
                        const numB = parseInt(numberB, 10);

                        if (numA < numB) {
                            return sortOrder === 'asc' ? -1 : 1;
                        }
                        if (numA > numB) {
                            return sortOrder === 'asc' ? 1 : -1;
                        }

                        return 0;
                    });

                    doctors.map((doctor) => {
                        console.log(doctor.user.name);
                    });
                }
                else if (sort === 'Price') {

                    const getSessionFee = (sessions) => {
                        if (!sessions) {
                            return 0;
                        }

                        const clinicSession = sessions.find((session) => session.type == 'Clinic');
                        return clinicSession ? clinicSession.fee : 0;
                    }

                    doctors = doctors.sort((a, b) => {
                        return sortOrder === 'asc' ? getSessionFee(a.toObject().session) - getSessionFee(b.toObject().session) : getSessionFee(b.toObject().session) - getSessionFee(a.toObject().session);
                    });
                    console.log(doctors);


                }
                else if (sort === 'Rating') {
                    doctors = doctors.sort((a, b) => {
                        const aRating = a?.rating === undefined ? 0 : a?.rating;
                        const bRating = b?.rating === undefined ? 0 : b?.rating;
                        return sortOrder === 'asc' ? aRating - bRating : bRating - aRating;
                    });
                }
            }
            doctors = doctors.slice(skip, skip + 6);
            return res.status(200).json(doctors);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },

    addComplaint: async (req, res) => {
        const { description } = req.body;
        const patientId = req.params.id;
        const doctorId = req.userId;

        try {
            const complaint = {
                description: description,
                doctorId: doctorId,
            };
            console.log(complaint);
            const patient = await Patient.findById(patientId);
            if (!patient)
                return res.status(404).json({ message: "Patient not found" });
            patient.complaints.push(complaint);
            await patient.save();

            return res.status(200).json({ message: "Success", complaint });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: "Something went wrong" });
        }

    },

    getAppintmentDetails: async (req, res) => {
        const { id } = req.params;
        console.log(id);
        try {
            const AppointmentDetail = await Appointment.findById(id).populate(
                { path: 'doctorId', populate: { path: 'user' } }
            )
                .populate(
                    { path: 'patientId', populate: { path: 'user' } }
                ).exec();

            if (!AppointmentDetail) {
                return res.status(402).json({ message: "Appointment not found" });
            }
            console.log(AppointmentDetail);

            AppointmentDetail.doctorId.appointmentSlots = undefined;
            AppointmentDetail.doctorId.services = undefined;

            AppointmentDetail.doctorId.user.profilePicture = undefined;
            AppointmentDetail.doctorId.user.password = null;

            AppointmentDetail.patientId.user.password = undefined;
            AppointmentDetail.patientId.user.profilePicture = null;

            AppointmentDetail.doctorId.certificates = undefined;
            const diagnosis = await Diagnosis.findOne({ appointmentId: id });
            if (diagnosis != null) {
                return res.status(200).json({ AppointmentDetail: AppointmentDetail, message: "Exists" });
            }

            return res.status(200).json({ AppointmentDetail: AppointmentDetail });
        } catch (error) {
            console.log(error.message);
            return res.status(502).json({ message: "Something went wrong" });
        }

    },

    getAccountDetails: async (req, res) => {
        const { id } = req.params;
        try {
            const doctor = await Doctor.findOne({ user: id }).populate({ path: 'user' }).exec();
            if (!doctor)
                return res.status(404).json({ message: "Doctor not found" });
            return res.status(200).json({ doctor });
        }
        catch (error) {
            console.log(error.message);
            return res.status(502).json({ message: "Something went wrong" });
        }
    },

    updateAccount: async (req, res) => {
        const { id } = req.params;
        const { specialization, description, location, experience, workingHours, services, certificates, session, user, availability, phoneNumber } = req.body;
        var UpdatedCertificates = (certificates);
        try {
            const doctor = await Doctor.findOne({ user: id });
            if (!doctor)
                return res.status(404).json({ message: "Doctor not found" });
            const userdata = await User.findById(doctor.user);
            if (!user)
                return res.status(404).json({ message: "User not found" });
            if (req.files) {
                if (req.files.profile) {
                    const file = req.files.profile;
                    if (userdata.profilePicture && fs.existsSync(`./uploads/${userdata.profilePicture}`)) {
                        fs.unlinkSync(`./uploads/${userdata.profilePicture}`);
                    }
                    const fileName = userdata._id + path.extname(file.name);
                    file.mv(`./uploads/${fileName}`, async (err) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({ msg: "Error occured in uploading profile picture" });
                        }
                    });
                    userdata.profilePicture = fileName;
                }
                console.log(certificates);
                const OldCertificates = doctor.certificates;
                UpdatedCertificates.forEach(certificate => {
                    if (certificate._id) {
                        const oldCertificate = OldCertificates.find(oldCertificate => oldCertificate._id == certificate._id);
                        if (oldCertificate) {
                            if (oldCertificate.file !== certificate.file) {
                                if (fs.existsSync(`./uploads/${oldCertificate.file}`)) {
                                    fs.unlinkSync(`./uploads/${oldCertificate.file}`);
                                }
                                const file = req.files[certificate._id];
                                const fileName = (Date.now() + "_" + file.name).replace(/\s/g, '');
                                file.mv(`./uploads/${fileName}`, async (err) => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).send({ msg: "Error occured in uploading certificates" });
                                    }
                                });
                                certificate.file = fileName;
                            }
                        }
                    }
                });
                const newCertificates = UpdatedCertificates.filter(updatedCertificate => !updatedCertificate._id);
                newCertificates.forEach(certificate => {
                    const file = req.files[certificate.file];
                    const fileName = (Date.now() + "_" + file.name).replace(/\s/g, '');
                    file.mv(`./uploads/${fileName}`, async (err) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({ msg: "Error occured in uploading certificates" });
                        }
                    });
                    const index = UpdatedCertificates.findIndex(updatedCertificate => updatedCertificate.name === certificate.name);
                    UpdatedCertificates[index].file = fileName;
                });
            }
            var newuser = (user);
            userdata.name = newuser.name;
            userdata.email = newuser.email;
            userdata.phoneNumber = phoneNumber;
            userdata.gender = newuser.gender;
            userdata.country = newuser.country;
            userdata.dob = newuser.dob;
            await userdata.save();

            doctor.specialization = specialization;
            doctor.description = description;
            doctor.location = location;
            doctor.experience = experience;
            doctor.workingHours = workingHours;
            doctor.services = (services);
            doctor.certificates = UpdatedCertificates;
            doctor.session = (session);
            doctor.availability = (availability);
            await doctor.save();
            res.json({ message: "Success" });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },

    createDiagnosis: async (req, res) => {
        const { id } = req.params;
        console.log(id);
        const { diagnosis, prescription, tests, notes, type, fee } = req.body;
        console.log(req.body);
        try {
            const appointment = await Appointment.findById(id);
            if (!appointment)
                return res.status(404).json({ message: "Appointment not found" });
            const diagnosisData = await Diagnosis.create({ date: Date.now(), description: diagnosis, type: type, fee: fee, notes: notes, prescription: prescription, tests: tests, appointmentId: id });
            appointment.status = "Completed";
            await appointment.save();
            console.log(appointment);
            return res.status(200).json({ message: "Success", ID: diagnosisData._id });
        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },

    getPatientHistory: async (req, res) => {
        const { appid, id } = req.params;
        try {
            const patient = await Patient.findById(id);
            if (!patient)
                return res.status(404).json({ message: "Patient not found" });
            const appointment = await Appointment.findById(appid).
                populate({ path: 'doctorId', populate: { path: 'user' } }).
                populate({ path: 'patientId', populate: { path: 'user' } }).exec();
            return res.status(200).json({ message: "Success", History: patient.history, app: appointment });
        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },

    updateDiagnosis: async (req, res) => {
        const { id } = req.params;
        const { diagnosis, prescription, tests, notes } = req.body;
        console.log(req.body);
        try {
            const diagnosisData = await Diagnosis.findOne({ appointmentId: id });
            if (!diagnosisData)
                return res.status(404).json({ message: "Diagnosis not found" });
            diagnosisData.description = diagnosis;
            diagnosisData.prescription = prescription;
            diagnosisData.tests = tests;
            diagnosisData.notes = notes;
            await diagnosisData.save();
            console.log(diagnosisData);
            return res.status(200).json({ message: "Success" });
        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },

    getPatientDetails: async (req, res) => {
        const { id } = req.params;
        try {
            const patient = await Patient.findOne({ user: id }).populate({ path: 'user' }).exec();
            if (!patient)
                return res.status(404).json({ message: "Patient not found" });

            const appointments = await Appointment.find({ patientId: id, status: "Completed" }).populate({ path: 'doctorId', populate: { path: 'user' } }).exec();
            const completedAppointments = appointments.map(appointment => {
                return {
                    doctor: appointment.doctorId.user.name,
                    date: appointment.date,
                    id: appointment._id
                }
            });
            let temp = {
                name: patient.user.name,
                email: patient.user.email,
                dob: patient.user.dob,
                country: patient.user.country,
                gender: patient.user.gender,
                phoneNumber: patient.user.phoneNumber,
                medicalHistory: patient.history,
                previousAppointments: completedAppointments,
                complaints: patient.complaints,
                image: patient.user.profilePicture
            }

            return res.status(200).json(temp);
        }
        catch (error) {
            console.log(error.message);
            return res.status(502).json({ message: "Something went wrong" });
        }
    },
};

module.exports = doctorController;
