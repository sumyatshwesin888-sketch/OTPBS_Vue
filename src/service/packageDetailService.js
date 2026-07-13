import axios from "../config"

class PackageDetailService{
    axios;
    constructor(){
        this.axios = axios;
    }

    getPackageDetail(packageId) {
        let url = `/package/detail/${packageId}`
        return axios.get(url).then(request => request.data);
    }

    getComments() {
        let url = `/comment`;
        return this.axios.get(url).then(request => request.data);
    }

   
    getRatings() {
        let url = `/rating`;
        return this.axios.get(url).then(request => request.data);
    }
    addRatingComment(ratingDto) {
        let url = `/package/ratingcomment`;
        return this.axios.post(url, ratingDto).then(request => request.data);
    }
    // updatePackage(pkgDetail,pkgDetail) {
    //     let url = `/packageDetail/${packageId}`;
    //     return this.axios.put(url, pkgDetail).then(request => request.data);
    // }
    // deletePackage(pkg) {
    //     let url = `/pkgDetail/${packageId}`;
    //     return this.axios.delete(url).then(request => request.data);
    // }
    

}

const service = new  PackageDetailService();
export default service;