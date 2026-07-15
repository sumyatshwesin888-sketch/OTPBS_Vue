<template>
  <div>
    <!-- Summary Cards -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
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
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
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
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
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
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
          <div class="card-accent card-accent-purple"></div>
          <v-card-text class="pa-4 pr-6">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Active Users</p>
                <p class="stat-value">{{ numberFormatter.format(activeUsers) }}</p>
                <p class="stat-trend">
                  <v-icon size="11" color="primary">mdi-account-plus-outline</v-icon>
                  <span class="ml-1">3 new this week</span>
                </p>
              </div>
              <div class="stat-icon-container stat-icon-container-purple">
                <v-icon size="18">mdi-account-group-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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
            <v-btn variant="text" color="primary" size="small" class="text-none text-caption font-weight-bold" density="comfortable">
              View All
              <v-icon end size="14">mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-0 px-4 pb-4">
            <v-data-table
              :items="recentBookings"
              :loading="loading"
              :headers="[
                { title: 'ID', key: 'saleId', sortable: false, align: 'start' },
                { title: 'Customer', key: 'customer.profileName', align: 'start' },
                { title: 'Product', key: 'product.title', align: 'start' },
                { title: 'Amount', key: 'amount', align: 'end' },
                { title: 'Status', key: 'status', align: 'center' },
                { title: 'Date', key: 'date', align: 'start' }
              ]"
              item-value="saleId"
              hide-default-footer
              class="premium-table elevation-0"
            >
              <template #item.saleId="{ item }">
                <span class="text-caption font-weight-medium text-primary">#{{ item.saleId.slice(0, 8).toUpperCase() }}</span>
              </template>
              <template #item.customer.profileName="{ item }">
                <div class="d-flex align-center py-1">
                  <v-avatar size="26" class="avatar-gradient mr-2">
                    <span class="text-white text-caption font-weight-bold" style="font-size: 0.7rem !important;">{{ item.customer?.profileName?.charAt(0) || 'U' }}</span>
                  </v-avatar>
                  <span class="font-weight-medium text-body-2" style="font-size: 0.8rem !important;">{{ item.customer?.profileName || 'N/A' }}</span>
                </div>
              </template>
              <template #item.product.title="{ item }">
                <span class="text-body-2" style="font-size: 0.8rem !important;">{{ item.product?.title || 'N/A' }}</span>
              </template>
              <template #item.amount="{ item }">
                <span class="font-weight-semibold text-body-2" style="color: #2563eb; font-size: 0.8rem !important;">{{ currencyFormatter.format(item.amount) }}</span>
              </template>
              <template #item.status="{ item }">
                <span
                  class="status-chip"
                  :class="'status-' + item.status.toLowerCase()"
                >
                  {{ item.status === 'DELETE' ? 'Cancelled' : item.status }}
                </span>
              </template>
              <template #item.date="{ item }">
                <span class="text-body-2 text-grey" style="font-size: 0.8rem !important;">{{ formatDate(item.date) }}</span>
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
                :key="item.product.productId"
                class="px-0 py-2"
                :class="{ 'border-bottom': index < topProducts.length - 1 }"
              >
                <template #prepend>
                  <v-avatar
                    :color="index < 3 ? 'warning' : 'grey-lighten-2'"
                    size="28"
                    :class="index < 3 ? 'avatar-warning' : ''"
                  >
                    <span :class="index < 3 ? 'text-white' : 'text-grey'" class="font-weight-bold text-caption" style="font-size: 0.75rem !important;">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium text-body-2 text-grey-darken-3" style="font-size: 0.8rem !important;">
                  {{ item.product.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption" style="font-size: 0.7rem !important;">
                  <v-icon size="12" color="grey">mdi-map-marker</v-icon>
                  {{ item.product.location || 'Unknown' }}
                </v-list-item-subtitle>
                <template #append>
                  <div class="text-right">
                    <p class="text-body-2 font-weight-bold mb-0" style="color: #2563eb; font-size: 0.8rem !important;">{{ item.count }}</p>
                    <p class="text-caption text-grey mb-0" style="font-size: 0.65rem !important;">sold</p>
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

    <!-- Monthly Revenue -->
    <v-row>
      <v-col cols="12">
        <v-card class="enterprise-card">
          <v-card-title class="pa-4 pb-2">
            <div>
              <h3 class="card-title-text mb-0">Monthly Revenue Overview</h3>
              <p class="card-subtitle-text mb-0">Revenue breakdown by month</p>
            </div>
          </v-card-title>
          <v-card-text class="pt-0 px-4 pb-4">
            <v-row v-if="salesByMonth.length > 0" class="pa-2">
              <v-col
                v-for="(data, index) in salesByMonth"
                :key="index"
                cols="6" sm="4" md="3" lg="2"
              >
                <div class="month-card hover-lift">
                  <p class="text-caption text-grey mb-1 font-weight-medium" style="font-size: 0.7rem !important;">{{ data.month }}</p>
                  <p class="font-weight-bold mb-1" style="color: #0f172a; font-size: 0.95rem !important;">
                    {{ currencyFormatter.format(data.amount).slice(0, -3) }}
                  </p>
                  <div class="month-bar">
                    <div class="month-bar-fill" :style="{ width: Math.min((data.amount / Math.max(...salesByMonth.map(s => s.amount))) * 100, 100) + '%' }"></div>
                  </div>
                </div>
              </v-col>
            </v-row>
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
import { supabase } from '../../lib/supabase'

export default {
  data: () => ({
    loading: true,
    totalSales: 0,
    totalProducts: 0,
    activeUsers: 0,
    totalRevenue: 0,
    recentBookings: [],
    topProducts: [],
    salesByMonth: [],
  }),
  props: {},
  mounted: function() {
    this.fetchDashboardData()
  },
  methods: {
    async fetchDashboardData() {
      this.loading = true
      try {
        const [
          productsResult,
          usersResult,
          salesResult
        ] = await Promise.all([
          supabase.from('product').select('*, userAccount(*)'),
          supabase.from('user_account').select('*'),
          supabase.from('sale').select('*, product(*), userAccount(*), customer(*)').order('date', { ascending: false }).limit(10)
        ])

        if (productsResult.data) {
          this.totalProducts = productsResult.data.length
          this.topProducts = this.calculateTopProducts(productsResult.data, salesResult.data || [])
        }

        if (usersResult.data) {
          this.activeUsers = usersResult.data.filter(u => u.status === 1).length
        }

        if (salesResult.data) {
          this.totalSales = salesResult.data.length
          this.totalRevenue = salesResult.data
            .filter(s => s.status !== 'DELETE')
            .reduce((sum, s) => sum + (s.amount || 0), 0)
          this.recentBookings = salesResult.data.slice(0, 5)
          this.salesByMonth = this.calculateMonthlySales(salesResult.data)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        this.loading = false
      }
    },

    calculateTopProducts(products, sales) {
      const productSales = new Map()
      sales.forEach(sale => {
        if (sale.status !== 'DELETE') {
          const count = productSales.get(sale.productId) || 0
          productSales.set(sale.productId, count + sale.qty)
        }
      })

      return products
        .map(p => ({ product: p, count: productSales.get(p.productId) || 0 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    },

    calculateMonthlySales(sales) {
      const monthlyData = new Map()
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      sales.forEach(sale => {
        if (sale.status !== 'DELETE' && sale.date) {
          const date = new Date(sale.date)
          const monthKey = months[date.getMonth()]
          const amount = monthlyData.get(monthKey) || 0
          monthlyData.set(monthKey, amount + sale.amount)
        }
      })

      return months
        .filter(m => monthlyData.has(m))
        .map(m => ({ month: m, amount: monthlyData.get(m) || 0 }))
    },

    getStatusColor(status) {
      switch (status) {
        case 'CONFIRM': return 'success'
        case 'APPROVED': return 'primary'
        case 'DELETE': return 'error'
        default: return 'grey'
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
  watch: {},
  computed: {
    currencyFormatter() {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    },
    numberFormatter() {
      return new Intl.NumberFormat('en-US')
    }
  },
  components: {}
};
</script>

<style scoped>
/* Modern Compact Glassmorphic UI */
.stat-card {
  background: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(14px) saturate(140%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(140%) !important;
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
  box-shadow: 0 4px 20px 0 rgba(31, 38, 135, 0.02) !important;
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  overflow: hidden;
}

.enterprise-card {
  background: rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(16px) saturate(120%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(120%) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 6px 24px 0 rgba(31, 38, 135, 0.03) !important;
  border-radius: 14px !important;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
}

/* Specific Card Title Styling (Fixed Huge Fonts) */
.card-title-text {
  font-size: 0.95rem !important;
  font-weight: 700 !important;
  color: #1e293b !important;
  letter-spacing: -0.01em !important;
}

.card-subtitle-text {
  font-size: 0.725rem !important;
  color: #64748b !important;
  font-weight: 400 !important;
  margin-top: 1px !important;
}

/* Hover Glow & Lift Effect */
.stat-card:hover, .enterprise-card:hover, .hover-lift:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.65) !important;
}

/* Vertical Accent Line (Right Side) */
.card-accent {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 4px;
  height: 100%;
}

.stat-card:has(.card-accent-green):hover { box-shadow: 0 6px 24px 0 rgba(76, 175, 80, 0.15) !important; border-color: rgba(76, 175, 80, 0.3) !important; }
.stat-card:has(.card-accent-blue):hover { box-shadow: 0 6px 24px 0 rgba(33, 150, 243, 0.15) !important; border-color: rgba(33, 150, 243, 0.3) !important; }
.stat-card:has(.card-accent-amber):hover { box-shadow: 0 6px 24px 0 rgba(255, 193, 7, 0.15) !important; border-color: rgba(255, 193, 7, 0.3) !important; }
.stat-card:has(.card-accent-purple):hover { box-shadow: 0 6px 24px 0 rgba(156, 39, 176, 0.15) !important; border-color: rgba(156, 39, 176, 0.3) !important; }

.card-accent-green { background: linear-gradient(180deg, #4caf50, #81c784); }
.card-accent-blue { background: linear-gradient(180deg, #2196f3, #64b5f6); }
.card-accent-amber { background: linear-gradient(180deg, #ffc107, #ffe082); }
.card-accent-purple { background: linear-gradient(180deg, #9c27b0, #ba68c8); }

/* Compact Icons */
.stat-icon-container {
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-icon-container-green { background: rgba(76, 175, 80, 0.08); color: #2e7d32 !important; }
.stat-icon-container-blue { background: rgba(33, 150, 243, 0.08); color: #1565c0 !important; }
.stat-icon-container-amber { background: rgba(255, 193, 7, 0.08); color: #b78103 !important; }
.stat-icon-container-purple { background: rgba(156, 39, 176, 0.08); color: #6a1b9a !important; }

/* Mini Stats Typography */
.stat-label {
  font-size: 0.725rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 1px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 1px;
}
.stat-trend {
  font-size: 0.68rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

/* Premium Table - Compact Text */
.premium-table {
  background: transparent !important;
}
.premium-table :deep(th) {
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  color: #475569 !important;
  background: rgba(241, 245, 249, 0.3) !important;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
  padding: 8px 12px !important;
}
.premium-table :deep(td) {
  border-bottom: 1px solid rgba(241, 245, 249, 0.3) !important;
  padding: 6px 12px !important;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
}
.status-confirm { background: rgba(76, 175, 80, 0.1); color: #1b5e20; }
.status-approved { background: rgba(33, 150, 243, 0.1); color: #0d47a1; }
.status-delete { background: rgba(244, 67, 54, 0.1); color: #b71c1c; }
.status-grey { background: rgba(158, 158, 158, 0.1); color: #212121; }

.avatar-gradient { background: linear-gradient(135deg, #3b82f6, #8b5cf6); }
.avatar-warning { background: linear-gradient(135deg, #f59e0b, #ef4444) !important; }
.border-bottom { border-bottom: 1px solid rgba(241, 245, 249, 0.5); }

.month-card {
  padding: 12px;
  background: rgba(248, 250, 252, 0.4) !important;
  border: 1px solid rgba(226, 232, 240, 0.5) !important;
  border-radius: 10px !important;
  text-align: center;
}

.month-bar {
  height: 3px;
  background: rgba(226, 232, 240, 0.5);
  border-radius: 4px;
  margin-top: 6px;
  overflow: hidden;
}

.month-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-empty-state {
  text-align: center;
  padding: 30px 16px;
  color: #94a3b8;
}
.premium-empty-state .v-icon {
  font-size: 36px;
  margin-bottom: 8px;
  color: #cbd5e1;
}
.empty-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 2px;
}
.empty-text {
  font-size: 0.75rem;
}
</style>