import axios from "../config"

class CityService{
    axios;
    constructor(){
        this.axios = axios;
    }

    getCity() {
        let url = `/city`
        return axios.get(url).then(request => request.data);
    }
    addHotel(hotel) {
        let url = `/hotel`
        return axios.post(url,hotel).then(request => request.data);
    }
    getHotel() {
        let url = `/hotel`
        return axios.get(url).then(request => request.data);
    }
}

const service = new  CityService();
export default service;