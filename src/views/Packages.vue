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
            placeholder="Search by title, location, price, duration or group..."
            class="search-input"
          />
        </div>
      </div>
    </div>

    <div class="filter-controls-section">
      <div class="tabs-wrapper">
        <button
          :class="['filter-tab-btn', { active: activeTab === 'ALL' }]"
          @click="setActiveTab('ALL')"
        >
          <v-icon size="18" class="mr-1">mdi-magnify</v-icon> All Packages
        </button>
        <button
          :class="['filter-tab-btn', { active: activeTab === 'DOMESTIC' }]"
          @click="setActiveTab('DOMESTIC')"
        >
          <v-icon size="18" class="mr-1">mdi-map-marker</v-icon> Domestic Trips
        </button>
        <button
          :class="['filter-tab-btn', { active: activeTab === 'INTERNATIONAL' }]"
          @click="setActiveTab('INTERNATIONAL')"
        >
          <v-icon size="18" class="mr-1">mdi-earth</v-icon> International Trips
        </button>
      </div>
    </div>

    <main class="packages-grid-section">
      <div class="container-max">
        <!--  ALL Tab တွင် ပြသမည့်ပုံစံ -->
        <div
          v-if="activeTab === 'ALL' && filteredAllPackages.length > 0"
          class="all-packages-layout"
        >
          <div class="packages-grid-layout">
            <div
              v-for="pkg in filteredAllPackages"
              :key="pkg.productId"
              class="package-premium-card"
            >
              <div class="card-image-box">
                <img :src="pkg.photo" :alt="pkg.title" class="pkg-display-img" />

                <span
                  v-if="pkg.locationType"
                  class="package-badge"
                  :class="
                    pkg.locationType === 'DOMESTIC' ? 'badge-domestic' : 'badge-international'
                  "
                >
                  {{ pkg.locationType }}
                </span>
              </div>

              <div class="card-body-content">
                <h3 class="pkg-card-title">{{ pkg.title }}</h3>
                <div class="pkg-location-row d-flex align-center">
                  <v-icon size="14" color="#64748B" class="mr-1">mdi-map-marker</v-icon>
                  {{ pkg.location || pkg.destination || pkg.city || 'Myanmar' }}
                </div>

                <div class="pkg-meta-row">
                  <span class="pkg-duration">🕒 {{ pkg.day }} Days/{{ pkg.night }} Nights</span>
                  <span class="pkg-group">👥 {{ pkg.groupSize }} People</span>
                </div>

                <div
                  class="pkg-ticket-row"
                  style="
                    font-size: 13px;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                  "
                >
                  <span
                    :style="{
                      color: pkg.leftTicket <= 5 ? '#ef4444' : '#10b981',
                      fontWeight: '700',
                    }"
                  >
                    🎫
                    {{
                      pkg.leftTicket > 0
                        ? pkg.leftTicket + ' Tickets Left'
                        : 'Out Of Stock'
                    }}
                  </span>
                </div>

                <div class="pkg-rating-row">
                  <span class="star-icon">⭐</span>
                  <span class="rating-val">{{ pkg.ratingCount }}</span>
                  <span class="review-count">({{ pkg.commentCount }})</span>
                </div>

                <div class="pkg-card-footer">
                  <div class="price-container">
                    <span class="price-amount">{{ pkg.amount }}</span>
                    <span class="price-label">/ person</span>
                  </div>
                  <router-link :to="`/packagedetail/${pkg.productId}`" class="btn-view-details">
                    View Details
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab !== 'ALL' && Object.keys(filteredGroupedPackages).length > 0">
          <div
            v-for="(packages, groupName) in filteredGroupedPackages"
            :key="groupName"
            class="location-group"
          >
            <div class="location-header">
              <v-icon
                :color="activeTab === 'DOMESTIC' ? '#10B981' : '#3B82F6'"
                size="22"
                class="mr-1"
              >
                {{ activeTab === 'DOMESTIC' ? 'mdi-map-marker' : 'mdi-earth' }}
              </v-icon>
              <h2 class="location-title">{{ groupName }}</h2>
            </div>

            <div class="packages-grid-layout">
              <div v-for="pkg in packages" :key="pkg.id" class="package-premium-card">
                <div class="card-image-box">
                  <img :src="pkg.photo" :alt="pkg.title" class="pkg-display-img" />

                  <span
                    v-if="pkg.type || pkg.Type"
                    class="package-badge"
                    :class="`badge-${(pkg.type || pkg.Type).toLowerCase()}`"
                  >
                    {{ pkg.type || pkg.Type }}
                  </span>
                </div>

                <div class="card-body-content">
                  <h3 class="pkg-card-title">{{ pkg.title }}</h3>

                  <div class="pkg-meta-row">
                    <span class="pkg-duration">🕒 {{ pkg.day }} Days/{{ pkg.night }} Nights</span>
                    <span class="pkg-group">👥 {{ pkg.groupSize }} People</span>
                  </div>

                  <div
                    class="pkg-ticket-row"
                    style="
                      font-size: 13px;
                      margin-bottom: 8px;
                      display: flex;
                      align-items: center;
                      gap: 4px;
                    "
                  >
                    <span
                      :style="{
                        color: pkg.leftTicket <= 5 ? '#ef4444' : '#10b981',
                        fontWeight: '700',
                      }"
                    >
                      🎫
                      {{
                        pkg.leftTicket > 0
                          ? pkg.leftTicket + ' Tickets Left'
                          : 'Out Of Stock'
                      }}
                    </span>
                  </div>

                  <div class="pkg-rating-row">
                    <span class="star-icon">⭐</span>
                    <span class="rating-val">{{ pkg.ratingCount }}</span>
                    <span class="review-count">({{ pkg.commentCount }})</span>
                  </div>

                  <div class="pkg-card-footer">
                    <div class="price-container">
                      <span class="price-amount">{{ pkg.amount }}</span>
                      <span class="price-label">/ person</span>
                    </div>
                    <router-link :to="`/packagedetail/${pkg.productId}`" class="btn-view-details">
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
import packageService from '@/service/PackageService'

export default {
  name: 'PackagesView',
  data() {
    return {
      activeTab: 'ALL',
      searchQuery: '',
      packagesData: [],
    }
  },

  computed: {
    filteredAllPackages() {
      console.log(this.packagesData);
      
      if (!this.searchQuery) return this.packagesData

      const query = this.searchQuery.toLowerCase().trim()
      return this.packagesData.filter((pkg) => {
        const loc = (pkg.location || pkg.destination || pkg.city || '').toLowerCase()
        return (
          (pkg.title || '').toLowerCase().includes(query) ||
          loc.includes(query) ||
          (pkg.amount || '').toString().toLowerCase().includes(query) ||
          (pkg.duration || '').toLowerCase().includes(query) ||
          (pkg.group_size || '').toLowerCase().includes(query)
        )
      })
    },

    filteredGroupedPackages() {
      if (this.activeTab === 'ALL') return {}
      console.log('Check Data - ', this.packagesData)

      let filtered = this.packagesData.filter((pkg) => {
        if (pkg.locationType) {
          return pkg.locationType.toUpperCase().trim() === this.activeTab
        }
        if (pkg.city && pkg.city.locationType) {
          return pkg.city.locationType.toUpperCase().trim() === this.activeTab
        }

        const locationText = (pkg.location || pkg.destination || pkg.city || '').toLowerCase()
        if (this.activeTab === 'DOMESTIC') {
          return locationText.includes('myanmar')
        } else if (this.activeTab === 'INTERNATIONAL') {
          return !locationText.includes('myanmar') && locationText !== ''
        }
        return false
      })

      // Search Box Filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim()
        filtered = filtered.filter((pkg) => {
          const loc = (pkg.location || pkg.destination || pkg.city || '').toLowerCase()
          return (
            (pkg.title || '').toLowerCase().includes(query) ||
            loc.includes(query) ||
            (pkg.amount || '').toString().toLowerCase().includes(query) ||
            (pkg.duration || '').toLowerCase().includes(query) ||
            (pkg.group_size || '').toLowerCase().includes(query)
          )
        })
      }

      // မြို့အလိုက် Group ပြန်ခွဲ
      const groups = {}
      filtered.forEach((pkg) => {
        const key = pkg.location || pkg.destination || pkg.city || 'Other'
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
    this.getPackages()
  },

  methods: {
    setActiveTab(tab) {
      this.activeTab = tab.toUpperCase()
    },
    checkRouteQuery() {
      if (
        this.$route.query.type === 'DOMESTIC' ||
        this.$route.query.type === 'INTERNATIONAL' ||
        this.$route.query.type === 'ALL'
      ) {
        this.activeTab = this.$route.query.type
      }
    },
    getPackages() {
      let apiParam = this.activeTab
      if (this.activeTab === 'DOMESTIC' || this.activeTab === 'INTERNATIONAL') {
        apiParam = this.activeTab.toLowerCase()
      }

      console.log(apiParam);
      
      packageService
        .getPackages(apiParam)
        .then((response) => {
          console.log(response)

          this.packagesData.splice(0, this.packagesData.length)
          this.packagesData.push(...response)
        })
        .catch((err) => {
          console.error('API Fetch Error: ', err)
        })
    },
  },

  watch: {
    '$route.query.type'() {
      this.checkRouteQuery()
    },
    activeTab() {
      this.getPackages()
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
}

.card-image-box {
  position: relative;
  height: 190px;
  width: 100%;
}

.package-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-radius: 6px;
  color: white;
  z-index: 2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* card ပိစိလေးတွေအတွက် */
.badge-domestic {
  background: #10b981;
}
.badge-international {
  background: #3b82f6;
}

.badge-budget {
  background: #fef3c7;
  color: #d97706;
}

.badge-standard {
  background: #dbeafe;
  color: #2563eb;
}

.badge-premium {
  background: #f3e8ff;
  color: #9333ea;
}

.pkg-display-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
