import api from "../api";


const GetReport = async (reportId) => {
    try {
        const response = await api.get(`/report/${reportId}`);
        const data = await response.data;
        if (data.message && data.message !== 'Success'){
            return null;
        }
        return data.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default GetReport;