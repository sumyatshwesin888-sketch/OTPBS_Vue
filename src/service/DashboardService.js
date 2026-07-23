import axios from "../config" //saleService.js

class DashboardService{
    axios;
    constructor(){
        this.axios = axios;
    }
    getPackageDashboard() {
        let url = "/dashboard";
        return this.axios.get(url).then(request => request.data);
    }

    getSale(status) {
        let url = "/sale";
        return this.axios.get(url, {
            params: { status }
        }).then(request => request.data);
    }

    
    // updatePackage(pkg) {
    //     let url = /package/${pkg.packageId};
    //     return this.axios.put(url, pkg).then(request => request.data);
    // }
    // deletePackage(pkg) {
    //     let url = /package/${pkg.packageId};
    //     return this.axios.delete(url).then(request => request.data);
    // }


}

const service = new  DashboardService();
export default service;