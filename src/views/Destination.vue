<template>
  <div class="destination-page">

    <!-- Hero -->
    <section class="hero">
      <div class="hero-overlay">
        <h1>Explore Your Dream Destinations</h1>
        <p>
          Discover amazing places around Myanmar and around the world.
        </p>
      </div>
    </section>

    <!-- Domestic -->
    <section class="destination-section">

      <h2 class="section-title">
        🇲🇲 Domestic Destinations
      </h2>

      <div class="destination-grid">

        <div
          class="destination-card"
          v-for="city in domestic"
          :key="city.cityId"
        >

          <div class="card-image">

            <img
              :src="city.photo"
              :alt="city.cityName"
            >
          </div>

          <div class="card-content">

            <small class="region">
              {{ city.region }}
            </small>

            <h3>
              {{ city.cityName }}
            </h3>

            <p class="detail">
              {{ city.detail }}
            </p>

            <div class="card-footer">

              <span class="price">

                From
                {{ city.productDto.amount.toLocaleString() }}
                MMK

              </span>

              <button
                class="view-btn"
                @click="viewDetail(city.cityId)"
              >
                View Details
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>

    <!-- International -->

    <section class="destination-section">

      <h2 class="section-title">
        🌍 International Destinations
      </h2>

      <div class="destination-grid">

        <div
          class="destination-card"
          v-for="city in international"
          :key="city.cityId"
        >

          <div class="card-image">

            <img
              :src="city.photo"
              :alt="city.cityName"
            >
          </div>

          <div class="card-content">

            <small class="region">
              {{ city.region }}
            </small>

            <h3>
              {{ city.cityName }}
            </h3>

            <p class="detail">
              {{ city.detail }}
            </p>

            <div class="card-footer">

              <span class="price">

                From
                {{ city.productDto.amount.toLocaleString() }}
                MMK

              </span>

              <button
                class="view-btn"
                @click="viewDetail(city.cityId)"
              >
                View Details
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

  data() {

    return {

      domestic: [],
      international: []

    }

  },

  mounted() {

    this.loadCity();

  },

  methods: {

    loadCity() {

      DestinationService.getPackageCity().then(res => {

        this.domestic = res.data.domestic;
        console.log(this.domestic);
        this.international = res.data.international;
console.log(this.international);
      });

    },

   viewDetail(cityId) {

    console.log("City ID =", cityId);

    this.$router.push("/destination/" + cityId);

}

  }
}
</script>
<style scoped>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial, Helvetica, sans-serif;
}

body{
    background:#f8fafc;
}

.destination-page{
    width:100%;
}

/* ================= HERO ================= */

.hero{
    height:400px;
    background:
        linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)),
        url("/DomesticHome.png");
    background-size:cover;
    background-position:center;
    display:flex;
    justify-content:center;
    align-items:center;
}

.hero-overlay{
    text-align:center;
    color:#fff;
}

.hero-overlay h1{
    font-size:56px;
    font-weight:800;
    margin-bottom:15px;
}

.hero-overlay p{
    font-size:20px;
    max-width:700px;
    margin:auto;
}

/* ================= SECTION ================= */

.destination-section{
    width:92%;
    max-width:1200px;
    margin:60px auto;
}

.section-title{
    font-size:28px;
    font-weight:800;
    color:#0f172a;
    margin-bottom:25px;
}

/* ================= GRID ================= */

.destination-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:25px;
}

/* ================= CARD ================= */

.destination-card{
    background:#fff;
    border-radius:12px;
    overflow:hidden;
    border:1px solid #e2e8f0;
    box-shadow:0 2px 12px rgba(0,0,0,.05);
    display:flex;
    flex-direction:column;
    transition:.3s;
}

.destination-card:hover{
    transform:translateY(-6px);
    box-shadow:0 12px 25px rgba(0,0,0,.12);
}

/* ================= IMAGE ================= */

.card-image{
    height:190px;
    overflow:hidden;
}

.card-image img{
    width:100%;
    height:100%;
    object-fit:cover;
    transition:.4s;
}

.destination-card:hover .card-image img{
    transform:scale(1.06);
}

/* ================= CONTENT ================= */

.card-content{
    padding:16px;
    display:flex;
    flex-direction:column;
    flex:1;
}

.region{
    font-size:13px;
    color:#64748b;
    font-weight:600;
}

.card-content h3{
    font-size:16px;
    font-weight:700;
    color:#0f172a;
    margin:8px 0;
}

/* ================= DETAIL ================= */

.detail{
    color:#64748b;
    font-size:14px;
    line-height:1.7;

    display:-webkit-box;
    display:box;

    -webkit-box-orient:vertical;
    box-orient:vertical;

    -webkit-line-clamp:2;

    overflow:hidden;
    text-overflow:ellipsis;

    height:48px;
    margin-bottom:18px;
}

/* ================= FOOTER ================= */

.card-footer{
    margin-top:auto;
    padding-top:14px;
    border-top:1px solid #f1f5f9;

    display:flex;
    justify-content:space-between;
    align-items:center;
}

/* ================= PRICE ================= */

.price{
    color:#10b981;
    font-size:13px;
    font-weight:800;
}

/* ================= BUTTON ================= */

.view-btn{
    background:#2563eb;
    color:#fff;
    border:none;
    border-radius:6px;

    padding:8px 14px;

    font-size:12px;
    font-weight:700;

    cursor:pointer;
    transition:.3s;
}

.view-btn:hover{
    background:#1d4ed8;
}

/* ================= TABLET ================= */

@media(max-width:992px){

.destination-grid{
    grid-template-columns:repeat(2,1fr);
}

.hero-overlay h1{
    font-size:42px;
}

.hero-overlay p{
    font-size:18px;
}

}

/* ================= MOBILE ================= */

@media(max-width:768px){

.destination-grid{
    grid-template-columns:1fr;
}

.hero{
    height:300px;
}

.hero-overlay h1{
    font-size:30px;
}

.hero-overlay p{
    font-size:15px;
}

.card-footer{
    flex-direction:column;
    gap:12px;
    align-items:flex-start;
}

.view-btn{
    width:100%;
}

}
</style>