import axios from "../config" 

class SaleService{
    axios;
    constructor(){
        this.axios = axios;
    }

    getSale(status) {
        let url = `/sale`;
        return axios.get(url, {
            params: {
                status
            }
        }).then(request => request.data);
    }
    addSale(saleDto) {
         let url = `/sale`;
        return this.axios.post(url, saleDto).then(request => request.data);
    }
    updateSale(saleId, saleDto) {
        let url = `/sale/${saleId}`;
        return this.axios.put(url, saleDto).then(request => request.data);
    }

    deleteSale(saleId) {
        let url = `/sale/${saleId}`;
        return this.axios.delete(url).then(request => request.data);
    }

}

const service = new  SaleService();
export default service;