import axios from "../config" 

class SaleService{
    axios;
    constructor(){
        this.axios = axios;
    }

    getPackages(status) {
        let url =" /sale"
        return axios.get(url,{
            params: {
                status
            }
        }).then(request => request.data);
    }
    addSale(sale) {
        let url =" /sale"
        return this.axios.post(url, sale).then(request => request.data);
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

const service = new  SaleService();
export default service;