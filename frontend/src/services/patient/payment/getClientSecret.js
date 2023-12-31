import api from "../../api";


const GetClientSecret = async (id) => {
    try {
        const response = await api.get(`/payment/create-payment-intent/${id}`);
        const data = response.data;
        console.log(data);
        return data;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

export default GetClientSecret;