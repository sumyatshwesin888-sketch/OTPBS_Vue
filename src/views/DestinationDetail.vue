<template>

<div
v-if="city && city.productList && city.productList.length"
class="destination-detail"
>


    <section
class="hero"
:style="{
backgroundImage:
`linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)),url(http://localhost:8088/api/v1/productphoto/${city.productList[0]?.photo})`
}"
>
        <div class="hero-content">

            <h1>
                {{ city.cityName }}
            </h1>

            <p>
                {{ city.region }}
            </p>

            <a
            :href="city.website"
            target="_blank"
            class="website-btn"
            >

                Visit Official Website

            </a>

        </div>

    </section>



    <section class="about-section">

        <div class="container">

            <h2>

                About {{ city.cityName }}

            </h2>

            <p>

                {{ city.detail }}

            </p>

        </div>

    </section>




    <section class="package-section">

        <div class="container">

            <h2>

                Available Packages

            </h2>

            <div class="package-grid">

                <div

                class="package-card"

                v-for="product in city.productList"

                :key="product.productId"

                >

                  <img
                :src="'http://localhost:8088/api/v1/productphoto/' + product.photo"
                class="thumb-img"
                alt="thumbnail"
              />

                    <div class="package-body">

                        <div class="package-type">

                            {{ product.type }}

                        </div>

                        <h3>

                            {{ product.title }}

                        </h3>

                        <div class="package-price">

                            {{ product.amount.toLocaleString() }}

                            MMK

                        </div>

                        <div class="package-info">

                            <span>

                                {{ product.day }} Days

                            </span>

                            <span>

                                {{ product.night }} Nights

                            </span>

                        </div>

                        <button

                        class="detail-btn"

                        @click="viewPackage(product.productId)"

                        >

                            View Package Detail

                        </button>

                    </div>

                </div>

            </div>

        </div>

    </section>

</div>

</template>
<script>
import DestinationService from "@/service/DestinationService";

export default {

    name: "DestinationDetail",

    data() {

        return {

            city: null,

            loading: false,

            error: false

        };

    },

    mounted() {

        this.loadCity();

    },

    methods: {

        loadCity() {

            this.loading = true;

            const cityId = this.$route.params.id;

            DestinationService.getPackageByCityId(cityId)

            .then(res => {

                console.log(res.data);

                if(res.data && res.data.length > 0){

                    this.city = res.data[0];

                }else{

                    this.error = true;

                }

            })

            .catch(err => {

                console.log(err);

                this.error = true;

            })

            .finally(() => {

                this.loading = false;

            });

        },

        viewPackage(productId){

            this.$router.push("/packagedetail/" + productId);

        }

    }

}
</script>
<style scoped>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

.destination-detail{

    background:#f8fafc;
    min-height:100vh;

}

.container{

    width:90%;
    max-width:1300px;
    margin:auto;

}

/* ===========================
Hero
=========================== */

.hero{

    height:400px;

    background-size:cover;
    background-position:center;
    background-repeat:no-repeat;

    display:flex;
    justify-content:center;
    align-items:center;

}

.hero-content{

    text-align:center;
    color:white;

}

.hero-content h1{

    font-size:50px;
    font-weight:700;
    margin-bottom:15px;

}

.hero-content p{

    font-size:20px;
    margin-bottom:30px;

}

.website-btn{

    display:inline-block;

    background:#2563eb;
    color:white;

    text-decoration:none;

    padding:15px 35px;

    border-radius:30px;

    font-size:17px;

    transition:.3s;

}

.website-btn:hover{

    background:#1d4ed8;

}


/* ===========================
About
=========================== */

.about-section{

    padding:70px 0;

}

.about-section h2{

    font-size:40px;
    color:#111827;

    margin-bottom:30px;

}

.about-section p{

    font-size:18px;

    line-height:1.9;

    color:#4b5563;

}


/* ===========================
Package
=========================== */


.package-section{
    padding-bottom:80px;
}

.package-section h2{
    font-size:30px;
    font-weight:800;
    color:#0f172a;
    margin-bottom:25px;
}

.package-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:25px;
}

/* ===========================
Card
=========================== */

.package-card{
    background:#fff;
    border-radius:12px;
    border:1px solid #e2e8f0;
    overflow:hidden;
    box-shadow:0 2px 12px rgba(0,0,0,.05);

    display:flex;
    flex-direction:column;

    transition:.3s;
}

.package-card:hover{
    transform:translateY(-6px);
    box-shadow:0 12px 24px rgba(0,0,0,.12);
}

/* ===========================
Image
=========================== */

.package-image{
    width:100%;
    height:190px;
    object-fit:cover;
    transition:.35s;
}

.package-card:hover .package-image{
    transform:scale(1.05);
}

/* ===========================
Body
=========================== */

.package-body{
    padding:16px;
    display:flex;
    flex-direction:column;
    flex:1;
}

.package-type{
    display:inline-block;
    background:#2563eb;
    color:#fff;

    padding:4px 10px;
    border-radius:6px;

    font-size:11px;
    font-weight:700;

    margin-bottom:10px;
}

.package-body h3{
    font-size:16px;
    font-weight:700;
    color:#0f172a;
    margin-bottom:8px;
}

.package-price{
    color:#10b981;
    font-size:15px;
    font-weight:800;
    margin:10px 0;
}

.package-info{
    display:flex;
    gap:15px;
    font-size:12px;
    color:#64748b;
    margin-bottom:16px;
}

/* ===========================
Footer
=========================== */

.detail-btn{
    margin-top:auto;

    width:100%;
    border:none;

    background:#2563eb;
    color:#fff;

    padding:10px;

    border-radius:6px;

    font-size:12px;
    font-weight:700;

    cursor:pointer;

    transition:.3s;
}

.detail-btn:hover{
    background:#1d4ed8;
}

/* ===========================
Responsive
=========================== */

@media(max-width:992px){

.package-grid{
    grid-template-columns:repeat(2,1fr);
}

.hero{
    height:350px;
}

.hero-content h1{
    font-size:42px;
}

}

@media(max-width:768px){

.package-grid{
    grid-template-columns:1fr;
}

.hero{
    height:280px;
}

.hero-content h1{
    font-size:30px;
}

.hero-content p{
    font-size:16px;
}

}
</style>