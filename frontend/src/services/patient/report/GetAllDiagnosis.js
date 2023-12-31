import api from "../../api";


const GetAllDiagnosis = async (patientId) => {
    try {
        const response = await api.get(`/patient/diagnosis/${patientId}`);
        const data = await response.data;
        if (data.message){
            return [];
        }
        return data.Diagnosis;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default GetAllDiagnosis;