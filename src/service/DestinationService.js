import axios from "axios";

const API_URL = "http://localhost:8088/api/v1";

export default {

    getPackageCity() {
        return axios.get(API_URL + "/package/city");
    },
getPackageByCityId(cityId) {
    return axios.get(API_URL + "/package/city/" + cityId);
}
}