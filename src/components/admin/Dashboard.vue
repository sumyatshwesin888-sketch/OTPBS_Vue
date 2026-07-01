<script lang="ts">
import { defineComponent } from 'vue'
import { supabase } from '../lib/supabase'
import type { Product, Sale } from '../lib/supabase'

export default defineComponent({
  name: 'Dashboard',
  data() {
    return {
      loading: true,
      totalSales: 0,
      totalProducts: 0,
      activeUsers: 0,
      totalRevenue: 0,
      recentBookings: [] as Sale[],
      topProducts: [] as { product: Product; count: number }[],
      salesByMonth: [] as { month: string; amount: number }[],
    }
  },
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
  async mounted() {
    await this.fetchDashboardData()
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

    calculateTopProducts(products: Product[], sales: Sale[]) {
      const productSales = new Map<string, number>()
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

    calculateMonthlySales(sales: Sale[]) {
      const monthlyData = new Map<string, number>()
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

    getStatusColor(status: string): string {
      switch (status) {
        case 'CONFIRM': return 'success'
        case 'APPROVED': return 'primary'
        case 'DELETE': return 'error'
        default: return 'grey'
      }
    },

    formatDate(date: string | null): string {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
})
</script>

<template>
  <div>
    <!-- Summary Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
          <div class="card-accent card-accent-green"></div>
          <v-card-text class="pa-5">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Total Revenue</p>
                <p class="stat-value">{{ currencyFormatter.format(totalRevenue) }}</p>
                <p class="stat-trend">
                  <v-icon size="12" color="success">mdi-trending-up</v-icon>
                  <span class="ml-1">+12.5% from last month</span>
                </p>
              </div>
              <div class="stat-icon-container stat-icon-container-green">
                <v-icon size="22">mdi-currency-usd</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
          <div class="card-accent card-accent-blue"></div>
          <v-card-text class="pa-5">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Total Sales</p>
                <p class="stat-value">{{ numberFormatter.format(totalSales) }}</p>
                <p class="stat-trend">
                  <v-icon size="12" color="success">mdi-trending-up</v-icon>
                  <span class="ml-1">+8.2% from last month</span>
                </p>
              </div>
              <div class="stat-icon-container stat-icon-container-blue">
                <v-icon size="22">mdi-cart-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
          <div class="card-accent card-accent-amber"></div>
          <v-card-text class="pa-5">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Total Products</p>
                <p class="stat-value">{{ numberFormatter.format(totalProducts) }}</p>
                <p class="stat-trend">
                  <v-icon size="12" color="primary">mdi-package-variant</v-icon>
                  <span class="ml-1">{{ topProducts.length }} trending</span>
                </p>
              </div>
              <div class="stat-icon-container stat-icon-container-amber">
                <v-icon size="22">mdi-package-variant-closed</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
          <div class="card-accent card-accent-purple"></div>
          <v-card-text class="pa-5">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Active Users</p>
                <p class="stat-value">{{ numberFormatter.format(activeUsers) }}</p>
                <p class="stat-trend">
                  <v-icon size="12" color="primary">mdi-account-plus-outline</v-icon>
                  <span class="ml-1">3 new this week</span>
                </p>
              </div>
              <div class="stat-icon-container stat-icon-container-purple">
                <v-icon size="22">mdi-account-group-outline</v-icon>
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
          <v-card-title class="d-flex justify-space-between align-center pa-5 pb-3">
            <div>
              <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-3 mb-0">Recent Bookings</h3>
              <p class="text-caption text-grey mb-0">Latest transactions from your customers</p>
            </div>
            <v-btn variant="text" color="primary" size="small" class="text-none" density="comfortable">
              View All
              <v-icon end size="16">mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-0">
            <v-data-table
              :items="recentBookings"
              :loading="loading"
              :headers="[
                { title: 'ID', key: 'saleId', sortable: false, align: 'start' as const },
                { title: 'Customer', key: 'customer.profileName', align: 'start' as const },
                { title: 'Product', key: 'product.title', align: 'start' as const },
                { title: 'Amount', key: 'amount', align: 'end' as const },
                { title: 'Status', key: 'status', align: 'center' as const },
                { title: 'Date', key: 'date', align: 'start' as const }
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
                  <v-avatar size="30" class="avatar-gradient mr-2">
                    <span class="text-white text-caption font-weight-bold">{{ item.customer?.profileName?.charAt(0) || 'U' }}</span>
                  </v-avatar>
                  <span class="font-weight-medium text-body-2">{{ item.customer?.profileName || 'N/A' }}</span>
                </div>
              </template>
              <template #item.product.title="{ item }">
                <span class="text-body-2">{{ item.product?.title || 'N/A' }}</span>
              </template>
              <template #item.amount="{ item }">
                <span class="font-weight-semibold text-body-2" style="color: #2563eb;">{{ currencyFormatter.format(item.amount) }}</span>
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
                <span class="text-body-2 text-grey">{{ formatDate(item.date) }}</span>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Top Products -->
      <v-col cols="12" lg="4">
        <v-card class="enterprise-card mb-6">
          <v-card-title class="pa-5 pb-3">
            <div>
              <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-3 mb-0">Top Products</h3>
              <p class="text-caption text-grey mb-0">Best selling tour packages</p>
            </div>
          </v-card-title>
          <v-card-text class="pt-0">
            <v-list class="py-0">
              <v-list-item
                v-for="(item, index) in topProducts"
                :key="item.product.productId"
                class="px-0 py-3"
                :class="{ 'border-bottom': index < topProducts.length - 1 }"
              >
                <template #prepend>
                  <v-avatar
                    :color="index < 3 ? 'warning' : 'grey-lighten-2'"
                    size="34"
                    :class="index < 3 ? 'avatar-warning' : ''"
                  >
                    <span :class="index < 3 ? 'text-white' : 'text-grey'" class="font-weight-bold text-caption">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium text-body-2 text-grey-darken-3">
                  {{ item.product.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  <v-icon size="14" color="grey">mdi-map-marker</v-icon>
                  {{ item.product.location || 'Unknown' }}
                </v-list-item-subtitle>
                <template #append>
                  <div class="text-right">
                    <p class="text-body-2 font-weight-bold mb-0" style="color: #2563eb;">{{ item.count }}</p>
                    <p class="text-caption text-grey mb-0">sold</p>
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
          <v-card-title class="pa-5 pb-3">
            <div>
              <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-3 mb-0">Monthly Revenue Overview</h3>
              <p class="text-caption text-grey mb-0">Revenue breakdown by month</p>
            </div>
          </v-card-title>
          <v-card-text class="pt-0">
            <v-row v-if="salesByMonth.length > 0" class="pa-4">
              <v-col
                v-for="(data, index) in salesByMonth"
                :key="index"
                cols="6" sm="4" md="3" lg="2"
              >
                <div class="month-card hover-lift">
                  <p class="text-caption text-grey mb-2 font-weight-medium">{{ data.month }}</p>
                  <p class="text-h6 font-weight-bold mb-1" style="color: #0f172a;">
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

<style scoped>
.border-bottom {
  border-bottom: 1px solid #f1f5f9;
}

.month-card {
  padding: 14px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.month-bar {
  height: 3px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 6px;
}

.month-bar-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.5s ease;
}
</style>
