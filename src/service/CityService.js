import axios from "../config"

class CityService{
    axios;
    constructor(){
        this.axios = axios;
    }

    // getCity() {
    //     let url = /city
    //     return axios.get(url).then(request => request.data);
    // }
    getCity(cityName ,search) {
    let url = "/city";
    return axios.get(url,{
      params:{
        cityName ,search
      }
    }).then((request) => request.data);
  }
     addCity(city) {
        let url = "/city";
        return axios.post(url,city).then(request => request.data);
    }
    
  updateCity(city) {
    let url = "/city/${city.cityId}";
    return this.axios.put(url, city).then((request) => request.data);
  }
    deleteCity(cityId) {
    let url = "/city/${cityId}";
    return this.axios.delete(url).then((request) => request.data);
  }
    addHotel(hotel) {
        let url = "/hotel";
        return axios.post(url,hotel).then(request => request.data);
    }
    getHotel(hotelName, cityName,search) {
    let url = "/hotel";
    return axios.get(url,{
      params:{
        hotelName, cityName,search
      }
    }).then((request) => request.data);
  }
    updateHotel(hotel) {
    let url = "/hotel/${hotel.hotelId}";
    return this.axios.put(url, hotel).then((request) => request.data);
  }
    deleteHotel(hotelId) {
    let url = "/hotel/${hotelId}";
    return this.axios.delete(url).then((request) => request.data);
  }
}

const service = new  CityService();
export default service;