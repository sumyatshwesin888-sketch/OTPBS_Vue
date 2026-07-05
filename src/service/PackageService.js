import axios from "../config"

class PackageService{
    axios;
    constructor(){
        this.axios = axios;
    }

    getPackages(locationType) {
        let url = `/package`
        return axios.get(url,{
            params: {
                locationType
            }
        }).then(request => request.data);
    }
    addPackage(pkg) {
        let url = `/package`;
        return this.axios.post(url, pkg).then(request => request.data);
    }
    updatePackage(pkg) {
        let url = `/package/${pkg.packageId}`;
        return this.axios.put(url, pkg).then(request => request.data);
    }
    deletePackage(pkg) {
        let url = `/package/${pkg.packageId}`;
        return this.axios.delete(url).then(request => request.data);
    }

    


   

    

}

const service = new  PackageService();
export default service;