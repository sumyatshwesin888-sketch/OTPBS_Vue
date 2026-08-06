<template>
  <div class="destination-page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-overlay">
        <h1>Explore Your Dream Destinations</h1>
        <p>Discover amazing places around Myanmar and around the world.</p>
      </div>
    </section>

    <!-- Domestic -->
    <section class="destination-section">
      <h2 class="section-title">🇲🇲 Domestic Destinations</h2>

      <div class="destination-grid">
        <div class="destination-card" v-for="city in domestic" :key="city.cityId">
          <div class="card-image">
            <img :src="getImageUrl(city.photo)" :alt="city.cityName" />
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

              <button class="view-btn" @click="viewDetail(city.cityId)">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- International -->

    <section class="destination-section">
      <h2 class="section-title">🌍 International Destinations</h2>

      <div class="destination-grid">
        <div class="destination-card" v-for="city in international" :key="city.cityId">
          <div class="card-image">
            <img :src="getImageUrl(city.photo)" :alt="city.cityName" />
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

              <button class="view-btn" @click="viewDetail(city.cityId)">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import DestinationService from '@/service/DestinationService'

export default {
  data() {
    return {
      domestic: [],
      international: [],
    }
  },

  mounted() {
    this.loadCity()
  },

  methods: {
    getImageUrl(photoName) {
    if (!photoName) return '';
    if (photoName.startsWith('http://') || photoName.startsWith('https://')) {
      return photoName;
    }
    // Admin ဖက်ကသုံးထားတဲ့ URL အတိုင်း ဖြည့်စွက်ပေးခြင်း
    return `http://localhost:8088/api/v1/productphoto/${photoName}`;
  },

  loadCity() {
    DestinationService.getPackageCity().then(res => {
      this.domestic = res.data.domestic;
      this.international = res.data.international;
    });
  },

  viewDetail(cityId) {
    this.$router.push("/destination/" + cityId);
  },
    // loadCity() {
    //   DestinationService.getPackageCity().then((res) => {
    //     this.domestic = res.data.domestic
    //     console.log(this.domestic)
    //     this.international = res.data.international
    //     console.log(this.international)
    //   })
    // },

    // viewDetail(cityId) {
    //   console.log('City ID =', cityId)

    //   this.$router.push('/destination/' + cityId)
    // },
  },
}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}

body{
    background:#f4f6fb;
}

.destination-page {
  width: 100%;
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

.hero-overlay {
  text-align: center;
  color: #fff;
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

    font-size:30px;
    font-weight:bold;

    color:#1f2937;

    margin-bottom:35px;

}

/* ================= GRID ================= */

.destination-grid{

    display:grid;

    grid-template-columns:repeat(3,1fr);

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

    height:100%;

}

.destination-card:hover{

    transform:translateY(-5px);

    box-shadow:0 8px 20px rgba(0,0,0,.12);

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

    transform:scale(1.05);

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

    padding:16px;

    display:flex;

    flex-direction:column;

    flex:1;

}

.region{

    color:#64748b;

    font-size:13px;

    font-weight:600;

}
.card-content h3{

    font-size:16px;

    font-weight:700;

    color:#0f172a;

    margin:8px 0;

}

.card-content p{

    color:#6b7280;

    line-height:1.7;

    min-height:65px;

    margin-bottom:20px;

}
.detail {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 1.6;
    min-height: 3.2em;
}

/* ================= FOOTER ================= */

.card-footer{

    margin-top:auto;

    display:flex;

    justify-content:space-between;

    align-items:center;

    border-top:1px solid #f1f5f9;

    padding-top:12px;

}
.price{

    font-size:15px;

    font-weight:800;

    color:#10b981;

}
.view-btn{

    background:#2563eb;

    color:white;

    border:none;

    border-radius:6px;

  padding: 8px 14px;

    font-size:12px;

    font-weight:700;

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
