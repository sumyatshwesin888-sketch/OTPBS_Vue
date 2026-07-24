<template>
  <div>
    <!-- Summary Cards -->
    <div class="stats-grid mb-6">
      <!-- 1. Total Revenue -->
      <v-card class="stat-card" style="position: relative">
        <div class="card-accent card-accent-green"></div>
        <v-card-text class="pa-4 pr-6">
          <div class="d-flex justify-space-between align-start">
            <div>
              <p class="stat-label">Total Revenue</p>
              <p class="stat-value">{{ currencyFormatter.format(totalRevenue) }}</p>
              <p class="stat-trend">
                <v-icon size="11" color="success">mdi-trending-up</v-icon>
                <span class="ml-1">+12.5% from last month</span>
              </p>
            </div>
            <div class="stat-icon-container stat-icon-container-green">
              <v-icon size="18">mdi-currency-usd</v-icon>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- 2. Total Sales -->
      <v-card class="stat-card" style="position: relative">
        <div class="card-accent card-accent-blue"></div>
        <v-card-text class="pa-4 pr-6">
          <div class="d-flex justify-space-between align-start">
            <div>
              <p class="stat-label">Total Sales</p>
              <p class="stat-value">{{ numberFormatter.format(totalSales) }}</p>
              <p class="stat-trend">
                <v-icon size="11" color="success">mdi-trending-up</v-icon>
                <span class="ml-1">+8.2% from last month</span>
              </p>
            </div>
            <div class="stat-icon-container stat-icon-container-blue">
              <v-icon size="18">mdi-cart-outline</v-icon>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- 3. Total Products -->
      <v-card class="stat-card" style="position: relative">
        <div class="card-accent card-accent-amber"></div>
        <v-card-text class="pa-4 pr-6">
          <div class="d-flex justify-space-between align-start">
            <div>
              <p class="stat-label">Total Products</p>
              <p class="stat-value">{{ numberFormatter.format(totalProducts) }}</p>
              <p class="stat-trend">
                <v-icon size="11" color="primary">mdi-package-variant</v-icon>
                <span class="ml-1">{{ topProducts.length }} trending</span>
              </p>
            </div>
            <div class="stat-icon-container stat-icon-container-amber">
              <v-icon size="18">mdi-package-variant-closed</v-icon>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- 4. Active Users -->
      <v-card class="stat-card" style="position: relative">
        <div class="card-accent card-accent-purple"></div>
        <v-card-text class="pa-4 pr-6">
          <div class="d-flex justify-space-between align-start">
            <div>
              <p class="stat-label">Active Users</p>
              <p class="stat-value">{{ numberFormatter.format(activeUsers) }}</p>
              <p class="stat-trend">
                <v-icon size="11" color="primary">mdi-account-plus-outline</v-icon>
                <span class="ml-1">Active Accounts</span>
              </p>
            </div>
            <div class="stat-icon-container stat-icon-container-purple">
              <v-icon size="18">mdi-account-group-outline</v-icon>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- 5. Inactive Users -->
      <v-card class="stat-card" style="position: relative">
        <div class="card-accent card-accent-rose"></div>
        <v-card-text class="pa-4 pr-6">
          <div class="d-flex justify-space-between align-start">
            <div>
              <p class="stat-label">Inactive Users</p>
              <p class="stat-value">{{ numberFormatter.format(inactiveUsers) }}</p>
              <p class="stat-trend">
                <v-icon size="11" color="error">mdi-account-minus-outline</v-icon>
                <span class="ml-1">Requires attention</span>
              </p>
            </div>
            <div class="stat-icon-container stat-icon-container-rose">
              <v-icon size="18">mdi-account-off-outline</v-icon>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Main Content Row -->
    <v-row>
      <!-- Recent Bookings -->
      <v-col cols="12" lg="8">
        <v-card class="enterprise-card mb-6">
          <v-card-title class="d-flex justify-space-between align-center pa-4 pb-2">
            <div>
              <h3 class="card-title-text mb-0">Recent Bookings</h3>
              <p class="card-subtitle-text mb-0">Latest transactions from your customers</p>
            </div>
          </v-card-title>
          <v-card-text class="pt-0 px-4 pb-4">
            <v-data-table
              :items="recentBookings"
              :loading="loading"
              :headers="[
                { title: 'ID', key: 'saleId', sortable: false, align: 'start' },
                { title: 'Customer', key: 'profileName', align: 'start' },
                { title: 'Product', key: 'title', align: 'start' },
                { title: 'Amount', key: 'amount', align: 'end' },
                { title: 'Status', key: 'status', align: 'center' },
                { title: 'Date', key: 'date', align: 'start' },
              ]"
              item-value="saleId"
              hide-default-footer
              class="premium-table elevation-0"
            >
              <template #item.saleId="{ item }">
                <span class="text-caption font-weight-medium text-primary">#{{ item.saleId }}</span>
              </template>
              <template #item.profileName="{ item }">
                <div class="d-flex align-center py-1">
                  <v-avatar size="26" class="avatar-gradient mr-2">
                    <span
                      class="text-white text-caption font-weight-bold"
                      style="font-size: 0.7rem !important"
                      >{{ item.profileName ? item.profileName.charAt(0) : 'U' }}</span
                    >
                  </v-avatar>
                  <span
                    class="font-weight-medium text-body-2"
                    style="font-size: 0.8rem !important"
                    >{{ item.profileName || 'N/A' }}</span
                  >
                </div>
              </template>
              <template #item.title="{ item }">
                <span class="text-body-2" style="font-size: 0.8rem !important">{{
                  item.title || 'N/A'
                }}</span>
              </template>
              <template #item.amount="{ item }">
                <span
                  class="font-weight-semibold text-body-2"
                  style="color: #2563eb; font-size: 0.8rem !important"
                  >{{ currencyFormatter.format(item.amount) }}</span
                >
              </template>
              <template #item.status="{ item }">
                <span
                  class="status-chip"
                  :class="'status-' + (item.status ? item.status.toLowerCase() : 'grey')"
                >
                  {{ item.status === 'DELETE' ? 'Cancelled' : item.status }}
                </span>
              </template>
              <template #item.date="{ item }">
                <span class="text-body-2 text-grey" style="font-size: 0.8rem !important">{{
                  formatDate(item.date)
                }}</span>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Top Products -->
      <v-col cols="12" lg="4">
        <v-card class="enterprise-card mb-6">
          <v-card-title class="pa-4 pb-2">
            <div>
              <h3 class="card-title-text mb-0">Top Products</h3>
              <p class="card-subtitle-text mb-0">Best selling tour packages</p>
            </div>
          </v-card-title>
          <v-card-text class="pt-0 px-4 pb-4">
            <v-list class="py-0 bg-transparent">
              <v-list-item
                v-for="(item, index) in topProducts"
                :key="item.productId"
                class="px-0 py-2"
                :class="{ 'border-bottom': index < topProducts.length - 1 }"
              >
                <template #prepend>
                  <v-avatar
                    :color="index < 3 ? 'warning' : 'grey-lighten-2'"
                    size="28"
                    :class="index < 3 ? 'avatar-warning' : ''"
                  >
                    <span
                      :class="index < 3 ? 'text-white' : 'text-grey'"
                      class="font-weight-bold text-caption"
                      style="font-size: 0.75rem !important"
                      >{{ index + 1 }}</span
                    >
                  </v-avatar>
                </template>
                <v-list-item-title
                  class="font-weight-medium text-body-2 text-grey-darken-3"
                  style="font-size: 0.8rem !important"
                >
                  {{ item.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption" style="font-size: 0.7rem !important">
                  <v-icon size="12" color="grey">mdi-map-marker</v-icon>
                  {{ item.location || 'Myanmar' }}
                </v-list-item-subtitle>
                <template #append>
                  <div class="text-right">
                    <p
                      class="text-body-2 font-weight-bold mb-0"
                      style="color: #2563eb; font-size: 0.8rem !important"
                    >
                      {{ item.count }}
                    </p>
                    <p class="text-caption text-grey mb-0" style="font-size: 0.65rem !important">
                      sold
                    </p>
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <div v-if="!loading && topProducts.length === 0" class="premium-empty-state">
              <v-icon>mdi-package-variant</v-icon>
              <p class="empty-title">No products yet</p>
              <p class="empty-text">Add products to see statistics</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Monthly Revenue Overview (Wave Chart) -->
    
<v-row>
  <v-col cols="12">
    <v-card class="enterprise-card">
      <v-card-text class="pa-6 pb-2">
        <!-- Header Section (Matching Right Image Layout) -->
        <!-- Header Section (Professional & Clean Layout) -->
<div class="d-flex align-center justify-space-between mb-2">
  <div>
    <h3 class="card-title-text mb-3">Monthly Revenue Overview</h3>
    
    <div class="d-flex align-center">
  <!-- Progress Ring ကို % Dynamic တွက်ပြခြင်း -->
  <div class="mr-3">
    <v-progress-circular
      :model-value="Math.min(Math.round((totalRevenue / 50000000) * 100), 100)"
      :size="42"
      :width="4"
      color="#2563eb"
      class="stat-ring"
    >
      <span class="text-caption font-weight-bold" style="font-size: 0.65rem !important;">
        {{ Math.min(Math.round((totalRevenue / 50000000) * 100), 100) }}%
      </span>
    </v-progress-circular>
  </div>

  <div>
    <div class="text-subtitle-1 font-weight-bold text-slate-800">
      Annual Target: 
      <span class="text-blue-600 ml-1">{{ currencyFormatter.format(totalRevenue) }}</span>
      <span class="text-caption text-grey ml-1"></span>
    </div>
    <div class="text-caption text-success font-weight-medium d-flex align-center">
      <v-icon size="14" color="success" class="mr-1">mdi-trending-up</v-icon>
      Target achievement progress based on bookings
    </div>
  </div>
</div>
  </div>
</div>

        <!-- Clean Wave Area Chart (Dots မပါသော မျဉ်းကွေး Smooth Line) -->
        <div v-if="salesByMonth.length > 0" class="area-chart-container mt-4">
          <svg viewBox="0 0 1000 180" preserveAspectRatio="none" class="area-chart-svg">
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.01" />
              </linearGradient>
            </defs>

            <!-- Background Gradient Area -->
            <path :d="areaPath" fill="url(#areaGradient)" />

            <!-- Smooth Blue Wave Line -->
            <path :d="linePath" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" />
          </svg>

          <!-- 12 Months Labels (Jan - Dec) -->
          <div class="x-axis-labels">
            <span v-for="(item, index) in salesByMonth" :key="index" class="x-label">
              {{ item.month }}
            </span>
          </div>
        </div>

        <div v-else-if="!loading" class="premium-empty-state">
          <v-icon>mdi-chart-line</v-icon>
          <p class="empty-title">No sales data</p>
          <p class="empty-text">Sales will appear here once bookings are made</p>
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</v-row>
  </div>
</template>

<script>
import dashboardService from '@/service/DashboardService'

export default {
  data: () => ({
    loading: true,
    totalSales: 0,
    totalProducts: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalRevenue: 0,
    recentBookings: [],
    topProducts: [],
    salesByMonth: [],
  }),
  mounted() {
    this.fetchDashboardData()
  },
  methods: {
    async fetchDashboardData() {
      this.loading = true
      try {
        const data = await dashboardService.getPackageDashboard()

        if (data) {
          this.totalSales = data.totalSales || 0
          this.totalRevenue = data.totalRevenue || 0
          this.totalProducts = data.totalProducts || 0
          this.activeUsers = data.activeUsers || 0
          this.inactiveUsers = data.inactiveUsers || 0
          this.recentBookings = data.recentBookings || []
          this.topProducts = data.topProducts || []
          this.salesByMonth = data.monthlyRevenues || []

        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        this.loading = false
      }
    },


    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  },
  computed: {
    currencyFormatter() {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MMK',
      })
    },
    numberFormatter() {
      return new Intl.NumberFormat('en-US')
    },

    chartPoints() {
    if (!this.salesByMonth || this.salesByMonth.length === 0) return []
    const width = 1000
    const height = 120 // Graph ၏ အမြင့်
    const paddingTop = 25
    const maxAmount = Math.max(...this.salesByMonth.map(s => s.amount)) || 1

    const stepX = width / (this.salesByMonth.length - 1 || 1)

    return this.salesByMonth.map((item, index) => {
      const x = index * stepX
      const normalizedY = (item.amount / maxAmount) * height
      const y = (height - normalizedY) + paddingTop
      return {
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        month: item.month,
        amount: item.amount
      }
    })
  },

  // 2. Smooth Wave Line Path (Bezier Curve) ရေးဆွဲခြင်း
  linePath() {
    const pts = this.chartPoints
    if (!pts || pts.length === 0) return ''
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i]
      const next = pts[i + 1]
      const mx = (curr.x + next.x) / 2
      d += ` C ${mx} ${curr.y}, ${mx} ${next.y}, ${next.x} ${next.y}`
    }
    return d
  },

  // 3. Curve အောက်ခြေ Background Gradient ထည့်ရန် Area Path
  areaPath() {
    const pts = this.chartPoints
    if (!pts || pts.length === 0) return ''
    const line = this.linePath
    const last = pts[pts.length - 1]
    const first = pts[0]
    return `${line} L ${last.x} 160 L ${first.x} 160 Z`
  }
  }
};
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 14px;
  }
}

.stat-card {
  background: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(14px) saturate(140%) !important;
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
  box-shadow: 0 4px 20px 0 rgba(31, 38, 135, 0.02) !important;
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  overflow: hidden;
  height: 100%;
}

.enterprise-card {
  background: rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(16px) saturate(120%) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 6px 24px 0 rgba(31, 38, 135, 0.03) !important;
  border-radius: 14px !important;
}

.card-title-text {
  font-size: 0.95rem !important;
  font-weight: 700 !important;
  color: #1e293b !important;
}

.card-subtitle-text {
  font-size: 0.725rem !important;
  color: #64748b !important;
}

.card-accent {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 4px;
}

.card-accent-green {
  background: linear-gradient(180deg, #4caf50, #81c784);
}
.card-accent-blue {
  background: linear-gradient(180deg, #2196f3, #64b5f6);
}
.card-accent-amber {
  background: linear-gradient(180deg, #ffc107, #ffe082);
}
.card-accent-purple {
  background: linear-gradient(180deg, #9c27b0, #ba68c8);
}
.card-accent-rose {
  background: linear-gradient(180deg, #f43f5e, #fb7185);
}

.stat-icon-container {
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-icon-container-green {
  background: rgba(76, 175, 80, 0.08);
  color: #2e7d32 !important;
}
.stat-icon-container-blue {
  background: rgba(33, 150, 243, 0.08);
  color: #1565c0 !important;
}
.stat-icon-container-amber {
  background: rgba(255, 193, 7, 0.08);
  color: #b78103 !important;
}
.stat-icon-container-purple {
  background: rgba(156, 39, 176, 0.08);
  color: #6a1b9a !important;
}
.stat-icon-container-rose {
  background: rgba(244, 63, 94, 0.08);
  color: #be123c !important;
}

.stat-label {
  font-size: 0.725rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
}
.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
}
.stat-trend {
  font-size: 0.68rem;
  color: #64748b;
  display: flex;
  align-items: center;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
}
.status-confirm {
  background: rgba(76, 175, 80, 0.1);
  color: #1b5e20;
}
.status-approved {
  background: rgba(33, 150, 243, 0.1);
  color: #0d47a1;
}
.status-delete {
  background: rgba(244, 67, 54, 0.1);
  color: #b71c1c;
}
.status-grey {
  background: rgba(158, 158, 158, 0.1);
  color: #212121;
}

.avatar-gradient {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
}
.border-bottom {
  border-bottom: 1px solid rgba(241, 245, 249, 0.5);
}

/* Graph Bar Custom Styles */

/* Card & Header Styles */
.card-title-text {
  font-size: 1.05rem !important;
  font-weight: 700 !important;
  color: #1e293b !important;
}

.text-slate-800 {
  color: #1e293b;
}

.text-blue-600 {
  color: #2563eb;
}

.revenue-icon-box {
  width: 42px;
  height: 42px;
  background: rgba(37, 99, 235, 0.08);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Area Chart CSS */
.area-chart-container {
  width: 100%;
  position: relative;
}

.area-chart-svg {
  width: 100%;
  height: 160px;
  display: block;
}

.x-axis-labels {
  display: flex;
  justify-content: space-between;
  padding: 10px 4px 6px 4px;
  border-top: 1px solid #f1f5f9;
}

.x-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}
</style>
