import axios from "../config";

class UserAccountService {
  axios;
  constructor() {
    this.axios = axios;
  }

  getLogin(email,password) {
    let url = `/userAccount/login`;
    return axios.get(url,{
      params:{
        email,password
      }
    }).then((request) => request.data);
  }

   addUserAccount(userAccount) {
    let url = `/userAccount`;
    return this.axios.post(url, userAccount).then((request) => request.data);
  }

  updateUserAccount(userAccount) {
    let url = `/userAccount/${userAccount.userAccountId}`;
    return this.axios.put(url, userAccount).then((request) => request.data);
  }

  updatePassword(password) {
    let url = `/userAccount/updatePassword`;
    return this.axios.put(url, password).then((request) => request.data);
  }
  // addMessage(message) {
  //   let url = `/message`;
  //   return this.axios.post(url, message).then((request) => request.data);
  // }

  

  // deleteBrand(brand) {
  //   let url = `/brand/${brand.brandId}`;
  //   return this.axios.delete(url).then((request) => request.data);
  // }

  // updateBrandPhoto(formData, brand) {
  //   let url = `brand/photo/${brand.brandId}`;
  //   return axios
  //     .put(url, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //     .then((request) => request.data);
  // }
}

const service = new UserAccountService();
export default service;
