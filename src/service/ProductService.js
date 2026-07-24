import axios from "axios";

const API = "http://localhost:8088/api/v1";

export default {

    getProduct() {

        return axios
            .get(API + "/product", {

                params: {

                    type: "ALL",
                    locationType: "ALL",
                    search: ""

                }

            })

            .then(res => res.data);

    }

}