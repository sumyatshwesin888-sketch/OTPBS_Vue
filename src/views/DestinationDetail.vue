<template>

<div class="detail-page">
  

  <!-- Hero Banner -->

  <section
    class="hero"
    :style="{ backgroundImage: `url(${destination.image})` }"
    @click="openWebsite"
  >

    <div class="hero-overlay">

      <h1>{{ destination.name }}</h1>

      <p>{{ destination.location }}</p>

      <button class="visit-btn">
        Visit Official Website
      </button>

    </div>

  </section>

  <!-- About -->

  <section class="content-section">

    <div class="about-grid">

      <div>
        <button class="back-btn" @click="$router.back()">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back 
      </button>

        <h2>
          About {{ destination.name }}
        </h2>

        <p class="overview">
          {{ destination.overview }}
        </p>

      </div>
    </div>

  </section>

  

  <!-- Packages -->

  <section class="content-section">

    <h2 class="section-title">
      Available Packages
    </h2>

    <div class="package-grid">

      <div
        class="package-card"
        v-for="pkg in destination.packages"
        :key="pkg.title"
      >

        <img
          :src="pkg.image"
          :alt="pkg.title"
          class="package-image"
        >

        <div class="package-content">

          <span class="package-type">
            {{ pkg.type }}
          </span>

          <h3>
            {{ pkg.title }}
          </h3>

          <p class="package-price">
            {{ pkg.price }}
          </p>

          <p>
            {{ pkg.duration }}
          </p>
<br>
          <router-link 
  :to="{ name: 'packagedetail', params: { id: pkg.id } }" 
  class="package-btn"
>
  View Package Details
</router-link>

        </div>

      </div>

    </div>

  </section>

</div>

</template>
<script setup>
import { computed } from 'vue'

import { useRoute } from 'vue-router'


const route = useRoute()

const destinations = {

  Bagan: {
    

    name: 'Bagan',

    location: 'Mandalay Region, Myanmar',

    image: '/bagan.jpg',

    website: 'https://en.wikipedia.org/wiki/Bagan',

    overview: `
Bagan is one of Myanmar's most iconic cultural destinations and a UNESCO World Heritage Site famous for its thousands of ancient temples, pagodas and monasteries. Located on the banks of the Ayeyarwady River, Bagan offers breathtaking sunrise and sunset views that attract travelers from around the world.

ပုဂံသည် မြန်မာနိုင်ငံ၏ အထင်ကရ ယဉ်ကျေးမှုခရီးသွားဒေသတစ်ခုဖြစ်ပြီး UNESCO World Heritage Site အဖြစ် သတ်မှတ်ခံထားရသော သမိုင်းဝင်မြို့တော်တစ်ခု ဖြစ်ပါသည်။ ဧရာဝတီမြစ်ကမ်းနားတွင် တည်ရှိပြီး ရှေးဟောင်းဘုရားပုထိုးများ၊ နေထွက်နှင့် နေဝင်ချိန် ရှုခင်းများကြောင့် ကမ္ဘာလှည့်ခရီးသွားများကို ဆွဲဆောင်လျက်ရှိပါသည်။
`,

   
    packages: [
      {
        id: 4,
        type: 'Budget',
        title: '3 Days Bagan Heritage & Sunset Explorer',
        price: '650,000 MMK',
        duration: '3 Days / 2 Nights',
        image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRwzODua4lxLbJHTqYY8jd2KjNqLmb8VCq5KF5zYX6bTFEtjTqZk4pcksCqgGjgdVJ3Hfahoy3C1Qvjuqu7T-72KQQ&s=19'
      },
      {
         id: 5,
        type: 'Standard',
        title: '4 Days Bagan Cultural Discovery',
        price: '950,000 MMK',
        duration: '4 Days / 3 Nights',
        image: 'https://images.unsplash.com/photo-1599403275295-57bca684efd3?q=80&w=1041&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
         id: 6,
        type: 'Luxury',
        title: '4 Days Bagan Royal Balloon Escape',
        price: '1,850,000 MMK',
        duration: '4 Days / 3 Nights',
        image: 'https://images.unsplash.com/photo-1515900959941-d1cce424f5c4?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
    ]
  },

  Kalaw: {

    name: 'Kalaw',

    location: 'Shan State, Myanmar',

    image: '/kalaw.jpg',

    website: 'https://en.wikipedia.org/wiki/Kalaw',

    overview: `
Kalaw is a peaceful hill town located in Shan State, Myanmar, and is well known for its cool climate, pine forests and breathtaking mountain scenery.

ကလောမြို့သည် ရှမ်းပြည်နယ်တွင် တည်ရှိသော အေးချမ်းလှပသည့် တောင်ပေါ်မြို့တစ်မြို့ဖြစ်ပြီး အေးမြသောရာသီဥတု၊ ထင်းရှူးတောများနှင့် သဘာဝတောင်တန်းရှုခင်းများကြောင့် လူသိများပါသည်။
`,

   
    packages: [
      {
         id: 10,
        type: 'Budget',
        title: '3 Days Kalaw Nature & Trekking Experience',
        price: '420,000 MMK',
        duration: '3 Days / 2 Nights',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSRG9FCoqjY-LUvTY_RQJ2EDSYiZIuv5pdTN22nhTS-g&s=10'
      },
      {
         id: 11,
        type: 'Standard',
        title: '4 Days Kalaw & Inle Scenic Adventure',
        price: '720,000 MMK',
        duration: '4 Days / 3 Nights',
        image: 'https://indochinatreks.com/wp-content/uploads/2022/12/12.-Kalaw-inle-lake-fishermen-istock.jpg'
      },
      {
         id: 12,
        type: 'Luxury',
        title: '5 Days Kalaw Luxury Mountain Retreat',
        price: '1,250,000 MMK',
        duration: '5 Days / 4 Nights',
        image: 'https://i.travelapi.com/lodging/16000000/15660000/15651600/15651577/182bbc8c_z.jpg'
      }
    ]
  },

'Hpa-An': {

  name: 'Hpa-An',

  location: 'Kayin State, Myanmar',

  image: '/hpaan.jpg',

  website: 'https://en.wikipedia.org/wiki/Hpa-an',

  overview: `
Hpa-An is one of Myanmar's most beautiful natural destinations, famous for its limestone mountains, caves and breathtaking landscapes.

ဘားအံမြို့သည် ကရင်ပြည်နယ်၏ အလှဆုံးခရီးသွားဒေသများထဲမှ တစ်ခုဖြစ်ပြီး ကျောက်တောင်များ၊ ဂူများနှင့် သဘာဝရှုခင်းအလှများကြောင့် လူသိများပါသည်။
`,

 
  packages: [
    {
       id: 1,
      type: 'Budget',
      title: '3 Days Hpa-An Explore',
      price: '350,000 MMK',
      duration: '3 Days / 2 Nights',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKM47OeGkz0jR-u1pXERcqjcANzdiJW8Qwlf-ADoF4QGplTaPI9TLIppc&s=10'
    },
    {
       id: 2,
      type: 'Standard',
      title: '4 Days Hpa-An Adventure',
      price: '650,000 MMK',
      duration: '4 Days / 3 Nights',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKM47OeGkz0jR-u1pXERcqjcANzdiJW8Qwlf-ADoF4QGplTaPI9TLIppc&s=10'
    },
    {
       id: 3,
      type: 'Luxury',
      title: '5 Days Hpa-An Luxury Retreat',
      price: '1,250,000 MMK',
      duration: '5 Days / 4 Nights',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhKjPwzLJT5EpxUj3ligmXhDLn6WOAxCdc3aoTQSiz8MhKwdmJxb3xOIkU&s=10'
    }
  ]

},
'Ngwe Saung': {

  name: 'Ngwe Saung',

  location: 'Ayeyarwady Region, Myanmar',

  image: '/ngwesaung.jpg',

  website: 'https://en.wikipedia.org/wiki/Ngwesaung',

  overview: `
Ngwe Saung Beach is one of Myanmar's most popular coastal destinations, known for its long white sandy beach and relaxing atmosphere.

ငွေဆောင်ကမ်းခြေသည် မြန်မာနိုင်ငံ၏ အကျော်ကြားဆုံး ပင်လယ်ကမ်းခြေခရီးသွားဒေသများထဲမှ တစ်ခုဖြစ်ပြီး သဲဖြူကမ်းခြေရှည်ကြီးများနှင့် အေးချမ်းသော ပတ်ဝန်းကျင်ကြောင့် လူသိများပါသည်။
`,

 
  packages: [
    {
       id: 7,
      type: 'Budget',
      title: 'Coastal Escape',
      price: '750,000 MMK',
      duration: '4 Days / 3 Nights',
        image: 'https://www.mcs-myanmartravel.com/wp-content/uploads/2015/07/ngwesaung.jpg'
    },
    {
       id: 8,
      type: 'Standard',
      title: 'Coastal Experience',
      price: '1,200,000 MMK',
      duration: '5 Days / 4 Nights',
        image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/30/d2/d1/eskala-hotels-resorts.jpg?w=1200&h=-1&s=1'
    },
    {
       id: 9,
      type: 'Luxury',
      title: 'Ocean Prestige',
      price: '2,200,000 MMK',
      duration: '5 Days / 4 Nights',
        image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=600'
    }
  ]

},
  Thailand: {

    name: 'Thailand',

    location: 'Bangkok, Thailand',

    image: '/thailand.jpg',

    website: 'https://en.wikipedia.org/wiki/Thailand',

    overview: `
Thailand is one of Southeast Asia’s most popular travel destinations, known for its vibrant cities, rich cultural heritage and world-famous hospitality.

ထိုင်းနိုင်ငံသည် အရှေ့တောင်အာရှ၏ အကျော်ကြားဆုံး ခရီးသွားနိုင်ငံများထဲမှ တစ်နိုင်ငံဖြစ်ပြီး စည်ကားသောမြို့ပြများ၊ ယဉ်ကျေးမှုအမွေအနှစ်များနှင့် နာမည်ကျော် ဧည့်ဝတ်ကျေပွန်မှုတို့ကြောင့် လူသိများပါသည်။
`,

    
    packages: [
      {
         id: 13,
        type: 'Budget',
        title: '4 Days Bangkok Retail Therapy & Street Food Tour',
        price: '1,650,000 MMK',
        duration: '4 Days / 3 Nights',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZcLJa-cWwqzjwGQIJuINkTQ1ccor6N8ADP42u7BMhHZTdZmuumbOGCN_y&s=10'
      },
      {
         id: 14,
        type: 'Standard',
        title: '5 Days Bangkok & Pattaya Family Fun Vacation',
        price: '2,550,000 MMK',
        duration: '5 Days / 4 Nights',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsuqSWfs1NiHiKGMVxXP2vsi7f942K7nR-Pl7jYYKLuyFpTEKALyz1DdY&s=10'
      },
      {
         id: 15,
        type: 'Luxury',
        title: '5 Days Phuket Ultra-Luxury Private Pool Villa Escape',
        price: '4,450,000 MMK',
        duration: '5 Days / 4 Nights',
        image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=801&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
    ]
  },

  Japan: {

    name: 'Japan',

    location: 'Tokyo, Japan',

    image: '/japan.jpg',

    website: 'https://en.wikipedia.org/wiki/Japan',

    overview: `
Japan is a fascinating destination where ancient traditions blend seamlessly with modern innovation.

ဂျပန်နိုင်ငံသည် ရိုးရာယဉ်ကျေးမှုနှင့် ခေတ်မီနည်းပညာများ ပေါင်းစပ်တည်ရှိနေသော အထူးဆွဲဆောင်မှုရှိသည့် ခရီးသွားနိုင်ငံဖြစ်ပါသည်။
`,

    packages: [
      {
         id: 16,
        type: 'Budget',
        title: '5 Days Tokyo City Explorer & Cultural Tour',
        price: '3,250,000 MMK',
        duration: '5 Days / 4 Nights',
              image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600'

      },
      {
         id: 17,
        type: 'Standard',
        title: '6 Days Tokyo & Mount Fuji Scenic Adventure',
        price: '4,250,000 MMK',
        duration: '6 Days / 5 Nights',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600'
      },
      {
         id: 18,
        type: 'Luxury',
        title: '7 Days Kyoto, Osaka & Tokyo Premium Experience',
        price: '6,850,000 MMK',
        duration: '7 Days / 6 Nights',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600'
      }
    ]
  },

  China: {

    name: 'China',

    location: 'Shanghai, China',

    image: '/china.jpg',

    website: 'https://en.wikipedia.org/wiki/China',

    overview: `
China is a diverse and culturally rich destination that combines thousands of years of history with impressive modern development.

တရုတ်နိုင်ငံသည် နှစ်ထောင်ပေါင်းများစွာသော သမိုင်းအမွေအနှစ်များနှင့် ခေတ်မီဖွံ့ဖြိုးတိုးတက်မှုများကို ပေါင်းစပ်ထားသည့် ယဉ်ကျေးမှုကြွယ်ဝသော နိုင်ငံတစ်နိုင်ငံဖြစ်ပါသည်။
`,

    packages: [
      {
         id: 22,
        type: 'Budget',
        title: '4 Days Shanghai City Highlights & Street Food Explorer',
        price: '1,950,000 MMK',
        duration: '4 Days / 3 Nights',
        image: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&w=800&q=80'
      },
      {
         id: 23,
        type: 'Standard',
        title: '5 Days Shanghai & Suzhou Cultural Discovery',
        price: '2,950,000 MMK',
        duration: '5 Days / 4 Nights',
        image: 'https://plus.unsplash.com/premium_photo-1664299326174-f73b66496733?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
         id: 24,
        type: 'Luxury',
        title: '5 Days Shanghai Luxury Skyline & VIP Experience',
        price: '4,850,000 MMK',
        duration: '5 Days / 4 Nights',
        image: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&q=80&w=600'
      }
    ]
  },

  Singapore: {

    name: 'Singapore',

    location: 'Singapore',

    image: '/singapore.jpg',

    website: 'https://en.wikipedia.org/wiki/Singapore',

    overview: `
Singapore is a modern and dynamic city-state renowned for its iconic skyline, world-class attractions and multicultural lifestyle.

စင်ကာပူနိုင်ငံသည် ခေတ်မီမြို့ပြဖွံ့ဖြိုးတိုးတက်မှု၊ ကမ္ဘာကျော်အထင်ကရနေရာများနှင့် ယဉ်ကျေးမှုမျိုးစုံ ပေါင်းစပ်နေထိုင်မှုတို့ကြောင့် လူသိများသော မြို့ပြနိုင်ငံတစ်နိုင်ငံဖြစ်ပါသည်။
`,

   
    packages: [
      {
         id: 19,
        type: 'Budget',
        title: 'City Escape',
        price: '2,850,000 MMK',
        duration: '4 Days / 3 Nights',
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=600'
      },
      {
         id: 20,
        type: 'Standard',
        title: 'Adventure Experience',
        price: '3,850,000 MMK',
        duration: '5 Days / 4 Nights',
        image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=80&w=600'
      },
      {
         id: 21,
        type: 'Luxury',
        title: 'Prestige Escape',
        price: '6,500,000 MMK',
        duration: '5 Days / 4 Nights',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600'
      }
    ]
  }

}

const destination = computed(() =>
  destinations[route.params.name]
)

const openWebsite = () => {
  window.open(destination.value.website, '_blank')
}

</script>
<style set up>
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  padding: 0;
  margin-bottom: 20px;
  transition: color 0.2s;
}

.detail-page{
  background:#f8fafc;
  min-height:100vh;
}

/* Hero */

.hero{
  height:500px;

  background-size:cover;
  background-position:center;

  display:flex;
  justify-content:center;
  align-items:center;

  cursor:pointer;

  position:relative;
}

.hero::before{
  content:'';

  position:absolute;
  inset:0;

  background:
  rgba(0,0,0,.45);
}

.hero-overlay{
  position:relative;
  z-index:1;

  text-align:center;
  color:white;
}

.hero-overlay h1{
  font-size:60px;
  margin-bottom:15px;
}

.hero-overlay p{
  font-size:22px;
}

.visit-btn{
  margin-top:25px;

  border:none;

  background:#2563eb;
  color:white;

  padding:14px 28px;

  border-radius:30px;

  cursor:pointer;
}

/* Section */

.content-section{
  width:95%;
  max-width:1400px;

  margin:60px auto;
}

.section-title{
  font-size:36px;
  margin-bottom:25px;

  color:#111827;
}

/* About */

.about-grid{
  display:grid;
  grid-template-columns:2fr 1fr;
  gap:30px;
}

.overview{
  margin-top:15px;

  color:#4b5563;

  line-height:1.9;

  white-space:pre-line;
}

.quick-info{
  background:white;

  padding:25px;

  border-radius:20px;

  box-shadow:
  0 5px 20px rgba(0,0,0,.08);
}

.quick-info h3{
  margin-bottom:20px;
}

.info-row{
  display:flex;
  justify-content:space-between;

  margin-bottom:15px;
}



/* Packages */

.package-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);

  gap:25px;
}

.package-card{
  background:white;

  border-radius:20px;

  overflow:hidden;

  box-shadow:
  0 5px 20px rgba(0,0,0,.08);

  transition:.3s;
}

.package-card:hover{
  transform:translateY(-8px);
}

.package-image{
  width:100%;
  height:240px;

  object-fit:cover;
}

.package-content{
  padding:20px;
}

.package-type{
  background:#dbeafe;

  color:#2563eb;

  padding:6px 12px;

  border-radius:20px;

  font-size:12px;
}

.package-content h3{
  margin:15px 0;
}

.package-price{
  color:#16a34a;

  font-weight:bold;

  margin-bottom:10px;
}

.package-btn{
text-align:center;
  margin-top:15px auto 0;
display: block;
width: fit-content;
  width:100%;

  border:none;
text-decoration: none;
  background:#2563eb;
  color:white;

  padding:12px;

  border-radius:10px;

  cursor:pointer;
}

/* Responsive */

@media(max-width:1000px){

  .about-grid{
    grid-template-columns:1fr;
  }

  .package-grid{
    grid-template-columns:repeat(2,1fr);
  }

  .attraction-grid{
    grid-template-columns:repeat(2,1fr);
  }

}

@media(max-width:700px){

  .package-grid{
    grid-template-columns:1fr;
  }

  .attraction-grid{
    grid-template-columns:1fr;
  }

  .highlight-grid{
    grid-template-columns:1fr;
  }

  .hero-overlay h1{
    font-size:38px;
  }

}
</style>