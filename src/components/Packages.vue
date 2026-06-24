<template>
  <div class="packages-page-container">
    <div class="packages-hero-banner">
      <div class="banner-overlay"></div>
      <div class="banner-content">
        <h1 class="banner-title">Travel Packages</h1>
        <p class="banner-subtitle">Choose from domestic Myanmar trips or international adventures</p>
        
        <div class="search-bar-container">
          <span class="search-icon">🔍</span>
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
          <span class="tab-icon">🗂️</span> All Packages
        </button>
        <button 
          :class="['filter-tab-btn', { active: activeTab === 'domestic' }]" 
          @click="setActiveTab('domestic')"
        >
          <span class="tab-icon">📍</span> Domestic Trips
        </button>
        <button 
          :class="['filter-tab-btn', { active: activeTab === 'international' }]" 
          @click="setActiveTab('international')"
        >
          <span class="tab-icon">🌐</span> International Trips
        </button>
      </div>
    </div>

    <main class="packages-grid-section">
      <div class="container-max">
        <div v-if="activeTab === 'all' && filteredAllPackages.length > 0" class="all-packages-layout">
          <div class="packages-grid-layout">
            <div 
              v-for="pkg in filteredAllPackages" 
              :key="pkg.id" 
              class="package-premium-card"
            >
              <div class="card-image-box">
                <img :src="pkg.image" :alt="pkg.title" class="pkg-display-img" />
                <span :class="['pkg-type-badge', pkg.type]">
                  {{ pkg.type === 'domestic' ? 'Domestic' : 'International' }}
                </span>
              </div>

              <div class="card-body-content">
                <h3 class="pkg-card-title">{{ pkg.title }}</h3>
                <div class="pkg-location-row">📍 {{ pkg.city }}, {{ pkg.country }}</div>
                
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
          <div v-for="(packages, groupName) in filteredGroupedPackages" :key="groupName" class="location-group">
            <div class="location-header">
              <span class="location-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#10B981">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </span>
              <h2 class="location-title">{{ groupName }}</h2>
              <span class="location-country">{{ packages[0].country }}</span>
            </div>

            <div class="packages-grid-layout">
              <div 
                v-for="pkg in packages" 
                :key="pkg.id" 
                class="package-premium-card"
              >
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'PackagesView',
  setup() {
    const route = useRoute()
    const activeTab = ref('all')
    const searchQuery = ref('') // Search စာသား သိမ်းဆည်းရန် Variable

   const packagesData = ref([
  
      // --- Hpa An Trips --- (ပုံများ မပြောင်းလဲပါ)
      {
        id: 1,
        title: 'Hpa-An Explore',
        price: '195,000 MMK',
        duration: '3 Days / 2 Nights',
        group_size: '2 - 10 People',
        rating: '4.7',
        reviews: '45',
        type: 'domestic',
        level: 'budget',
        city: 'Hpa An',
        country: 'Myanmar',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKM47OeGkz0jR-u1pXERcqjcANzdiJW8Qwlf-ADoF4QGplTaPI9TLIppc&s=10'
      },
      {
        id: 2,
        title: 'Hpa-An Adventure',
        price: '390,000 MMK',
        duration: '4Days / 3Nights',
        group_size: '2-8 People',
        rating: '4.8',
        reviews: '72',
        type: 'domestic',
        level: 'standard',
        city: 'Hpa An',
        country: 'Myanmar',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC2F6dkl--5ZgGST33-gDENeFeDjfWokz5G0caN9E_sHarjggPWSNBUe0&s=10'
      },
      {
        id: 3,
        title: 'Hpa-An Luxury Retreat ',
        price: '950,000 MMK',
        duration: '5Days / 4Nights',
        group_size: '2-8 People',
        rating: '5.0',
        reviews: '38',
        type: 'domestic',
        level: 'premium',
        city: 'Hpa An',
        country: 'Myanmar',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhKjPwzLJT5EpxUj3ligmXhDLn6WOAxCdc3aoTQSiz8MhKwdmJxb3xOIkU&s=10'
      },
      // --- Bagan Trips --- (Bagan စေတီပုထိုးပုံများ)
      {
        id: 4,
        title: 'Bagan Heritage Exolore',
        price: '650,000 MMK',
        duration: '3Days / 2Nights',
        group_size: '2-15 People',
        rating: '4.8',
        reviews: '180',
        type: 'domestic',
        level: 'budget',
        city: 'Bagan',
        country: 'Myanmar',
        image: 'https://images.unsplash.com/photo-1611005886618-bfe24df4ef39?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 5,
        title: 'Bagan Cultural Discover',
        price: '950,000 MMK',
        duration: '4Days / 3Nights',
        group_size: '2-12 People',
        rating: '4.9',
        reviews: '220',
        type: 'domestic',
        level: 'standard',
        city: 'Bagan',
        country: 'Myanmar',
        image: 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 6,
        title: 'Bagan Royal',
        price: '1,850,000 MMK',
        duration: '4Days / 3Nights',
        group_size: '2-4 People(Private)',
        rating: '5',
        reviews: '62',
        type: 'domestic',
        level: 'premium',
        city: 'Bagan',
        country: 'Myanmar',
        image: 'https://images.unsplash.com/photo-1512411030090-b18420b9b3e1?auto=format&fit=crop&q=80&w=600'
      },
      // --- Ngwe Saung Trips --- (ငွေဆောင် ကမ်းခြေပုံများ)
      {
        id: 7,
        title: 'Ngwe Saung Costal Escape',
        price: '750,000 MMK',
        duration: '4Days / 3Nights',
        group_size: '2-20 People',
        rating: '4.5',
        reviews: '126',
        type: 'domestic',
        level: 'budget',
        city: 'Ngwe Saung',
        country: 'Myanmar',
        image: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 8,
        title: 'Ngwe Saung Coastal Experience',
        price: '1,200,000 MMK',
        duration: '5Days / 4Nights',
        group_size: '2-15 People',
        rating: '4.8',
        reviews: '246',
        type: 'domestic',
        level: 'standard',
        city: 'Ngwe Saung',
        country: 'Myanmar',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 9,
        title: 'Ngwe Saung Ocean Prestige',
        price: '2,200,000 MMK',
        duration: '5Days / 4Nights',
        group_size: '2-8 People',
        rating: '4.9',
        reviews: '89',
        type: 'domestic',
        level: 'premium',
        city: 'Ngwe Saung',
        country: 'Myanmar',
        image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=600'
      },
      // --- Kalaw Trips --- (ကလော တောင်တန်း၊ တောင်တက်ပုံများ)
      {
        id: 10,
        title: 'Kalaw Trekking',
        price: '420,000 MMK',
        duration: '3Days / 2Nigts',
        group_size: '2-12 People',
        rating: '4.7',
        reviews: '135',
        type: 'domestic',
        level: 'budget',
        city: 'Kalaw',
        country: 'Myanmar',
        image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 11,
        title: 'Kalaw Advanture',
        price: '720,000 MMK',
        duration: '4Days / 3Nights',
        group_size: '2-10 People',
        rating: '4.9',
        reviews: '185',
        type: 'domestic',
        level: 'standard',
        city: 'Kalaw',
        country: 'Myanmar',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 12,
        title: 'Kalaw Luxury Retreat',
        price: '1,250,000 MMK',
        duration: '5Days / 4Nights',
        group_size: '2-6 People',
        rating: '5',
        reviews: '29',
        type: 'domestic',
        level: 'premium',
        city: 'Kalaw',
        country: 'Myanmar',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600'
      },

      // --- Thailand Trips --- (ဘန်ကောက်၊ ချင်းမိုင်၊ ဖူးခက် ပုံများ)
      {
        id: 13,
        title: 'Bangkok City Tour',
        price: '1,650,000 MMK',
        duration: '4Days / 3Nights',
        group_size: '2-12 People',
        rating: '4.6',
        reviews: '112',
        type: 'international',
        level: 'budget',
        city: 'Bangkok',
        country: 'Thailand',
        image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 14,
        title: 'Chiang Mai Cultural Heritage',
        price: '2,550,000 MMK',
        duration: '5Days / 4Nights',
        group_size: '2-10 People',
        rating: '4.8',
        reviews: '150',
        type: 'international',
        level: 'standard',
        city: 'Chiang Mai',
        country: 'Thailand',
        image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 15,
        title: 'Phuket Luxury Island Resort',
        price: '4,450,000 MMK',
        duration: '5Days / 4Nights',
        group_size: '2-4 People',
        rating: '5.0',
        reviews: '85',
        type: 'international',
        level: 'premium',
        city: 'Phuket',
        country: 'Thailand',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600'
      },
      // --- Japan Trips --- (တိုကျို၊ ဖူဂျီတောင်၊ အိုဆာကာ/ကျိုတို ပုံများ)
      {
        id: 16,
        title: 'Tokyo City Explore',
        price: '3,250,000 MMK',
        duration: '5Days / 4Nights',
        group_size: '2-10 People',
        rating: '4.8',
        reviews: '142',
        type: 'international',
        level: 'budget',
        city: 'Tokyo',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 17,
        title: 'Tokyo Mount Fuji Advanture',
        price: '4,250,000 MMK',
        duration: '6Days / 5Nights',
        group_size: '2-10 People',
        rating: '4.9',
        reviews: '198',
        type: 'international',
        level: 'standard',
        city: 'Tokyo',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 18,
        title: 'Osaka & Kyoto Cherry Blossom Tour',
        price: '6,850,000 MMK',
        duration: '7Days / 6Nights',
        group_size: '2-6 People',
        rating: '5.0',
        reviews: '53',
        type: 'international',
        level: 'premium',
        city: 'Osaka',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600'
      },
      // --- Singapore Trips --- (စင်ကာပူ မြို့ပြနှင့် ခရီးသွားနေရာပုံများ)
      {
        id: 19,
        title: 'Singapore City Escape',
        price: '2,850,000 MMK',
        duration: '4Days / 3Nights',
        group_size: '2-25 People',
        rating: '4.6',
        reviews: '112',
        type: 'international',
        level: 'budget',
        city: 'Singapore',
        country: 'Singapore',
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 20,
        title: 'Singapore Advanture',
        price: '3,850,000 MMK',
        duration: '5Days / 4Nights',
        group_size: '2-20 People',
        rating: '4.8',
        reviews: '128',
        type: 'international',
        level: 'standard',
        city: 'Singapore',
        country: 'Singapore',
        image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 21,
        title: 'Singapore Luxury Prestige Escape',
        price: '6,500,000 MMK',
        duration: '5Days / 4Nights',
        group_size: '2-6 People',
        rating: '4.9',
        reviews: '156',
        type: 'international',
        level: 'premium',
        city: 'Singapore',
        country: 'Singapore',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600'
      },
      // --- China Trips --- (ရှန်ဟိုင်းနှင့် ဆူကျိုး မြို့ပုံများ)
      {
        id: 22,
        title: 'Shanghai City Explore',
        price: '1,950,000 MMK',
        duration: '4Days / 3Nights',
        group_size: '2-12 People',
        rating: '4.7',
        reviews: '165',
        type: 'international',
        level: 'budget',
        city: 'Shanghai',
        country: 'China',
        image: 'https://images.unsplash.com/photo-1548861216-1771f34ecf2a?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 23,
        title: 'Shanghai & Suzhou Cultural Discovery',
        price: '2,950,000 MMK',
        duration: '5Days / 4Nights',
        group_size: '2-10 People',
        rating: '4.9',
        reviews: '240',
        type: 'international',
        level: 'standard',
        city: 'Shanghai',
        country: 'China',
        image: 'https://images.unsplash.com/photo-1525596662741-e94ff9926de3?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 24,
        title: 'Shanghai Luxury Skyline ',
        price: '4,850,000 MMK',
        duration: '5Days / 4Nights',
        group_size: '2-4 People',
        rating: '5.0',
        reviews: '95',
        type: 'international',
        level: 'premium',
        city: 'Shanghai',
        country: 'China',
        image: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&q=80&w=600'
      }
    ])

    //  All Tab search bar
    const filteredAllPackages = computed(() => {
      if (!searchQuery.value) return packagesData.value
      
      const query = searchQuery.value.toLowerCase()
      return packagesData.value.filter(pkg => {
        return pkg.title.toLowerCase().includes(query) || 
               pkg.city.toLowerCase().includes(query) || 
               pkg.country.toLowerCase().includes(query) ||
               pkg.price.toLowerCase().includes(query) ||
               pkg.duration.toLowerCase().includes(query) ||
               pkg.group_size.toLowerCase().includes(query) ||
               pkg.level.toLowerCase().includes(query)
      })
    })

    // Domestic ,International Group ခွဲပြီး ရှာ
    const filteredGroupedPackages = computed(() => {
      if (activeTab.value === 'all') return {}
      
      // လက်ရှိဖွင့်ထားသော Tab အလိုက် Type ကို အရင်ခွဲထုတ်
      let filtered = packagesData.value.filter(pkg => pkg.type === activeTab.value)
      
      // Search Box ထဲ စာရိုက်ရင် ထပ်စစ်ပြီး Filter လုပ်
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(pkg => 
          pkg.title.toLowerCase().includes(query) || 
          pkg.city.toLowerCase().includes(query) || 
          pkg.country.toLowerCase().includes(query) ||
          pkg.price.toLowerCase().includes(query) ||
          pkg.duration.toLowerCase().includes(query) ||
          pkg.group_size.toLowerCase().includes(query) ||
          pkg.level.toLowerCase().includes(query)
        )
      }

      const groups = {}
      filtered.forEach(pkg => {
        // Domestic ဆိုရင် 'city' (မြို့) အလိုက်၊ International ဆိုလျှင် 'country'အလိုက် ခေါင်းစဉ်ခွဲရန်
        const key = activeTab.value === 'domestic' ? pkg.city : pkg.country
        if (!groups[key]) {
          groups[key] = []
        }
        groups[key].push(pkg)
      })
      return groups
    })

    const setActiveTab = (tab) => {
      activeTab.value = tab
    }

    const checkRouteQuery = () => {
      if (route.query.type === 'domestic' || route.query.type === 'international' || route.query.type === 'all') {
        activeTab.value = route.query.type
      }
    }

    onMounted(() => {
      checkRouteQuery()
    })

    watch(() => route.query.type, () => {
      checkRouteQuery()
    })

    return {
      activeTab,
      searchQuery,
      filteredAllPackages,
      filteredGroupedPackages,
      setActiveTab
    }
  }
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
  background: #0B192C;
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
  color: #64748B;
}

.search-input {
  width: 100%;
  padding: 15px 16px 15px 48px;
  border-radius: 50px;
  border: 1px solid #E2E8F0;
  background: white;
  color: #0F172A;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.25s ease;
}

.search-input:focus {
  box-shadow: 0 4px 22px rgba(37, 99, 235, 0.25);
  border-color: #2563EB;
}

.filter-controls-section {
  display: flex;
  justify-content: flex-start;
  max-width: 1200px;
  margin: 30px auto 10px auto;
  padding: 0 24px;
  border-bottom: 1px solid #E2E8F0;
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
  color: #64748B;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-tab-btn.active {
  color: #1E3A8A;
  font-weight: 700;
}

.filter-tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #1E3A8A;
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
  color: #0F172A;
  margin: 0;
}

.location-country {
  font-size: 12px;
  color: #2563EB;
  background: #EFF6FF;
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
  border: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
}

.card-image-box {
  position: relative;
  height: 190px;
  width: 100%;
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

.pkg-type-badge.domestic { background: #10B981; }
.pkg-type-badge.international { background: #3B82F6; }

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

.pkg-level-badge.budget { background: #FEF3C7; color: #D97706; }
.pkg-level-badge.standard { background: #DBEAFE; color: #2563EB; }
.pkg-level-badge.premium { background: #F3E8FF; color: #9333EA; }

.card-body-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.pkg-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 6px 0;
}

.pkg-location-row {
  font-size: 13px;
  color: #64748B;
  margin-bottom: 10px;
}

.pkg-meta-row {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #64748B;
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
  color: #1E293B;
}

.review-count {
  color: #94A3B8;
}

.pkg-card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #F1F5F9;
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.price-amount {
  font-size: 15px;
  font-weight: 800;
  color: #10B981;
}

.price-label {
  font-size: 11px;
  color: #94A3B8;
}

.btn-view-details {
  background: #2563EB;
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
  background: #1D4ED8;
}

.no-packages-found {
  text-align: center;
  padding: 60px 0;
  color: #64748B;
  font-weight: 600;
}
</style>