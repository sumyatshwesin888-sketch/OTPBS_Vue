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

            <p>
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

            <p>
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
    background:#f4f6fb;
}

.destination-page{
    width:100%;
}

/* ================= HERO ================= */

.hero{
    height:500px;
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
    font-size:60px;
    font-weight:bold;
    margin-bottom:15px;
}

.hero-overlay p{
    font-size:22px;
    max-width:700px;
}

/* ================= SECTION ================= */

.destination-section{

    width:92%;
    max-width:1400px;

    margin:70px auto;

}

.section-title{

    font-size:38px;
    font-weight:bold;

    color:#1f2937;

    margin-bottom:35px;

}

/* ================= GRID ================= */

.destination-grid{

    display:grid;

    grid-template-columns:repeat(4,1fr);

    gap:30px;

}

/* ================= CARD ================= */

.destination-card{

    background:white;

    border-radius:18px;

    overflow:hidden;

    box-shadow:
    0 10px 25px rgba(0,0,0,.08);

    transition:.35s;

}

.destination-card:hover{

    transform:translateY(-10px);

    box-shadow:
    0 18px 35px rgba(0,0,0,.15);

}

/* ================= IMAGE ================= */

.card-image{

    position:relative;

}

.card-image img{

    width:100%;
    height:250px;

    object-fit:cover;

    display:block;

}

.package-badge{

    position:absolute;

    left:15px;
    bottom:15px;

    background:#2563eb;

    color:white;

    padding:7px 15px;

    border-radius:30px;

    font-size:13px;

    font-weight:bold;

}

/* ================= CONTENT ================= */

.card-content{

    padding:22px;

}

.region{

    color:#6b7280;

    font-size:13px;

    font-weight:bold;

}

.card-content h3{

    margin:12px 0;

    font-size:27px;

    color:#111827;

}

.card-content p{

    color:#6b7280;

    line-height:1.7;

    min-height:65px;

    margin-bottom:20px;

}

/* ================= FOOTER ================= */

.card-footer{

    display:flex;

    justify-content:space-between;

    align-items:center;

}

.price{

    color:#16a34a;

    font-size:20px;

    font-weight:bold;

}

.view-btn{

    background:#2563eb;

    color:white;

    border:none;

    border-radius:8px;

    padding:10px 18px;

    cursor:pointer;

    transition:.3s;

}

.view-btn:hover{

    background:#1d4ed8;

}
/* ================= IMAGE HOVER ================= */

.card-image{
    overflow:hidden;
}

.card-image img{
    transition:0.4s ease;
}

.destination-card:hover .card-image img{
    transform:scale(1.08);
}

/* ================= BUTTON ================= */

.view-btn{

    min-width:130px;
    font-size:14px;
    font-weight:600;

}

.view-btn:hover{

    transform:translateY(-2px);

}

/* ================= PRICE ================= */

.price{

    display:flex;
    flex-direction:column;
    gap:3px;

}

/* ================= CARD ANIMATION ================= */

.destination-card{

    animation:fadeUp .5s ease;

}

@keyframes fadeUp{

    from{

        opacity:0;
        transform:translateY(40px);

    }

    to{

        opacity:1;
        transform:translateY(0);

    }

}

/* ================= TABLET ================= */

@media (max-width:1200px){

    .destination-grid{

        grid-template-columns:repeat(3,1fr);

    }

}

/* ================= SMALL TABLET ================= */

@media (max-width:900px){

    .hero{

        height:400px;

    }

    .hero-overlay h1{

        font-size:42px;

    }

    .hero-overlay p{

        font-size:18px;

        width:90%;
        margin:auto;

    }

    .destination-grid{

        grid-template-columns:repeat(2,1fr);

    }

    .section-title{

        font-size:30px;

    }

}

/* ================= MOBILE ================= */

@media (max-width:600px){

    .hero{

        height:300px;

    }

    .hero-overlay h1{

        font-size:30px;

    }

    .hero-overlay p{

        font-size:15px;

    }

    .destination-grid{

        grid-template-columns:1fr;

    }

    .card-content{

        padding:18px;

    }

    .card-content h3{

        font-size:22px;

    }

    .card-footer{

        flex-direction:column;
        gap:15px;

        align-items:flex-start;

    }

    .view-btn{

        width:100%;

    }

}
</style>