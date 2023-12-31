import api from "../../api";


const saveAccountChanges = async (ID, form_data) => {
    try {
        const response = await api.put(`/doctor/account/${ID}`, form_data);
        const data = response.data;
        console.log(data);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export default saveAccountChanges;