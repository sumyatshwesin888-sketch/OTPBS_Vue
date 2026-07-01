<template>
  <div class="packages-page-container">
    <div class="packages-hero-banner">
      <div class="banner-overlay"></div>
      <div class="banner-content">
        <h1 class="banner-title">Travel Packages</h1>
        <p class="banner-subtitle">
          Choose from domestic Myanmar trips or international adventures
        </p>

        <div class="search-bar-container">
          <v-icon class="search-icon" size="18" color="#64748B">mdi-magnify</v-icon>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title, city, country, price, duration or group..."
            class="search-input"
          />
        </div>
      </div>
    </div>

    <div class="filter-controls-section">
      <div class="tabs-wrapper">
        <button
          :class="['filter-tab-btn', { active: activeTab === 'all' }]"
          @click="setActiveTab('all')"
        >
          <v-icon size="18" class="mr-1">mdi-magnify</v-icon> All Packages
        </button>
        <button
          :class="['filter-tab-btn', { active: activeTab === 'domestic' }]"
          @click="setActiveTab('domestic')"
        >
          <v-icon size="18" class="mr-1">mdi-map-marker</v-icon> Domestic Trips
        </button>
        <button
          :class="['filter-tab-btn', { active: activeTab === 'international' }]"
          @click="setActiveTab('international')"
        >
          <v-icon size="18" class="mr-1">mdi-earth</v-icon> International Trips
        </button>
      </div>
    </div>

    <main class="packages-grid-section">
      <div class="container-max">
        <div
          v-if="activeTab === 'all' && filteredAllPackages.length > 0"
          class="all-packages-layout"
        >
          <div class="packages-grid-layout">
            <div v-for="pkg in filteredAllPackages" :key="pkg.id" class="package-premium-card">
              <div class="card-image-box">
                <img :src="pkg.image" :alt="pkg.title" class="pkg-display-img" />
                <span :class="['pkg-type-badge', pkg.type]">
                  {{ pkg.type === 'domestic' ? 'Domestic' : 'International' }}
                </span>
              </div>

              <div class="card-body-content">
                <h3 class="pkg-card-title">{{ pkg.title }}</h3>
                <div class="pkg-location-row d-flex align-center">
                  <v-icon size="14" color="#64748B" class="mr-1">mdi-map-marker</v-icon>
                  {{ pkg.city }}, {{ pkg.country }}
                </div>

                <div class="pkg-meta-row">
                  <span class="pkg-duration">🕒 {{ pkg.duration }}</span>
                  <span class="pkg-group">👥 {{ pkg.group_size }}</span>
                </div>

                <div class="pkg-rating-row">
                  <span class="star-icon">⭐</span>
                  <span class="rating-val">{{ pkg.rating }}</span>
                  <span class="review-count">({{ pkg.reviews }})</span>
                </div>

                <div class="pkg-card-footer">
                  <div class="price-container">
                    <span class="price-amount">{{ pkg.price }}</span>
                    <span class="price-label">/ person</span>
                  </div>
                  <router-link :to="`/packagedetail/${pkg.id}`" class="btn-view-details">
                    View Details
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab !== 'all' && Object.keys(filteredGroupedPackages).length > 0">
          <div
            v-for="(packages, groupName) in filteredGroupedPackages"
            :key="groupName"
            class="location-group"
          >
            <div class="location-header">
              <v-icon
                :color="activeTab === 'domestic' ? '#10B981' : '#3B82F6'"
                size="22"
                class="mr-1"
              >
                {{ activeTab === 'domestic' ? 'mdi-map-marker' : 'mdi-earth' }}
              </v-icon>

              <h2 class="location-title">{{ groupName }}</h2>

              <span class="location-country">{{ packages[0].country }}</span>
            </div>

            <div class="packages-grid-layout">
              <div v-for="pkg in packages" :key="pkg.id" class="package-premium-card">
                <div class="card-image-box">
                  <img :src="pkg.image" :alt="pkg.title" class="pkg-display-img" />
                  <span :class="['pkg-level-badge', pkg.level]">
                    {{ pkg.level }}
                  </span>
                </div>

                <div class="card-body-content">
                  <h3 class="pkg-card-title">{{ pkg.title }}</h3>

                  <div class="pkg-meta-row">
                    <span class="pkg-duration">🕒 {{ pkg.duration }}</span>
                    <span class="pkg-group">👥 {{ pkg.group_size }}</span>
                  </div>

                  <div
                    class="pkg-ticket-status"
                    style="font-size: 13px; margin-top: 4px; margin-bottom: 12px"
                  >
                    <span
                      v-if="pkg.available_tickets > 0"
                      :style="{
                        color: pkg.available_tickets <= 5 ? '#ef4444' : '#10b981',
                        fontWeight: '600',
                      }"
                    >
                      🎟️ {{ pkg.available_tickets }} Tickets Left
                    </span>
                    <span v-else style="color: #ef4444; font-weight: 600"> 🚫 Out Of Stock </span>
                  </div>

                  <div class="pkg-rating-row">
                    <span class="star-icon">⭐</span>
                    <span class="rating-val">{{ pkg.rating }}</span>
                    <span class="review-count">({{ pkg.reviews }})</span>
                  </div>

                  <div class="pkg-card-footer">
                    <div class="price-container">
                      <span class="price-amount">{{ pkg.price }}</span>
                      <span class="price-label">/ person</span>
                    </div>
                    <router-link :to="`/packagedetail/${pkg.id}`" class="btn-view-details">
                      View Details
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="no-packages-found">
          <p>No travel packages found matching your criteria.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'PackagesView',
  data() {
    return {
      activeTab: 'all',
      searchQuery: '', // Search စာသား သိမ်းဆည်းရန် Variable
      packagesData: []
    }
  },
        // --- Hpa An Trips ---
  created(){
        // ၁။ Browser (localStorage) ထဲမှာ data ရှိပြီးသားလား စစ်မယ်
    const savedPackages = localStorage.getItem('travel_packages');

    if (savedPackages) {
      // ရှိရင် အဲ့ဒီ data ကို ယူသုံးမယ် (ဒါမှ ဝယ်ထားတဲ့ လက်ကျန်တွေ ပါလာမှာပါ)
      this.packagesData = JSON.parse(savedPackages);
    } else {
      // မရှိသေးရင် (App စဖွင့်ချင်းဆိုရင်) data ကို အသစ်သတ်မှတ်ပြီး localStorage ထဲ သိမ်းမယ်
      const defaultPackages = [

      // {
      //     id: 1,
      //     title: 'Hpa-An Explore',
      //     price: '195,000 MMK',
      //     duration: '3 Days / 2 Nights',
      //     group_size: '2 - 10 People',
      //     rating: '4.7',
      //     reviews: '45',
      //     type: 'domestic',
      //     level: 'budget',
      //     city: 'Hpa An',
      //     country: 'Myanmar',
      //     image:
      //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKM47OeGkz0jR-u1pXERcqjcANzdiJW8Qwlf-ADoF4QGplTaPI9TLIppc&s=10',
      //     available_tickets: 20,
      //   },
      //   {
      //     id: 2,
      //     title: 'Hpa-An Adventure',
      //     price: '390,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-8 People',
      //     rating: '4.8',
      //     reviews: '72',
      //     type: 'domestic',
      //     level: 'standard',
      //     city: 'Hpa An',
      //     country: 'Myanmar',
      //     image:
      //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC2F6dkl--5ZgGST33-gDENeFeDjfWokz5G0caN9E_sHarjggPWSNBUe0&s=10',
      //     available_tickets: 18,
      //   },
      //   {
      //     id: 3,
      //     title: 'Hpa-An Luxury Retreat ',
      //     price: '950,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-8 People',
      //     rating: '5.0',
      //     reviews: '38',
      //     type: 'domestic',
      //     level: 'premium',
      //     city: 'Hpa An',
      //     country: 'Myanmar',
      //     image:
      //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhKjPwzLJT5EpxUj3ligmXhDLn6WOAxCdc3aoTQSiz8MhKwdmJxb3xOIkU&s=10',
      //     available_tickets: 10,
      //   },
      //   // --- Bagan Trips ---
      //   {
      //     id: 4,
      //     title: 'Bagan Heritage & Sunset Exolore',
      //     price: '650,000 MMK',
      //     duration: '3Days / 2Nights',
      //     group_size: '2-15 People',
      //     rating: '4.8',
      //     reviews: '180',
      //     type: 'domestic',
      //     level: 'budget',
      //     city: 'Bagan',
      //     country: 'Myanmar',
      //     image:
      //       'https://images.unsplash.com/photo-1599403275295-57bca684efd3?q=80&w=1041&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      //     available_tickets: 20,
      //   },
      //   {
      //     id: 5,
      //     title: 'Bagan Cultural Discovery & River Experience',
      //     price: '950,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-12 People',
      //     rating: '4.9',
      //     reviews: '220',
      //     type: 'domestic',
      //     level: 'standard',
      //     city: 'Bagan',
      //     country: 'Myanmar',
      //     image:
      //       'https://images.unsplash.com/photo-1515900959941-d1cce424f5c4?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      //     available_tickets: 18,
      //   },
      //   {
      //     id: 6,
      //     title: 'Bagan Royal Balloon & Luxury Escape',
      //     price: '1,850,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-4 People(Private)',
      //     rating: '5',
      //     reviews: '62',
      //     type: 'domestic',
      //     level: 'premium',
      //     city: 'Bagan',
      //     country: 'Myanmar',

      //     image:
      //       'https://media.istockphoto.com/id/614446038/photo/hot-air-balloons-in-bagan-myanmar.jpg?s=612x612&w=0&k=20&c=nlxHdhqgEUUw_5M0dRlfhzHvjQG_epUqzLyUjcJJKmw=',
      //     available_tickets: 10,
      //   },
      //   // --- Ngwe Saung Trips ---
      //   {
      //     id: 7,
      //     title: 'Ngwe Saung Costal Escape',
      //     price: '750,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-20 People',
      //     rating: '4.5',
      //     reviews: '126',
      //     type: 'domestic',
      //     level: 'budget',
      //     city: 'Ngwe Saung',
      //     country: 'Myanmar',
      //     image: 'https://www.mcs-myanmartravel.com/wp-content/uploads/2015/07/ngwesaung.jpg',
      //     available_tickets: 20,
      //   },
      //   {
      //     id: 8,
      //     title: 'Ngwe Saung Coastal Experience',
      //     price: '1,200,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-15 People',
      //     rating: '4.8',
      //     reviews: '246',
      //     type: 'domestic',
      //     level: 'standard',
      //     city: 'Ngwe Saung',
      //     country: 'Myanmar',
      //     image:
      //       'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/30/d2/d1/eskala-hotels-resorts.jpg?w=1200&h=-1&s=1',
      //     available_tickets: 18,
      //   },
      //   {
      //     id: 9,
      //     title: 'Ngwe Saung Ocean Prestige',
      //     price: '2,200,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-8 People',
      //     rating: '4.9',
      //     reviews: '89',
      //     type: 'domestic',
      //     level: 'premium',
      //     city: 'Ngwe Saung',
      //     country: 'Myanmar',
      //     image:
      //       'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=600',
      //     available_tickets: 10,
      //   },
      //   // --- Kalaw Trips ---
      //   {
      //     id: 10,
      //     title: 'Kalaw Nature & Trekking Experience',
      //     price: '420,000 MMK',
      //     duration: '3Days / 2Nigts',
      //     group_size: '2-12 People',
      //     rating: '4.7',
      //     reviews: '135',
      //     type: 'domestic',
      //     level: 'budget',
      //     city: 'Kalaw',
      //     country: 'Myanmar',
      //     image:
      //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSRG9FCoqjY-LUvTY_RQJ2EDSYiZIuv5pdTN22nhTS-g&s=10',
      //     available_tickets: 20,
      //   },
      //   {
      //     id: 11,
      //     title: 'Kalaw & Inle Scenic Adventure',
      //     price: '720,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-10 People',
      //     rating: '4.9',
      //     reviews: '185',
      //     type: 'domestic',
      //     level: 'standard',
      //     city: 'Kalaw',
      //     country: 'Myanmar',
      //     image:
      //       'https://indochinatreks.com/wp-content/uploads/2022/12/12.-Kalaw-inle-lake-fishermen-istock.jpg',
      //     available_tickets: 18,
      //   },
      //   {
      //     id: 12,
      //     title: 'Kalaw Luxury Mountain Retreat',
      //     price: '1,250,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-6 People',
      //     rating: '5',
      //     reviews: '29',
      //     type: 'domestic',
      //     level: 'premium',
      //     city: 'Kalaw',
      //     country: 'Myanmar',
      //     image:
      //       'https://i.travelapi.com/lodging/16000000/15660000/15651600/15651577/182bbc8c_z.jpg',
      //     available_tickets: 10,
      //   },
      //   // --- Thailand Trips ---
      //   {
      //     id: 13,
      //     title: 'Bangkok City Tour',
      //     price: '1,650,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-12 People',
      //     rating: '4.6',
      //     reviews: '112',
      //     type: 'international',
      //     level: 'budget',
      //     city: 'Bangkok',
      //     country: 'Thailand',
      //     image:
      //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZcLJa-cWwqzjwGQIJuINkTQ1ccor6N8ADP42u7BMhHZTdZmuumbOGCN_y&s=10',
      //     available_tickets: 20,
      //   },
      //   {
      //     id: 14,
      //     title: 'Chiang Mai Cultural Heritage',
      //     price: '2,550,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-10 People',
      //     rating: '4.8',
      //     reviews: '150',
      //     type: 'international',
      //     level: 'standard',
      //     city: 'Chiang Mai',
      //     country: 'Thailand',
      //     image:
      //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsuqSWfs1NiHiKGMVxXP2vsi7f942K7nR-Pl7jYYKLuyFpTEKALyz1DdY&s=10',
      //     available_tickets: 18,
      //   },
      //   {
      //     id: 15,
      //     title: 'Phuket Luxury Island Resort',
      //     price: '4,450,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-4 People',
      //     rating: '5.0',
      //     reviews: '85',
      //     type: 'international',
      //     level: 'premium',
      //     city: 'Phuket',
      //     country: 'Thailand',
      //     image:
      //       'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=801&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      //     available_tickets: 10,
      //   },
      //   // --- Japan Trips ---
      //   {
      //     id: 16,
      //     title: 'Tokyo City Explore',
      //     price: '3,250,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-10 People',
      //     rating: '4.8',
      //     reviews: '142',
      //     type: 'international',
      //     level: 'budget',
      //     city: 'Tokyo',
      //     country: 'Japan',
      //     image:
      //       'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600',
      //     available_tickets: 20,
      //   },
      //   {
      //     id: 17,
      //     title: 'Tokyo Mount Fuji Advanture',
      //     price: '4,250,000 MMK',
      //     duration: '6Days / 5Nights',
      //     group_size: '2-10 People',
      //     rating: '4.9',
      //     reviews: '198',
      //     type: 'international',
      //     level: 'standard',
      //     city: 'Tokyo',
      //     country: 'Japan',
      //     image:
      //       'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600',
      //     available_tickets: 18,
      //   },
      //   {
      //     id: 18,
      //     title: 'Osaka & Kyoto Cherry Blossom Tour',
      //     price: '6,850,000 MMK',
      //     duration: '6Days / 5Nights',
      //     group_size: '2-6 People',
      //     rating: '5.0',
      //     reviews: '53',
      //     type: 'international',
      //     level: 'premium',
      //     city: 'Osaka',
      //     country: 'Japan',
      //     image:
      //       'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600',
      //     available_tickets: 10,
      //   },
      //   // --- Singapore Trips ---
      //   {
      //     id: 19,
      //     title: 'Singapore City Escape',
      //     price: '2,850,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-25 People',
      //     rating: '4.6',
      //     reviews: '112',
      //     type: 'international',
      //     level: 'budget',
      //     city: 'Singapore',
      //     country: 'Singapore',
      //     image:
      //       'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=600',
      //     available_tickets: 20,
      //   },
      //   {
      //     id: 20,
      //     title: 'Singapore Advanture',
      //     price: '3,850,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-20 People',
      //     rating: '4.8',
      //     reviews: '128',
      //     type: 'international',
      //     level: 'standard',
      //     city: 'Singapore',
      //     country: 'Singapore',
      //     image:
      //       'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=80&w=600',
      //     available_tickets: 18,
      //   },
      //   {
      //     id: 21,
      //     title: 'Singapore Luxury Prestige Escape',
      //     price: '6,500,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-6 People',
      //     rating: '4.9',
      //     reviews: '156',
      //     type: 'international',
      //     level: 'premium',
      //     city: 'Singapore',
      //     country: 'Singapore',
      //     image:
      //       'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600',
      //     available_tickets: 10,
      //   },
      //   // --- China Trips ---
      //   {
      //     id: 22,
      //     title: 'Shanghai City Explore',
      //     price: '1,950,000 MMK',
      //     duration: '4Days / 3Nights',
      //     group_size: '2-12 People',
      //     rating: '4.7',
      //     reviews: '165',
      //     type: 'international',
      //     level: 'budget',
      //     city: 'Shanghai',
      //     country: 'China',
      //     image:
      //       'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&w=800&q=80',
      //     available_tickets: 20,
      //   },
      //   {
      //     id: 23,
      //     title: 'Shanghai & Suzhou Cultural Discovery',
      //     price: '2,950,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-10 People',
      //     rating: '4.9',
      //     reviews: '240',
      //     type: 'international',
      //     level: 'standard',
      //     city: 'Shanghai',
      //     country: 'China',
      //     image:
      //       'https://plus.unsplash.com/premium_photo-1664299326174-f73b66496733?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      //     available_tickets: 18,
      //   },
      //   {
      //     id: 24,
      //     title: 'Shanghai Luxury Skyline ',
      //     price: '4,850,000 MMK',
      //     duration: '5Days / 4Nights',
      //     group_size: '2-4 People',
      //     rating: '5.0',
      //     reviews: '95',
      //     type: 'international',
      //     level: 'premium',
      //     city: 'Shanghai',
      //     country: 'China',
      //     image:
      //       'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&q=80&w=600',
      //     available_tickets: 10,
      //   },
      ]
      //this.packagesData = defaultPackages;
     // localStorage.setItem('travel_packages', JSON.stringify(defaultPackages));
    }
  },
  computed: {
    // All Tab search bar
    filteredAllPackages() {
      if (!this.searchQuery) return this.packagesData

      const query = this.searchQuery.toLowerCase()
      return this.packagesData.filter((pkg) => {
        return (
          pkg.title.toLowerCase().includes(query) ||
          pkg.city.toLowerCase().includes(query) ||
          pkg.country.toLowerCase().includes(query) ||
          pkg.price.toLowerCase().includes(query) ||
          pkg.duration.toLowerCase().includes(query) ||
          pkg.group_size.toLowerCase().includes(query) ||
          pkg.level.toLowerCase().includes(query)
        )
      })
    },
    // Domestic, International Group ခွဲပြီး ရှာ
    filteredGroupedPackages() {
      if (this.activeTab === 'all') return {}

      // လက်ရှိဖွင့်ထားသော Tab အလိုက် Type ကို အရင်ခွဲထုတ်
      let filtered = this.packagesData.filter((pkg) => pkg.type === this.activeTab)

      // Search Box ထဲ စာရိုက်ရင် ထပ်စစ်ပြီး Filter လုပ်
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (pkg) =>
            pkg.title.toLowerCase().includes(query) ||
            pkg.city.toLowerCase().includes(query) ||
            pkg.country.toLowerCase().includes(query) ||
            pkg.price.toLowerCase().includes(query) ||
            pkg.duration.toLowerCase().includes(query) ||
            pkg.group_size.toLowerCase().includes(query) ||
            pkg.level.toLowerCase().includes(query),
        )
      }

      const groups = {}
      filtered.forEach((pkg) => {
        // Domestic ဆိုရင် 'city' (မြို့) အလိုက်၊ International ဆိုလျှင် 'country'အလိုက် ခေါင်းစဉ်ခွဲရန်
        const key = this.activeTab === 'domestic' ? pkg.city : pkg.country
        if (!groups[key]) {
          groups[key] = []
        }
        groups[key].push(pkg)
      })
      return groups
    },
  },
  mounted() {
    this.checkRouteQuery()
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab
    },
    checkRouteQuery() {
      if (
        this.$route.query.type === 'domestic' ||
        this.$route.query.type === 'international' ||
        this.$route.query.type === 'all'
      ) {
        this.activeTab = this.$route.query.type
      }
    },
  },
  watch: {
    '$route.query.type'() {
      this.checkRouteQuery()
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.packages-page-container {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: #f8fafc;
  min-height: 100vh;
  width: 100%;
  padding-bottom: 80px;
}

.packages-hero-banner {
  position: relative;
  height: 340px;
  background: #0b192c;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.banner-content {
  position: relative;
  z-index: 5;
  padding: 0 20px;
  width: 100%;
  max-width: 650px;
}

.banner-title {
  font-size: 34px;
  font-weight: 800;
  margin-bottom: 8px;
}

.banner-subtitle {
  font-size: 15px;
  opacity: 0.8;
  margin-bottom: 26px;
}

/* Search Bar Style */
.search-bar-container {
  position: relative;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #64748b;
}

.search-input {
  width: 100%;
  padding: 15px 16px 15px 48px;
  border-radius: 50px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #0f172a;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.25s ease;
}

.search-input:focus {
  box-shadow: 0 4px 22px rgba(37, 99, 235, 0.25);
  border-color: #2563eb;
}

.filter-controls-section {
  display: flex;
  justify-content: flex-start;
  max-width: 1200px;
  margin: 30px auto 10px auto;
  padding: 0 24px;
  border-bottom: 1px solid #e2e8f0;
}

.tabs-wrapper {
  display: flex;
  gap: 30px;
}

.filter-tab-btn {
  border: none;
  background: transparent;
  padding: 12px 10px;
  font-size: 15px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-tab-btn.active {
  color: #1e3a8a;
  font-weight: 700;
}

.filter-tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #1e3a8a;
  border-radius: 2px 2px 0 0;
}

.all-packages-layout {
  margin-top: 30px;
}

.location-group {
  margin-top: 40px;
  margin-bottom: 20px;
}

.location-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.location-title {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.location-country {
  font-size: 12px;
  color: #2563eb;
  background: #eff6ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.container-max {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.packages-grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  width: 100%;
}

@media (max-width: 960px) {
  .packages-grid-layout {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .packages-grid-layout {
    grid-template-columns: 1fr;
  }
}

.package-premium-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;

  /* ✨ add this */
  transition: all 0.25s ease;
}

/* 👇 hover effect */
.package-premium-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: #cbd5e1;
}
.card-image-box img {
  transition: transform 0.3s ease;
}

.package-premium-card:hover .card-image-box img {
  transform: scale(1.05);
}

.pkg-display-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pkg-type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: white;
}

.pkg-type-badge.domestic {
  background: #10b981;
}
.pkg-type-badge.international {
  background: #3b82f6;
}

.pkg-level-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.pkg-level-badge.budget {
  background: #fef3c7;
  color: #d97706;
}
.pkg-level-badge.standard {
  background: #dbeafe;
  color: #2563eb;
}
.pkg-level-badge.premium {
  background: #f3e8ff;
  color: #9333ea;
}

.card-body-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.pkg-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.pkg-location-row {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 10px;
}

.pkg-meta-row {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
}

.pkg-rating-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  margin-bottom: 16px;
}

.rating-val {
  font-weight: 700;
  color: #1e293b;
}

.review-count {
  color: #94a3b8;
}

.pkg-card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.price-amount {
  font-size: 15px;
  font-weight: 800;
  color: #10b981;
}

.price-label {
  font-size: 11px;
  color: #94a3b8;
}

.btn-view-details {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-view-details:hover {
  background: #1d4ed8;
}

.no-packages-found {
  text-align: center;
  padding: 60px 0;
  color: #64748b;
  font-weight: 600;
}
</style>
