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

  
// Admin UI
getUserAccount(userType ,search) {
    let url = `/userAccount`;
    return axios.get(url,{
      params:{
        userType ,search
      }
    }).then((request) => request.data);
  }
  addUserAccount(user) {
    let url = `/userAccount`;
    return this.axios.post(url, user).then((request) => request.data);
  }

  updateUserAccount(userAccount) {
    let url = `/userAccount/${userAccount.userAccountId}`;
    return this.axios.put(url, userAccount).then((request) => request.data);
  }

  deleteUserAccount(userAccountId) {
    let url = `/userAccount/${userAccountId}`;
    return this.axios.delete(url).then((request) => request.data);
  }

  

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
