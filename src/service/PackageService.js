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

    getPackageDetailById(productId) {
    
        let url = `/package/detail/${productId}`
    
        return axios.get(url)
            .then(request => request.data);
    
    }
        getProductById(productId) {
    
        let url = `/product/${productId}`
    
        return axios.get(url)
            .then(request => request.data);
    
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
//Booking
    getProductById(productId) {

    let url = `/product/${productId}`

    return axios.get(url)
        .then(request => request.data);

}


    //For Admin Product

    getProduct(locationType ,type, search) {
        let url = `/product`
        return axios.get(url,{
            params: {
                locationType ,type, search
            }
        }).then(request => request.data);
    }

    addProduct(pkg) {
        let url = `/product`;
        return this.axios.post(url, pkg).then(request => request.data);
    }

    updateProduct(pkg) {
        let url = `/product/${pkg.productId}`;
        return this.axios.put(url, pkg).then(request => request.data);
    }

    deleteProduct(productId) {
        let url = `/product/${productId}`;
        return this.axios.delete(url).then(request => request.data);
    }
  updateProductPhoto(formData, productId,photoIndex) {
    let url = `product/photo/${productId}/${photoIndex}`;
    return axios
      .put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((request) => request.data);
  }

}

const service = new  PackageService();
export default service;