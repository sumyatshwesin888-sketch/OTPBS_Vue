<template>

<div
v-if="city && city.productList && city.productList.length"
class="destination-detail"
>

    <!-- ========================= -->
    <!-- Hero Section -->
    <!-- ========================= -->

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



    <!-- ========================= -->
    <!-- About -->
    <!-- ========================= -->

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




    <!-- ========================= -->
    <!-- Available Packages -->
    <!-- ========================= -->

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

    height:460px;

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

    font-size:60px;
    font-weight:700;
    margin-bottom:15px;

}

.hero-content p{

    font-size:22px;
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

    font-size:42px;
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

    font-size:42px;

    color:#111827;

    margin-bottom:35px;

}

.package-grid{

    display:grid;

    grid-template-columns:
    repeat(auto-fit,minmax(330px,1fr));

    gap:30px;

}

.package-card{

    background:white;

    border-radius:20px;

    overflow:hidden;

    box-shadow:
    0 10px 30px rgba(0,0,0,.08);

    transition:.35s;

}

.package-card:hover{

    transform:translateY(-8px);

}

.package-image{

    width:100%;

    height:240px;

    object-fit:cover;

}

.package-body{

    padding:22px;

}

.package-type{

    display:inline-block;

    background:#2563eb;

    color:white;

    padding:8px 18px;

    border-radius:30px;

    font-size:13px;

    margin-bottom:18px;

}

.package-body h3{

    font-size:25px;

    color:#111827;

    margin-bottom:18px;

}

.package-price{

    color:#16a34a;

    font-size:30px;

    font-weight:bold;

    margin-bottom:15px;

}

.package-info{

    display:flex;

    gap:25px;

    color:#6b7280;

    margin-bottom:25px;

}

.detail-btn{

    width:100%;

    border:none;

    background:#2563eb;

    color:white;

    padding:15px;

    border-radius:10px;

    cursor:pointer;

    font-size:16px;

    transition:.3s;

}

.detail-btn:hover{

    background:#1d4ed8;

}


/* ===========================
Responsive
=========================== */

@media(max-width:992px){

.hero{

    height:380px;

}

.hero-content h1{

    font-size:46px;

}

.about-section h2,
.package-section h2{

    font-size:34px;

}

}

@media(max-width:768px){

.hero{

    height:320px;

}

.hero-content h1{

    font-size:34px;

}

.hero-content p{

    font-size:18px;

}

.package-grid{

    grid-template-columns:1fr;

}

}

</style>