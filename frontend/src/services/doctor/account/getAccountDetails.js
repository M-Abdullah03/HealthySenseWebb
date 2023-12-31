import api from "../../api";


const getAccountDetails = async (Id) => {
    try {
        const response = await api.get(`/doctor/account/${Id}`);
        const data = response.data;
        data.doctor.user.dob = data.doctor.user.dob.slice(0, 10);
        if (data.doctor.user.phoneNumber[0] === '+') {
            data.doctor.user.phoneNumber = data.doctor.user.phoneNumber.slice(3, 13);
        }
        return data.doctor;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default getAccountDetails;