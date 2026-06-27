<template>
  <div class="destination-page">

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay">
        <h1>Explore Your Dream Destinations</h1>
        <p>
          Discover amazing places around Myanmar and around the world.
        </p>
      </div>
    </section>

    <!-- Domestic Section -->
    <section class="destination-section">

      <h2 class="section-title">
        Popular Domestic Destinations
      </h2>

      <div class="destination-grid">

        <router-link
          v-for="dest in domesticDestinations"
          :key="dest.name"
          :to="`/destination/${dest.name}`"
          class="destination-card"
        >

          <div class="card-image">

            <img
              :src="dest.image"
              :alt="dest.name"
            >

            <span class="package-badge">
              {{ dest.packages }} Packages
            </span>

          </div>

          <div class="card-content">

            <span class="region">
              {{ dest.region }}
            </span>

            <h3>
              {{ dest.name }}
            </h3>

            <p>
              {{ dest.description }}
            </p>

            <div class="tags">

              <span
                v-for="tag in dest.tags"
                :key="tag"
              >
                {{ tag }}
              </span>

            </div>

            <div class="card-footer">

              <span class="price">
                From {{ dest.price }}
              </span>

              <span class="view-link">
                View Details →
              </span>

            </div>

          </div>

        </router-link>

      </div>

    </section>

    <!-- International Section -->
    <section class="destination-section">

      <h2 class="section-title">
        Popular International Destinations
      </h2>

      <div class="destination-grid">

        <router-link
          v-for="dest in internationalDestinations"
          :key="dest.name"
          :to="`/destination/${dest.name}`"
          class="destination-card"
        >

          <div class="card-image">

            <img
              :src="dest.image"
              :alt="dest.name"
            >

            <span class="package-badge">
              {{ dest.packages }} Packages
            </span>

          </div>

          <div class="card-content">

            <span class="region">
              {{ dest.region }}
            </span>

            <h3>
              {{ dest.name }}
            </h3>

            <p>
              {{ dest.description }}
            </p>

            <div class="tags">

              <span
                v-for="tag in dest.tags"
                :key="tag"
              >
                {{ tag }}
              </span>

            </div>

            <div class="card-footer">

              <span class="price">
                From {{ dest.price }}
              </span>

              <span class="view-link">
                View Details →
              </span>

            </div>

          </div>

        </router-link>

      </div>

    </section>

  </div>
</template>
<script setup>

const domesticDestinations = [

  {
    name: 'Bagan',
    region: 'MANDALAY REGION',
    image: '/bagan.jpg',
    packages: 3,
    price: '650,000 MMK',

    description:
      'Ancient temples and breathtaking sunrise views.',

    tags: [
      'Ananda Temple',
      'Balloon',
      'Sunset'
    ]
  },

  {
    name: 'Kalaw',
    region: 'SHAN STATE',
    image: '/kalaw.jpg',
    packages: 3,
    price: '420,000 MMK',

    description:
      'Cool weather and beautiful trekking routes.',

    tags: [
      'Pine Forest',
      'View Point',
      'Inle Lake'
    ]
  },

  {
    name: 'Hpa-An',
    region: 'KAYIN STATE',
    image: '/hpaan.jpg',
    packages: 3,
    price: '195,000 MMK',

    description:
      'Mountains, caves and natural beauty.',

    tags: [
      'Saddan Cave',
      'Zwegabin',
      'Kyauk Ka Lat'
    ]
  },

  {
    name: 'Ngwe Saung',
    region: 'AYEYARWADY REGION',
    image: '/ngwesaung.jpg',
    packages: 3,
    price: '750,000 MMK',

    description:
      'Beautiful beach and seafood paradise.',

    tags: [
      'Beach',
      'Island',
      'Seafood'
    ]
  }

]

const internationalDestinations = [

  {
    name: 'Thailand',
    region: 'BANGKOK',
    image: '/thailand.jpg',
    packages: 3,
    price: '1,650,000 MMK',

    description:
      'Shopping, culture and vibrant city life.',

    tags: [
      'Grand Palace',
      'Wat Arun',
      'Cruise'
    ]
  },

  {
    name: 'Japan',
    region: 'TOKYO',
    image: '/japan.jpg',
    packages: 3,
    price: '3,250,000 MMK',

    description:
      'Technology and traditional culture.',

    tags: [
      'Fuji',
      'Tokyo',
      'Shibuya'
    ]
  },

  {
    name: 'China',
    region: 'SHANGHAI',
    image: '/china.jpg',
    packages: 3,
    price: '1,950,000 MMK',

    description:
      'Historic landmarks and modern skyline.',

    tags: [
      'The Bund',
      'Yu Garden',
      'Shanghai'
    ]
  },

  {
    name: 'Singapore',
    region: 'SINGAPORE CITY',
    image: '/signapore.jpg',
    packages: 3,
    price: '2,850,000 MMK',

    description:
      'Luxury lifestyle and iconic attractions.',

    tags: [
      'Marina Bay',
      'Sentosa',
      'Merlion'
    ]
  }

]

</script>
<style setup>
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:Arial, Helvetica, sans-serif;
}

.destination-page{
  min-height:100vh;
  background:#f5f7fa;
}

/* Hero */

.hero{
  height:500px;

  background:
  linear-gradient(
    rgba(0,0,0,.45),
    rgba(0,0,0,.45)
  ),
  url('/DomesticHome.png');

  background-size:cover;
  background-position:center;

  display:flex;
  justify-content:center;
  align-items:center;
}

.hero-overlay{
  text-align:center;
  color:white;
}

.hero-overlay h1{
  font-size:56px;
  margin-bottom:15px;
}

.hero-overlay p{
  font-size:20px;
}

/* Section */

.destination-section{
  width:95%;
  max-width:1400px;
  margin:70px auto;
}

.section-title{
  font-size:38px;
  font-weight:700;
  color:#111827;
  margin-bottom:30px;
}

/* Grid */

.destination-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:25px;
}

/* Card */

.destination-card{
  background:white;
  border-radius:20px;
  overflow:hidden;

  text-decoration:none;
  color:#111827;

  box-shadow:
  0 5px 20px rgba(0,0,0,.08);

  transition:.3s;
}

.destination-card:hover{
  transform:translateY(-8px);
}

/* Image */

.card-image{
  position:relative;
}

.card-image img{
  width:100%;
  aspect-ratio:5/4;
  object-fit:cover;
}

.package-badge{
  position:absolute;

  left:12px;
  bottom:12px;

  background:rgba(0,0,0,.7);
  color:white;

  padding:6px 12px;

  border-radius:20px;

  font-size:12px;
}

/* Content */

.card-content{
  padding:18px;
}

.region{
  font-size:12px;
  font-weight:bold;
  color:#6b7280;
}

.card-content h3{
  margin:10px 0;
  font-size:24px;
}

.card-content p{
  color:#6b7280;
  line-height:1.7;
  margin-bottom:15px;
}

/* Tags */

.tags{
  display:flex;
  flex-wrap:wrap;
  gap:8px;

  margin-bottom:20px;
}

.tags span{
  background:#eff6ff;
  color:#2563eb;

  padding:6px 10px;

  border-radius:20px;

  font-size:12px;
}

/* Footer */

.card-footer{
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.price{
  color:#16a34a;
  font-weight:bold;
}

.view-link{
  color:#2563eb;
  font-weight:600;
}

/* Responsive */

@media(max-width:1200px){

  .destination-grid{
    grid-template-columns:repeat(3,1fr);
  }

}

@media(max-width:900px){

  .destination-grid{
    grid-template-columns:repeat(2,1fr);
  }

  .hero-overlay h1{
    font-size:42px;
  }

}

@media(max-width:600px){

  .destination-grid{
    grid-template-columns:1fr;
  }

  .hero-overlay h1{
    font-size:32px;
  }

  .section-title{
    font-size:28px;
  }

}
</style>