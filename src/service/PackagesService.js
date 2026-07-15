// import axios from "../config";

// class PackagesService {
//   axios;
//   constructor() {
//     this.axios = axios;
//   }

//   getPackage(locationType) {
//     let url = `/package`;
//     return axios.get(url,{
//       params:{
//         locationType
//       }
//     }).then((request) => request.data);
//   }

//   // addBrand(brand) {
//   //   let url = `/brand`;
//   //   return this.axios.post(url, brand).then((request) => request.data);
//   // }

//   // updateBrand(brand) {
//   //   let url = `/brand/${brand.brandId}`;
//   //   return this.axios.put(url, brand).then((request) => request.data);
//   // }

//   // deleteBrand(brand) {
//   //   let url = `/brand/${brand.brandId}`;
//   //   return this.axios.delete(url).then((request) => request.data);
//   // }

//   // updateBrandPhoto(formData, brand) {
//   //   let url = `brand/photo/${brand.brandId}`;
//   //   return axios
//   //     .put(url, formData, {
//   //       headers: {
//   //         "Content-Type": "multipart/form-data",
//   //       },
//   //     })
//   //     .then((request) => request.data);
//   // }
// }

// const service = new PackagesService();
// export default service;
