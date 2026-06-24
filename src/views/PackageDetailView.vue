<template>
  <div class="detail-page">
    <div v-if="pkg" class="detail-container">
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
        Back to Packages
      </button>

      <div class="detail-layout">
        <div class="detail-left">
          <h1 class="pkg-title">{{ pkg.title }}</h1>
          <div class="pkg-meta-row">
            <div class="pkg-location">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#64748B">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                />
              </svg>
              {{ pkg.city }}, {{ pkg.country }}
            </div>
            <div class="pkg-rating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </svg>
              <span class="rat-val">{{ pkg.rating }}</span>
              <span class="rat-cnt">({{ pkg.review_count }} reviews)</span>
            </div>
          </div>

          <div class="hero-img-wrap">
            <img :src="selectedImg" :alt="pkg.title" class="hero-img" />
            <div class="pkg-type-tag" :class="pkg.type === 'domestic' ? 'tag-green' : 'tag-blue'">
              {{ pkg.type === 'domestic' ? 'Domestic' : 'International' }}
            </div>
          </div>

          <div v-if="pkg.thumbnail_images && pkg.thumbnail_images.length" class="thumbs-strip">
            <div
              v-for="(img, i) in pkg.thumbnail_images"
              :key="i"
              class="thumb"
              :class="{ active: selectedImg === img }"
              @click="selectedImg = img"
            >
              <img :src="img" class="thumb-img" alt="thumbnail" />
            </div>
          </div>

          <div class="content-block">
            <h2 class="block-title">Overview</h2>
            <p class="overview-text">{{ pkg.overview }}</p>
          </div>

          <div class="content-block">
            <h2 class="block-title">Itinerary</h2>
            <div v-if="pkg.itinerary && pkg.itinerary.length" class="itinerary-list">
              <div v-for="(day, idx) in pkg.itinerary" :key="idx" class="itin-item">
                <div class="itin-connector">
                  <div class="itin-dot" :class="idx === 0 ? 'dot-first' : ''">
                    <span class="dot-num">{{ idx + 1 }}</span>
                  </div>
                  <div v-if="idx < pkg.itinerary.length - 1" class="itin-line" />
                </div>
                <div
                  class="itin-content"
                  :class="{ 'itin-last': idx === pkg.itinerary.length - 1 }"
                >
                  <div class="itin-title">{{ day.title }}</div>
                  <div class="itin-desc">{{ day.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-right">
          <div class="pricing-card">
            <div class="price-section">
              <span class="price-amount">{{ formatMMK(pkg.price) }}</span>
              <span class="price-per">/ person</span>
            </div>

            <div class="divider" />

            <div class="specs-list">
              <div class="spec-row">
                <div class="spec-lbl">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748B"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Duration
                </div>
                <span class="spec-val">{{ pkg.duration }}</span>
              </div>

              <div class="spec-row">
                <div class="spec-lbl">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748B"
                    stroke-width="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Group Size
                </div>
                <span class="spec-val">{{ pkg.group_size }}</span>
              </div>

              <div class="spec-row">
                <div class="spec-lbl">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748B"
                    stroke-width="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Hotel
                </div>
                <span class="spec-val">{{ pkg.hotel }}</span>
              </div>

              <div class="spec-row">
                <div class="spec-lbl">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748B"
                    stroke-width="2"
                  >
                    <path
                      d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                    />
                  </svg>
                  Transport
                </div>
                <span class="spec-val">Included</span>
              </div>
            </div>
            <!-- Hotel Row ရဲ့ အောက် (သို့မဟုတ်) Transport Row ရဲ့ အပေါ်မှာ ထည့်နိုင်ပါတယ် -->
            <div class="spec-row">
              <div class="spec-lbl">
                <!-- ဇွန်းနဲ့ခက်ရင်းပုံစံ (Meals) SVG Icon -->
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#64748B"
                  stroke-width="2"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Meals
              </div>
              <!-- <span class="spec-val">Breakfast & Dinner Included</span> -->
              <span class="spec-val">{{ pkg.meals || 'Not Included' }}</span>
            </div>

            <div class="divider" />

            <button class="book-btn" @click="handleBook">Book Now</button>

            <button class="wishlist-btn" @click="toggleWishlist">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                :fill="inWishlist ? '#E53E3E' : 'none'"
                :stroke="inWishlist ? '#E53E3E' : '#64748B'"
                stroke-width="2"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
              {{ inWishlist ? 'Saved to Wishlist' : 'Add to Wishlist' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else class="not-found">
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#CBD5E1"
        stroke-width="1.5"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
      <p>Package not found.</p>
      <router-link to="/packages" class="not-found-link">Browse Packages</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const pkg = ref(null)
const loading = ref(true)
const selectedImg = ref('')
const inWishlist = ref(false)

const packagesDataset = [
  {
    id: 1,
    title: 'Hpa-An Explore',
    overview:
      'This basic itinerary is highly suitable for budget-conscious travelers and groups of friends who want to joyfully explore the main landmark caves of Hpa-An.',
    price: '195,000 MMK',
    duration: '3 Days / 2 Nights',
    group_size: '2 - 10 People',
    hotel: '',
    rating: '4.7',
    reviews: '45',
    type: 'domestic',
    level: 'budget',
    city: 'Hpa An',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKM47OeGkz0jR-u1pXERcqjcANzdiJW8Qwlf-ADoF4QGplTaPI9TLIppc&s=10',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
  {
    title: 'Arrival',
    description: 'Arrive via Express bus and check-in to your cozy standard guesthouse in downtown Hpa-An.'
  },
  {
    title: 'Tuk-Tuk Tour',
    description: 'Enjoy a full-day Tuk-Tuk adventure visiting Kawgun Cave, Sadan Cave, Lumbini Garden, and Kyauk Ka Lat.'
  },
  {
    title: 'Return',
    description: 'Shop for traditional Karen textiles and souvenirs before boarding your return bus to Yangon.'
  }
],
  },
  {
    id: 2,
    title: 'Hpa-An Mt.Zwegabin Adventure & Nature Tour',
    overview: 'The best itinerary for nature lovers who want to personally climb Mt. Zwegabin and create lasting memories filled with adventure.',
    price: '390,000 MMK',
    duration: '4Days / 3Nights',
    group_size: '2-8 People',
    hotel: '',
    rating: '4.8',
    reviews: '72',
    type: 'domestic',
    level: 'standard',
    city: 'Hpa An',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC2F6dkl--5ZgGST33-gDENeFeDjfWokz5G0caN9E_sHarjggPWSNBUe0&s=10',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
  {
    title: 'Hpa-An Drive',
    description: 'Get picked up by private minivan and enjoy watching the sunset over Kan Tharyar Lake.'
  },
  {
    title: 'Hiking',
    description: 'Wake up early to climb Mount Zwegabin and enjoy a magnificent sea-of-clouds sunrise from the summit.'
  },
  {
    title: 'Nature Cave',
    description: 'Cool off at the Yaedagon natural mountain pool and explore historic carvings inside Kawgun Cave.'
  },
  {
    title: 'Return',
    description: 'Complete your eco-resort check-out and enjoy a smooth, scenic drive back to Yangon.'
  }
],
  },
  {
    id: 3,
    title: 'Hpa-An Thanlwin Riverside Luxury Retreat',
    overview: 'A premium itinerary for relaxing peacefully at a high-end VIP resort by the Thanlwin River, while traveling luxuriously with a private VIP car and private boats.',
    price: '950,000 MMK',
    duration: '5Days / 4Nights',
    group_size: '2-8 People',
    hotel: '',
    rating: '5.0',
    reviews: '38',
    type: 'domestic',
    level: 'premium',
    city: 'Hpa An',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhKjPwzLJT5EpxUj3ligmXhDLn6WOAxCdc3aoTQSiz8MhKwdmJxb3xOIkU&s=10',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary:[
  {
    title: 'VIP Arrival',
    description: 'Arrive via a high-roof VIP van, check-in to your 5-star riverside resort, and receive a spa treatment.'
  },
  {
    title: 'River Cruise',
    description: 'Board an exclusive private wooden boat for a scenic sunset cruise along the mighty Thanlwin River.'
  },
  {
    title: 'Custom Tour',
    description: 'Take a private guided tour of Kyauk Ka Lat followed by an elite traditional VIP dinner show.'
  },
  {
    title: 'Return',
    description: 'Enjoy a slow, lazy morning at the resort pool before your private VIP vehicle transfers you home.'
  }
],
  },
  {
    id: 4,
    title: 'Bagan Heritage & Sunset Explore',
    overview: 'An affordable tour exploring ancient Bagan pagodas, famous sunset viewpoints, and rich Myanmar cultural heritage.',
    price: '650,000 MMK',
    duration: '3Days / 2Nights',
    group_size: '2-15 People',
    hotel: '',
    rating: '4.8',
    reviews: '180',
    type: 'domestic',
    level: 'budget',
    city: 'Bagan',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://images.unsplash.com/photo-1599403275295-57bca684efd3?q=80&w=1041&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    thumbnail_images: [
      'https://media.istockphoto.com/id/472682036/photo/hot-air-balloon-flying-over-bagan-temples-at-sunrise.jpg?s=612x612&w=0&k=20&c=_l13hAh5wzFA8cA0cErnm1_jBl8aH8xoEA9AKxs4c_w=',
      'https://images.unsplash.com/photo-1675927308423-72dc9c525d8e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJhZ2FuJTIwc3VucmlzZXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    itinerary: [
      {
        title: 'Arrival & Sunset Temple Watch',
        description:
          'Arrive at Bagan airport, check-in to hotel and head out to experience the iconic panoramic golden sunset.',
      },
      {
        title: 'Full Day Temple Exploration',
        description:
          'Visit Ananda Temple, Shwezigon Pagoda, and Dhammayangyi Temple with a professional local guide.',
      },
      {
        title: 'Local Crafts & Departure',
        description:
          'Explore traditional lacquerware workshops and enjoy a smooth departure back home.',
      },
    ],
  },
  {
    id: 5,
    title: 'Bagan Cultural Discovery & River Experience',
    overview: "A suitable package for families and friends to fully experience Bagan's ancient temples, local culture, and Ayeyarwady scenic river views.",
    price: '950,000 MMK',
    duration: '4Days / 3Nights',
    group_size: '2-12 People',
    hotel: '',
    rating: '4.9',
    reviews: '220',
    type: 'domestic',
    level: 'standard',
    city: 'Bagan',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://images.unsplash.com/photo-1515900959941-d1cce424f5c4?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1609847860270-efa8c3ad583d?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1528648105451-3d52d912762d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://media.istockphoto.com/id/178071920/photo/golden-palace-in-old-bagan-mandalay-burma.webp?a=1&b=1&s=612x612&w=0&k=20&c=IKvUX7hu6KH1DjR4UlImXCwrnifaXT2hvm-_xoWpJgQ=',
      'https://images.unsplash.com/photo-1497601089782-06319e8be3a0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    itinerary: [
  {
    title: 'Arrival',
    description: 'Enjoy an airport pickup and check-in to a beautiful resort nestled right by the river.'
  },
  {
    title: 'Heritage Tour',
    description: 'Visit the golden Shwezigon Pagoda, iconic temples, and the fascinating Archaeological Museum.'
  },
  {
    title: 'River Cruise',
    description: 'Set out on a relaxing Ayeyarwady sunset boat cruise and visit a traditional riverbank village.'
  },
  {
    title: 'Return',
    description: 'Shop for authentic Bagan lacquerware souvenirs before checking out for your departure.'
  }
],
  },
  {
    id: 6,
    title: 'Bagan Royal Balloon & Luxury Escape',
    overview: 'A premium package featuring a breathtaking sunrise hot-air balloon flight, luxury resort stay, and private guided tours for an unforgettable escape.',
    price: '1,850,000 MMK',
    duration: '4Days / 3Nights',
    group_size: '2-4 People(Private)',
    hotel: '',
    rating: '5',
    reviews: '62',
    type: 'domestic',
    level: 'premium',
    city: 'Bagan',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://media.istockphoto.com/id/614446038/photo/hot-air-balloons-in-bagan-myanmar.jpg?s=612x612&w=0&k=20&c=nlxHdhqgEUUw_5M0dRlfhzHvjQG_epUqzLyUjcJJKmw=',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1674043549356-8dff137408bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmFnYW4lMjBzdW5yaXNlfGVufDB8fDB8fHww',
      'https://media.istockphoto.com/id/1288905205/photo/dhammayazika-pagoda-temple-and-hot-air-balloons-in-myanmar.webp?a=1&b=1&s=612x612&w=0&k=20&c=mxZh-Nu6iz90FfJlGUnpQWxRrlk4wyQnBHtQxflvLLU=',
      'https://d2lwt6tidfiof0.cloudfront.net/images/background/bg-myanmar.jpg',
    ],
    itinerary: [
  {
    title: 'VIP Arrival',
    description: 'Arrive via private transfer and check-in to a luxury 5-star resort and spa sanctuary.'
  },
  {
    title: 'Balloon Adventure',
    description: 'Witness a breathtaking Bagan sunrise from a hot-air balloon followed by a private guided temple tour.'
  },
  {
    title: 'Luxury Experience',
    description: 'Unwind with a premium spa treatment, take a private photography tour, and enjoy a sunset dinner.'
  },
  {
    title: 'Return',
    description: 'Complete your executive check-out and take a private chauffeur transfer back to the airport.'
  }
],
  },
  {
    id: 7,
    title: 'Ngwe Saung Costal Escape',
    overview: 'A budget-friendly coastal escape designed for travelers looking to relax peacefully in the sea breeze and experience natural beach beauty.',
    price: '750,000 MMK',
    duration: '4Days / 3Nights',
    group_size: '2-20 People',
    hotel: '',
    rating: '4.5',
    reviews: '126',
    type: 'domestic',
    level: 'budget',
    city: 'Ngwe Saung',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://www.mcs-myanmartravel.com/wp-content/uploads/2015/07/ngwesaung.jpg',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary:[
  {
    title: 'Arrival & Check-in',
    description: 'Arrival at Ngwe Saung Beach and hotel check-in to relax after the journey.'
  },
  {
    title: 'Island Tour',
    description: 'Visit Lovers Island and experience the breathtaking panoramic sunset at the beach.'
  },
  {
    title: 'Leisure',
    description: 'Enjoy free leisure time and indulge in tasting fresh local seafood along the shore.'
  },
  {
    title: 'Return',
    description: 'Check-out from the hotel and begin the smooth return journey back to Mandalay.'
  }
],
  },
  {
    id: 8,
    title: 'Ngwe Saung Coastal Experience',
    overview: 'A comfortable travel experience tailored to fully enjoy beach activities, local exploration, and high-quality resort relaxation.',
    price: '1,200,000 MMK',
    duration: '5Days / 4Nights',
    group_size: '2-15 People',
    hotel: '',
    rating: '4.8',
    reviews: '246',
    type: 'domestic',
    level: 'standard',
    city: 'Ngwe Saung',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/30/d2/d1/eskala-hotels-resorts.jpg?w=1200&h=-1&s=1',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary:[
  {
    title: 'Arrival',
    description: 'Arrive at Ngwe Saung Beach and check-in to your selected 4-star beach resort.'
  },
  {
    title: 'Beach Activities',
    description: 'Engage in exciting beach activities or enjoy premium relaxation inside the resort facilities.'
  },
  {
    title: 'Excursion',
    description: 'Take a cultural and nature-filled excursion to visit the nearby Elephant Camp.'
  },
  {
    title: 'Relax',
    description: 'Spend a completely free day for personal relaxation followed by a sunset BBQ dinner.'
  },
  {
    title: 'Return',
    description: 'Complete resort check-out and embark on a comfortable drive back to Mandalay.'
  }
],
  },
  {
    id: 9,
    title: 'Ngwe Saung Ocean Prestige',
    overview: 'A premium seaside escape combining tranquility and ultra-luxury experiences, featuring private accommodations and VIP services.',
    price: '2,200,000 MMK',
    duration: '5Days / 4Nights',
    group_size: '2-8 People',
    hotel: '',
    rating: '4.9',
    reviews: '89',
    type: 'domestic',
    level: 'premium',
    city: 'Ngwe Saung',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
  {
    title: 'VIP Arrival',
    description: 'Enjoy a private SUV transfer, receive a VIP welcome, and check-in to your private Ocean Villa.'
  },
  {
    title: 'Spa Relax',
    description: 'Indulge in a premium luxury spa experience and unwind on the exclusive private beach front.'
  },
  {
    title: 'Cruise Experience',
    description: 'Set sail on a private boat cruise to experience the ultimate sea views and ocean breeze.'
  },
  {
    title: 'Romantic Dinner',
    description: 'Spend a premium leisure morning followed by an exclusive romantic dinner on the beach.'
  },
  {
    title: 'Return',
    description: 'Complete executive check-out and take a private SUV transfer directly back home.'
  }
],
  },
  {
    id: 10,
    title: 'Kalaw Nature & Trekking Experience',
    overview: "A suitable package for nature lovers wanting to experience Kalaw's cool climate, pine forests, mountain trekking, and local markets.",
    price: '420,000 MMK',
    duration: '3Days / 2Nigts',
    group_size: '2-12 People',
    hotel: '',
    rating: '4.7',
    reviews: '135',
    type: 'domestic',
    level: 'budget',
    city: 'Kalaw',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSRG9FCoqjY-LUvTY_RQJ2EDSYiZIuv5pdTN22nhTS-g&s=10',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
  {
    title: 'Arrival',
    description: 'Arrive in chilly Kalaw via VIP Express bus, check-in to your hotel, and explore the evening market.'
  },
  {
    title: 'Trekking',
    description: 'Trek through aromatic pine forests up to a scenic viewpoint and visit a traditional ethnic village.'
  },
  {
    title: 'Return',
    description: 'Sip fresh local mountain coffee, shop for local Shan snacks and tea, and head on your return journey.'
  }
],
    
  },
  {
    id: 11,
    title: 'Kalaw & Inle Scenic Adventure',
    overview: 'A great vacation for families and friends to visit Kalaw and Inle Lake in one trip, exploring natural beauty, tradition, and Intha lifestyle.',
    price: '720,000 MMK',
    duration: '4Days / 3Nights',
    group_size: '2-10 People',
    hotel: '',
    rating: '4.9',
    reviews: '185',
    type: 'domestic',
    level: 'standard',
    city: 'Kalaw',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://indochinatreks.com/wp-content/uploads/2022/12/12.-Kalaw-inle-lake-fishermen-istock.jpg',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
  {
    title: 'Arrival',
    description: 'Arrive in the beautiful hill station of Kalaw and check-in to a comfortable 4-star mountain hotel.'
  },
  {
    title: 'Kalaw Tour',
    description: 'Take in mountain views, visit the historic Christ the King Church, and browse the vibrant local market.'
  },
  {
    title: 'Inle Lake',
    description: 'Board a private boat to explore floating gardens, stilt villages, and the historic Phaung Daw Oo Pagoda.'
  },
  {
    title: 'Return',
    description: 'Enjoy a traditional Shan breakfast before checking out for a smooth return drive.'
  }
],
  },
  {
    id: 12,
    title: 'Kalaw Luxury Mountain Retreat',
    overview: 'A VIP retreat to relax peacefully in a luxury mountain resort, enjoying private tours, premium dining, and pristine nature.',
    price: '1,250,000 MMK',
    duration: '5Days / 4Nights',
    group_size: '2-6 People',
    hotel: '',
    rating: '5',
    reviews: '29',
    type: 'domestic',
    level: 'premium',
    city: 'Kalaw',
    country: 'Myanmar',
    type: 'domestic',
    image:
      'https://i.travelapi.com/lodging/16000000/15660000/15651600/15651577/182bbc8c_z.jpg',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
  {
    title: 'VIP Arrival',
    description: 'Travel by a private SUV with chauffeur service and check-in to a world-class luxury mountain resort.'
  },
  {
    title: 'Nature Escape',
    description: 'Embark on a private guided nature trek through serene pine hills to catch a stunning mountain sunset.'
  },
  {
    title: 'Wellness Day',
    description: 'Spend an entire day focusing on wellness with signature spa treatments and relaxing resort activities.'
  },
  {
    title: 'Local Experience',
    description: 'Tour an organic coffee plantation followed by an exclusive private Shan cultural dinner.'
  },
  {
    title: 'Return',
    description: 'Enjoy breakfast with mountain views before a private chauffeur transfer takes you back home.'
  }
],
  },
  {
    id: 13,
    title: 'Bangkok City Tour',
    overview: 'Tailored for travelers who want to stay in a convenient shopping area in downtown Bangkok, go shopping, and explore famous temples and street food.',
    price: '1,650,000 MMK',
    duration: '4Days / 3Nights',
    group_size: '2-12 People',
    hotel: '',
    rating: '4.6',
    reviews: '112',
    type: 'international',
    level: 'budget',
    city: 'Bangkok',
    country: 'Thailand',
    type: 'international',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZcLJa-cWwqzjwGQIJuINkTQ1ccor6N8ADP42u7BMhHZTdZmuumbOGCN_y&s=10',
    thumbnail_images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG254elwdngsL0fC7AjlWCJRN_HOkBOLPkG-i2Yhu0ZArootu2svfqNFY&s=10',
      'https://images.unsplash.com/photo-1641638197876-c195236acf5d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1547640084-1dfcc7ef3b22?q=80&w=818&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKYRSrwV6Igg2XYERaRE6V7zAw0n3QR1jejdvYSugFSjGH72ubUZmwUUvi&s=10',
    ],
    itinerary:[
  {
    title: 'Arrival',
    description: 'Fly to Bangkok, meet your driver for an airport transfer, and check-in right in the heart of Pratunam.'
  },
  {
    title: 'City Tour',
    description: 'Visit the majestic Grand Palace, take a boat to Wat Arun, and enjoy a Chao Phraya river dinner cruise.'
  },
  {
    title: 'Shopping',
    description: 'Spend an entire day shopping at elite malls like Siam Paragon and bargaining at Platinum Mall.'
  },
  {
    title: 'Return',
    description: 'Do some last-minute street food snacking before your transfer to Suvarnabhumi Airport for your flight.'
  }
],
  },
  {
    id: 14,
    title: 'Chiang Mai Cultural Heritage',
    overview: "A perfect cultural getaway for families to explore Chiang Mai's golden mountain temples, interact ethically with rescued elephants, and experience ancient Northern Thai (Lanna) traditions.",
    price: '2,550,000 MMK',
    duration: '5Days / 4Nights',
    group_size: '2-10 People',
    hotel: '',
    rating: '4.8',
    reviews: '150',
    type: 'international',
    level: 'standard',
    city: 'Chiang Mai',
    country: 'Thailand',
    type: 'international',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsuqSWfs1NiHiKGMVxXP2vsi7f942K7nR-Pl7jYYKLuyFpTEKALyz1DdY&s=10',
    thumbnail_images: [
      'https://api.tourismthailand.org/upload/live/destination/1-1948.png',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlepe64CD6rAujjVSf-HvLOJ7gOyu16xyXKwjDb6NfS8Sq_LrO9rr-G2I&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTls89iH7BoyUiB5DxJKb1LFyV9UN7TUcEG0ZJwfl5bSUot4l-CBkdgloE&s=10',
      'https://www.weseektravel.com/wp-content/uploads/2023/09/chiang-mai-wat-rong-khun-2-1024x682.jpg',
    ],
    itinerary: [
  {
    title: 'Arrival',
    description: 'Fly to Chiang Mai, receive a private van transfer, and check-in to a charming Lanna-style resort.'
  },
  {
    title: 'Mountain Temple',
    description: 'Drive up Doi Suthep mountain to visit its golden temple and explore a traditional Hmong hill-tribe village.'
  },
  {
    title: 'Elephant Care',
    description: 'Spend an unforgettable family day at an ethical, no-riding Elephant Sanctuary feeding rescued giants.'
  },
  {
    title: 'Heritage Craft',
    description: 'Visit the Bo Sang handicraft village to paint umbrellas and conclude with a traditional Khantoke dinner.'
  },
  {
    title: 'Return',
    description: 'Browse the artistic Jing Jai weekend market before taking your private transfer back to the airport.'
  }
],
  },
  {
    id: 15,
    title: 'Phuket Luxury Island Resort',
    overview: 'A top-tier honeymoon and luxury itinerary featuring a lavish stay at an exclusive private pool villa in Phuket and a private yacht cruise to the famous Phi Phi Islands.',
    price: '4,450,000 MMK',
    duration: '5Days / 4Nights',
    group_size: '2-4 People',
    hotel: '',
    rating: '5.0',
    reviews: '85',
    type: 'international',
    level: 'premium',
    city: 'Phuket',
    country: 'Thailand',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=801&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=839&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1661940254003-c3f37e5d32ad?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1661962432490-6188a6420a81?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1661962958462-9e52fda9954d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    itinerary: [
  {
    title: 'VIP Arrival',
    description: 'Land via a direct flight, step into your private luxury limousine transfer, and check-in to your pool villa.'
  },
  {
    title: 'Private Yacht',
    description: 'Set sail on a private catamaran yacht cruise to the gorgeous Phi Phi Islands for snorkeling and sunbathing.'
  },
  {
    title: 'Luxury Spa',
    description: 'Indulge in a premium multi-hour Thai spa treatment followed by an exclusive candlelit beach dinner.'
  },
  {
    title: 'Villa Leisure',
    description: 'Spend a relaxing day enjoying your private infinity pool, order room service, and watch the ocean sunset.'
  },
  {
    title: 'Return',
    description: 'Complete your luxury executive check-out and take a private vehicle directly to the airport.'
  }
],
  },
  {
    id: 16,
    title: 'Tokyo City Explore & Cultural Tour',
    overview: "A budget-friendly tour to experience Japanese culture while visiting Tokyo's modern skyscrapers, traditional shrines, and famous shopping districts.",
    price: '3,250,000 MMK',
    duration: '5Days / 4Nights',
    group_size: '2-10 People',
    hotel: '',
    rating: '4.8',
    reviews: '142',
    type: 'international',
    level: 'budget',
    city: 'Tokyo',
    country: 'Japan',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
  {
    title: 'Arrival',
    description: 'Arrive at Tokyo airport, check-in to your Shinjuku hotel, and enjoy a vibrant neon night walk.'
  },
  {
    title: 'City Tour',
    description: 'Visit Tokyo’s oldest Senso-ji Temple in Asakusa and admire views from the towering Tokyo Skytree.'
  },
  {
    title: 'Shopping',
    description: 'Cross the famous Shibuya Crossing, explore quirky Harajuku, and visit electronic-hub Akihabara.'
  },
  {
    title: 'Culture',
    description: 'Stroll through the serene forested paths of Meiji Shrine and explore the spacious grounds of Ueno Park.'
  },
  {
    title: 'Return',
    description: 'Pack your bags after last-minute shopping and take the airport transfer for your flight home.'
  }
],
  },
  {
    id: 17,
    title: 'Tokyo Mount Fuji Advanture',
    overview: 'An ideal package for families and friends to experience Tokyo, Mt. Fuji, and Hakone scenery in one trip, including an Onsen, cable car, and cruise.',
    price: '4,250,000 MMK',
    duration: '6Days / 5Nights',
    group_size: '2-10 People',
    hotel: '',
    rating: '4.9',
    reviews: '198',
    type: 'international',
    level: 'standard',
    city: 'Tokyo',
    country: 'Japan',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary:[
  {
    title: 'Arrival',
    description: 'Land in Tokyo, receive a friendly airport pickup, and check-in to your comfortable 4-star city hotel.'
  },
  {
    title: 'Tokyo Tour',
    description: 'Tour the scenic Imperial Palace gardens, explore luxury Ginza, and see the city from Tokyo Tower.'
  },
  {
    title: 'Mount Fuji',
    description: 'Travel out to scenic Lake Kawaguchi and drive up to Mount Fuji’s famous 5th Station.'
  },
  {
    title: 'Hakone',
    description: 'Ride the Hakone Ropeway over volcanic valleys, explore Owakudani, and cruise on Lake Ashi.'
  },
  {
    title: 'Free Day',
    description: 'Enjoy a fully open day in Tokyo for personalized shopping, dining, and cafe hunting.'
  },
  {
    title: 'Return',
    description: 'Take a private coach transfer directly to the airport for your smooth departure flight.'
  }
],
  },
  {
    id: 18,
    title: 'Osaka & Kyoto Cherry Blossom Tour',
    overview:
      'Experience the perfect blend of modern technology and rich traditional culture in Japan.',
    price: '$6,850,000 MMK',
    duration: '6Days/ 5Nights',
    group_size: '2-6 People',
    hotel: 'Premium City Hotel',
    rating: '5.0',
    reviews: '210',
    city: 'Oscaka',
    country: 'Japan',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
      {
        title: 'Tokyo Arrival',
        description: 'Welcome to Japan! Transfer to your hotel and explore Shinjukus neon streets.',
      },
      {
        title: 'Shibuya Crossing & Mt Fuji View',
        description:
          'Walk across the worlds busiest crossroad and enjoy a scenic bullet-train view of Mt. Fuji.',
      },
      {
        title: 'Historic Kyoto Temples',
        description: 'Visit Fushimi Inari Shrine with its thousands of vermilion torii gates.',
      },
      {
        title: 'Cherry Blossom Park Walk',
        description: 'Stroll through sakura paradise inside Ueno Park.',
      },
      {
        title: 'Shopping Day Akihabara',
        description: 'Unleash your inner tech geek in Akihabara anime and electronics town.',
      },
      {
        title: 'Sayonara Tokyo',
        description: 'Last-minute souvenir packing and flight back home.',
      },
    ],
  },
  {
    id: 19,
    title: 'Singapore City Escape',
    overview: 'A budget-friendly city escape to explore modern cityscapes, iconic landmarks, and famous shopping streets.',
    price: '2,850,000 MMK',
    duration: '4Days / 3Nights',
    group_size: '2-25 People',
    hotel: '',
    rating: '4.6',
    reviews: '112',
    type: 'international',
    level: 'budget',
    city: 'Singapore',
    country: 'Singapore',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
  {
    title: 'Arrival',
    description: 'Fly from Mandalay to Singapore, catch your airport transfer, and check-in to your city hotel.'
  },
  {
    title: 'City Tour',
    description: 'Explore iconic landmarks including Marina Bay, Merlion Park, and the futuristic Gardens by the Bay.'
  },
  {
    title: 'Shopping',
    description: 'Enjoy a full free day for hunting bargains and shopping along Singapore’s famous retail streets.'
  },
  {
    title: 'Return',
    description: 'Pick up last-minute souvenirs and transfer smoothly to Changi Airport for your flight back.'
  }
],
  },
  {
    id: 20,
    title: 'Singapore Advanture',
    overview: 'A complete Singapore experience combining leisure and high-energy excitement at top theme parks and wildlife attractions.',
    price: '3,850,000 MMK',
    duration: '5Days / 4Nights',
    group_size: '2-20 People',
    hotel: '',
    rating: '4.8',
    reviews: '128',
    type: 'international',
    level: 'standard',
    city: 'Singapore',
    country: 'Singapore',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
  {
    title: 'Arrival',
    description: 'Arrive in Singapore, meet your driver for airport pickup, and check-in to your 4-star hotel.'
  },
  {
    title: 'Sentosa',
    description: 'Head out to Sentosa Island to enjoy beautiful beaches and vibrant island activities.'
  },
  {
    title: 'Universal Studios',
    description: 'Experience a full day of world-class thrills and movie magic at Universal Studios Singapore.'
  },
  {
    title: 'Zoo Tour',
    description: 'Discover incredible wildlife at the world-renowned Singapore Zoo and River Wonders.'
  },
  {
    title: 'Return',
    description: 'Enjoy free morning shopping before transferring to the airport for your return flight.'
  }
],
  },
  {
    id: 21,
    title: 'Singapore Luxury Prestige Escape',
    overview: 'An ultra-luxury city escape designed for high-end lifestyles, featuring VIP services, premium accommodation, and night cruises.',
    price: '6,500,000 MMK',
    duration: '5Days / 4Nights',
    group_size: '2-6 People',
    hotel: '',
    rating: '4.9',
    reviews: '156',
    type: 'international',
    level: 'premium',
    city: 'Singapore',
    country: 'Singapore',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary:[
  {
    title: 'VIP Arrival',
    description: 'Fly premium class, take a private limousine transfer, and check-in to the iconic Marina Bay Sands.'
  },
  {
    title: 'Luxury Tour',
    description: 'Embark on a customized private city tour followed by a high-end personal shopping experience.'
  },
  {
    title: 'Spa & Relax',
    description: 'Rejuvenate with an award-winning luxury spa treatment and enjoy exclusive hotel amenities.'
  },
  {
    title: 'Shopping & Cruise',
    description: 'Spend the day browsing luxury brands and conclude with an exclusive Marina Bay night cruise.'
  },
  {
    title: 'Return',
    description: 'Complete executive check-out and transfer by private limousine to the airport.'
  }
] ,
  },
  {
    id: 22,
    title: 'Shanghai City Explore',
    overview: "An affordable tour to explore Shanghai's famous landmarks like The Bund, Oriental Pearl Tower, Yu Garden, and traditional Chinese street food.",
    price: '1,950,000 MMK',
    duration: '4Days / 3Nights',
    group_size: '2-12 People',
    hotel: '',
    rating: '4.7',
    reviews: '165',
    type: 'international',
    level: 'budget',
    city: 'Shanghai',
    country: 'China',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&w=800&q=80',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
  {
    title: 'Arrival',
    description: 'Arrive at Shanghai Pudong International Airport and transfer comfortably to your downtown hotel.'
  },
  {
    title: 'City Tour',
    description: 'Walk along the historic Bund, admire the Oriental Pearl Tower, and shop on busy Nanjing Road.'
  },
  {
    title: 'Culture Tour',
    description: 'Explore the traditional Yu Garden, wander Old Shanghai streets, and taste famous local pan-fried dumplings.'
  },
  {
    title: 'Return',
    description: 'Enjoy free morning leisure time before catching your airport transfer for your flight home.'
  }
],
  },
  {
    id: 23,
    title: 'Shanghai & Suzhou Cultural Discovery',
    overview: 'A perfect combination package for families and friends to visit modern Shanghai and the classical traditional gardens of Suzhou.',
    price: '2,950,000 MMK',
    duration: '5Days / 4Nights',
    group_size: '2-10 People',
    hotel: '',
    rating: '4.9',
    reviews: '240',
    type: 'international',
    level: 'standard',
    city: 'Shanghai',
    country: 'China',
    type: 'international',
    image:
      'https://plus.unsplash.com/premium_photo-1664299326174-f73b66496733?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
  {
    title: 'Arrival',
    description: 'Receive an airport pickup on arrival and transfer to your 4-star hotel in Shanghai.'
  },
  {
    title: 'Shanghai Tour',
    description: 'Take in panoramic views from Shanghai Tower and enjoy scenic city sightseeing at The Bund.'
  },
  {
    title: 'Suzhou Visit',
    description: 'Board a high-speed train to Suzhou to tour its world-famous classical UNESCO gardens.'
  },
  {
    title: 'Water Town',
    description: 'Immerse yourself in history with a traditional rowboat experience at Zhujiajiao Ancient Water Town.'
  },
  {
    title: 'Return',
    description: 'Do some last-minute souvenir shopping before transferring to the airport for your departure.'
  }
],
  },
  {
    id: 24,
    title: 'Shanghai Luxury Skyline ',
    overview: 'A premium package specially curated for honeymooners and luxury travelers, featuring high skyline views, VIP shopping, and a luxury river cruise.',
    price: '4,850,000 MMK',
    duration: '5Days / 4Nights',
    group_size: '2-4 People',
    hotel: '',
    rating: '5.0',
    reviews: '95',
    type: 'international',
    level: 'premium',
    city: 'Shanghai',
    country: 'China',
    type: 'international',
    image:
      'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&q=80&w=600',
    thumbnail_images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600',
    ],
    itinerary: [
  {
    title: 'VIP Arrival',
    description: 'Step into a private limousine pickup at the airport and check-in to a luxury Bund-view hotel room.'
  },
  {
    title: 'Skyline Tour',
    description: 'Access the VIP observation deck at Shanghai Tower followed by a private guided city tour.'
  },
  {
    title: 'Luxury Cruise',
    description: 'Board an exclusive private yacht cruise along the Huangpu River paired with fine dining.'
  },
  {
    title: 'Premium Shopping',
    description: 'Shop with a personal assistant at the prestigious IFC Mall featuring elite global luxury brands.'
  },
  {
    title: 'Return',
    description: 'Enjoy executive check-out and head to the airport via private chauffeur service.'
  }
],
  },
]

function formatMMK(price) {
  if (!price) return '0 MMK'
  return price.toString()
}

function loadPackage() {
  loading.value = true
  try {
    const targetId = route.params.id
    const found = packagesDataset.find((p) => p.id == targetId)

    if (found) {
      pkg.value = found
      selectedImg.value = found.image
    } else {
      pkg.value = null
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// function handleBook() {
//   // 💡 id နေရာမှာ route.params.id ကို သုံးပြီး လမ်းကြောင်းမှန်အောင် ပြင်ထားပါတယ်
//   router.push('/packagedetail/' + route.params.id)
// }
// handleBook function ကို ရှာပြီး အောက်ကအတိုင်း ပြောင်းရေးပါ
const handleBook = () => {
  if (pkg.value && pkg.value.id) {
    router.push({ name: 'booking', params: { id: pkg.value.id } })
  }
}

function toggleWishlist() {
  inWishlist.value = !inWishlist.value
}

onMounted(loadPackage)
watch(() => route.params.id, loadPackage)
</script>

<style scoped>
/* CSS styles များကို နဂိုအတိုင်း ချန်လှပ်ထားပါသည် */
.detail-page {
  background: #f8fafc;
  min-height: 100vh;
  padding: 120px 20px 60px;
}
.detail-container {
  max-width: 1060px;
  margin: 0 auto;
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
.back-btn:hover {
  color: #2563eb;
}
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
  align-items: start;
}
@media (max-width: 900px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
}
.detail-left {
  display: flex;
  flex-direction: column;
}
.pkg-title {
  font-size: 26px;
  font-weight: 900;
  color: #0f172a;
  margin: 0 0 10px;
}
.pkg-meta-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 18px;
}
.pkg-location {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #64748b;
}
.pkg-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}
.rat-val {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
.rat-cnt {
  font-size: 13px;
  color: #94a3b8;
}
.hero-img-wrap {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 12px;
}
.hero-img {
  height: 380px;
  width: 100%;
  object-fit: cover;
  border-radius: 18px;
}
.pkg-type-tag {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  z-index: 2;
}
.tag-green {
  background: #dcfce7;
  color: #15803d;
}
.tag-blue {
  background: #dbeafe;
  color: #1d4ed8;
}
.thumbs-strip {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}
/* thumb image size */
.thumb {
  width: 160px;
  height: 70px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 2.5px solid transparent;
  transition: border-color 0.2s;
}
.thumb.active {
  border-color: #2563eb;
}
.thumb-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.content-block {
  margin-bottom: 32px;
}
.block-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 14px;
}
.overview-text {
  font-size: 14px;
  color: #64748b;
  line-height: 1.8;
}
.itinerary-list {
  display: flex;
  flex-direction: column;
}
.itin-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.itin-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  flex-shrink: 0;
}
.itin-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  color: white;
}
.dot-first {
  background: #16a34a;
}
.dot-num {
  font-size: 13px;
  font-weight: 800;
}
.itin-line {
  width: 2px;
  background: #cbd5e1;
  min-height: 50px;
  flex-grow: 1;
}
.itin-content {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px 18px;
  margin-bottom: 12px;
  flex: 1;
}
.itin-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 5px;
}
.itin-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}
.detail-right {
  position: sticky;
  top: 120px;
}
.pricing-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
.price-section {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 20px;
}
.price-amount {
  font-size: 26px;
  font-weight: 900;
  color: #16a34a;
}
.price-per {
  font-size: 13px;
  color: #94a3b8;
}
.divider {
  height: 1px;
  background: #f1f5f9;
  margin: 18px 0;
}
.specs-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}
.spec-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.spec-lbl {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  color: #64748b;
}
.spec-val {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}
.book-btn {
  width: 100%;
  background: #16a34a;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.2s;
}
.book-btn:hover {
  background: #15803d;
}
.wishlist-btn {
  width: 100%;
  background: none;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 11px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 14px;
  color: #94a3b8;
}
.not-found-link {
  background: #2563eb;
  color: #fff;
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 14px;
  text-decoration: none;
}
</style>
