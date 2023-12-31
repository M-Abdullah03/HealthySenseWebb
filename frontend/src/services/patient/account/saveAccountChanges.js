import api from "../../api";


const saveAccountChanges = async (id, form_data) => {
    try {
        const response = await api.post(`/patient/update/${id}`, form_data);
        const data = response.data;
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export default saveAccountChanges;