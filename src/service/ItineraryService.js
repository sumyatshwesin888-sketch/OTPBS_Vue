import axios from "axios";

const API = "http://localhost:8088/api/v1";

export default {

    getItinerary() {
        return axios.get(API + "/itinerary")
            .then(res => res.data);
    },

    addItinerary(dto) {
        return axios.post(API + "/itinerary", dto)
            .then(res => res.data);
    },

    updateItinerary(id, dto) {
        return axios.put(API + "/itinerary/" + id, dto)
            .then(res => res.data);
    },

    deleteItinerary(id) {
        return axios.delete(API + "/itinerary/" + id)
            .then(res => res.data);
    }

}