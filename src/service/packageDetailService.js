import axios from "../config"

class PackageDetailService{
    axios;
    constructor(){
        this.axios = axios;
    }

    getPackageDetail(packageId) {
        let url = `/packagedetail/${packageId}`
        return axios.get(url,{
             params: {packageId
            }
        }

        ).then(request => request.data);
    }
    // addPackageDetail(pkgDetail,pkgDetail) {
    //     let url = `/packageDetail/${packageId}`;
    //     return this.axios.post(url, pkgDetail).then(request => request.data);
    // }
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