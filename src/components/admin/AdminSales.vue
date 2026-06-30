<script lang="ts">
import { defineComponent } from 'vue'
import { supabase } from '../../lib/supabase'
import type { Sale, UserAccount, Product } from '../../lib/supabase'

export default defineComponent({
  name: 'AdminSales',
  data() {
    return {
      sales: [] as Sale[],
      users: [] as UserAccount[],
      products: [] as Product[],
      loading: true,
      dialog: false,
      deleteDialog: false,
      search: '',
      statusFilter: null as string | null,
      saleForm: {
        saleId: '',
        userAccountId: '',
        customerId: '',
        productId: '',
        voucherCode: '',
        qty: 1,
        unitPrice: 0,
        amount: 0,
        paymentType: '',
        status: 'CONFIRM' as 'CONFIRM' | 'APPROVED' | 'DELETE',
        date: ''
      },
      editing: false,
      itemToDelete: null as Sale | null,
      headers: [
        { title: 'Booking ID', key: 'saleId', align: 'start' as const },
        { title: 'Customer', key: 'customer.profileName', align: 'start' as const },
        { title: 'Product', key: 'product.title', align: 'start' as const },
        { title: 'Qty', key: 'qty', align: 'center' as const },
        { title: 'Amount', key: 'amount', align: 'end' as const },
        { title: 'Status', key: 'status', align: 'center' as const },
        { title: 'Date', key: 'date', align: 'start' as const },
        { title: 'Actions', key: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    filteredSales(): Sale[] {
      let result = this.sales
      if (this.search) {
        const term = this.search.toLowerCase()
        result = result.filter(s =>
          s.saleId.toLowerCase().includes(term) ||
          (s.customer?.profileName && s.customer.profileName.toLowerCase().includes(term)) ||
          (s.product?.title && s.product.title.toLowerCase().includes(term))
        )
      }
      if (this.statusFilter) {
        result = result.filter(s => s.status === this.statusFilter)
      }
      return result
    },
    formValid(): boolean {
      return !!(
        this.saleForm.userAccountId &&
        this.saleForm.customerId &&
        this.saleForm.productId &&
        this.saleForm.qty > 0 &&
        this.saleForm.unitPrice > 0
      )
    },
    currencyFormatter() {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    },
    totalRevenue(): number {
      return this.sales
        .filter(s => s.status !== 'DELETE')
        .reduce((sum, s) => sum + (s.amount || 0), 0)
    },
    confirmedBookings(): number {
      return this.sales.filter(s => s.status === 'CONFIRM').length
    },
    approvedBookings(): number {
      return this.sales.filter(s => s.status === 'APPROVED').length
    },
    cancelledBookings(): number {
      return this.sales.filter(s => s.status === 'DELETE').length
    }
  },
  async mounted() {
    await Promise.all([this.fetchSales(), this.fetchUsers(), this.fetchProducts()])
  },
  methods: {
    async fetchSales() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('sale')
          .select('*, userAccount(*), customer:user_account!sale_customerId_fkey(*), product(*)')
          .order('date', { ascending: false })

        if (error) throw error
        this.sales = data || []
      } catch (error) {
        console.error('Error fetching sales:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchUsers() {
      try {
        const { data } = await supabase.from('user_account').select('*')
        this.users = data || []
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    },

    async fetchProducts() {
      try {
        const { data } = await supabase.from('product').select('*')
        this.products = data || []
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },

    openAddDialog() {
      this.editing = false
      const today = new Date().toISOString().split('T')[0]
      this.saleForm = {
        saleId: '',
        userAccountId: this.users[0]?.userAccountId || '',
        customerId: '',
        productId: '',
        voucherCode: '',
        qty: 1,
        unitPrice: 0,
        amount: 0,
        paymentType: '',
        status: 'CONFIRM',
        date: today
      }
      this.dialog = true
    },

    openEditDialog(sale: Sale) {
      this.editing = true
      this.saleForm = {
        saleId: sale.saleId,
        userAccountId: sale.userAccountId,
        customerId: sale.customerId,
        productId: sale.productId,
        voucherCode: sale.voucherCode || '',
        qty: sale.qty,
        unitPrice: sale.unitPrice,
        amount: sale.amount,
        paymentType: sale.paymentType || '',
        status: sale.status,
        date: sale.date ? new Date(sale.date).toISOString().split('T')[0] : ''
      }
      this.dialog = true
    },

    async saveSale() {
      try {
        const amount = this.saleForm.qty * this.saleForm.unitPrice
        const payload = {
          userAccountId: this.saleForm.userAccountId,
          customerId: this.saleForm.customerId,
          productId: this.saleForm.productId,
          voucherCode: this.saleForm.voucherCode || null,
          qty: this.saleForm.qty,
          unitPrice: this.saleForm.unitPrice,
          amount,
          paymentType: this.saleForm.paymentType || null,
          status: this.saleForm.status,
          date: this.saleForm.date || null
        }

        if (this.editing) {
          const { error } = await supabase
            .from('sale')
            .update(payload)
            .eq('saleId', this.saleForm.saleId)
          if (error) throw error
        } else {
          const { error } = await supabase
            .from('sale')
            .insert([payload])
          if (error) throw error
        }

        this.dialog = false
        await this.fetchSales()
      } catch (error) {
        console.error('Error saving sale:', error)
      }
    },

    openDeleteDialog(sale: Sale) {
      this.itemToDelete = sale
      this.deleteDialog = true
    },

    async deleteSale() {
      if (!this.itemToDelete) return
      try {
        const { error } = await supabase
          .from('sale')
          .delete()
          .eq('saleId', this.itemToDelete.saleId)
        if (error) throw error
        this.deleteDialog = false
        this.itemToDelete = null
        await this.fetchSales()
      } catch (error) {
        console.error('Error deleting sale:', error)
      }
    },

    async updateStatus(sale: Sale, newStatus: 'CONFIRM' | 'APPROVED' | 'DELETE') {
      try {
        const { error } = await supabase
          .from('sale')
          .update({ status: newStatus })
          .eq('saleId', sale.saleId)
        if (error) throw error
        await this.fetchSales()
      } catch (error) {
        console.error('Error updating status:', error)
      }
    },

    onProductChange() {
      const product = this.products.find(p => p.productId === this.saleForm.productId)
      if (product) {
        this.saleForm.unitPrice = product.amount
        this.calculateAmount()
      }
    },

    calculateAmount() {
      this.saleForm.amount = this.saleForm.qty * this.saleForm.unitPrice
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
  },
  watch: {
    'saleForm.qty'() { this.calculateAmount() },
    'saleForm.unitPrice'() { this.calculateAmount() }
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
                <p class="stat-label">Confirmed</p>
                <p class="stat-value">{{ confirmedBookings }}</p>
              </div>
              <div class="stat-icon-container stat-icon-container-blue">
                <v-icon size="22">mdi-check-circle-outline</v-icon>
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
                <p class="stat-label">Approved</p>
                <p class="stat-value">{{ approvedBookings }}</p>
              </div>
              <div class="stat-icon-container stat-icon-container-amber">
                <v-icon size="22">mdi-thumb-up-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative;">
          <div class="card-accent card-accent-red"></div>
          <v-card-text class="pa-5">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Cancelled</p>
                <p class="stat-value">{{ cancelledBookings }}</p>
              </div>
              <div class="stat-icon-container stat-icon-container-red">
                <v-icon size="22">mdi-cancel</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter Bar -->
    <v-card class="filter-bar mb-6">
      <v-row align="center">
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="search"
            label="Search bookings..."
            prepend-inner-icon="mdi-magnify"
            density="comfortable"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="statusFilter"
            label="Status"
            :items="[
              { title: 'All', value: null },
              { title: 'Confirmed', value: 'CONFIRM' },
              { title: 'Approved', value: 'APPROVED' },
              { title: 'Cancelled', value: 'DELETE' }
            ]"
            density="comfortable"
            variant="outlined"
            hide-details
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" md="5" class="text-right">
          <v-btn
            color="primary"
            class="btn-primary"
            prepend-icon="mdi-plus"
            @click="openAddDialog"
          >
            New Booking
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Data Table -->
    <v-card class="enterprise-card">
      <v-data-table
        :headers="headers"
        :items="filteredSales"
        :loading="loading"
        item-value="saleId"
        class="premium-table elevation-0"
      >
        <template #item.saleId="{ item }">
          <span class="text-caption font-weight-medium text-primary">#{{ item.saleId.slice(0, 8).toUpperCase() }}</span>
        </template>

        <template #item.customer.profileName="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="36" class="avatar-gradient mr-2">
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
          <v-menu location="bottom end" offset="4">
            <template #activator="{ props }">
              <span
                v-bind="props"
                :class="'status-' + item.status.toLowerCase()"
                class="status-chip cursor-pointer"
              >
                {{ item.status === 'DELETE' ? 'Cancelled' : item.status }}
                <v-icon end size="14">mdi-chevron-down</v-icon>
              </span>
            </template>
            <v-list density="compact" class="pa-1">
              <v-list-item class="menu-item" @click="updateStatus(item, 'CONFIRM')">
                <v-list-item-title class="text-body-2">Confirm</v-list-item-title>
              </v-list-item>
              <v-list-item class="menu-item" @click="updateStatus(item, 'APPROVED')">
                <v-list-item-title class="text-body-2">Approve</v-list-item-title>
              </v-list-item>
              <v-list-item class="menu-item" @click="updateStatus(item, 'DELETE')">
                <v-list-item-title class="text-body-2 text-error">Cancel</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template #item.date="{ item }">
          <span class="text-body-2 text-grey">{{ formatDate(item.date) }}</span>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            icon
            variant="text"
            color="primary"
            size="small"
            class="mr-1"
            @click="openEditDialog(item)"
          >
            <v-icon>mdi-pencil-outline</v-icon>
            <v-tooltip activator="parent" location="top">Edit</v-tooltip>
          </v-btn>
          <v-btn
            icon
            variant="text"
            color="error"
            size="small"
            @click="openDeleteDialog(item)"
          >
            <v-icon>mdi-delete-outline</v-icon>
            <v-tooltip activator="parent" location="top">Delete</v-tooltip>
          </v-btn>
        </template>

        <template #no-data>
          <div class="premium-empty-state">
            <v-icon>mdi-cart-outline</v-icon>
            <p class="empty-title">No bookings found</p>
            <p class="empty-text">Add bookings to get started</p>
            <v-btn color="primary" class="btn-primary mt-4" prepend-icon="mdi-plus" @click="openAddDialog">
              New Booking
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="700" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-6 pb-0">
          <div>
            <h3 class="text-h6 font-weight-bold text-grey-darken-3">{{ editing ? 'Edit Booking' : 'New Booking' }}</h3>
            <p class="text-caption text-grey mt-1">{{ editing ? 'Update booking information' : 'Create a new booking' }}</p>
          </div>
          <v-btn icon variant="text" size="small" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-form @submit.prevent="saveSale" class="pa-6 pt-4 premium-form">
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="saleForm.userAccountId"
                label="Tour Operator"
                :items="users"
                item-title="profileName"
                item-value="userAccountId"
                prepend-inner-icon="mdi-account-outline"
                :rules="[v => !!v || 'Operator is required']"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="saleForm.customerId"
                label="Customer"
                :items="users.filter(u => u.userType === 'CUSTOMER')"
                item-title="profileName"
                item-value="userAccountId"
                prepend-inner-icon="mdi-account-outline"
                :rules="[v => !!v || 'Customer is required']"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="saleForm.productId"
                label="Product"
                :items="products"
                item-title="title"
                item-value="productId"
                prepend-inner-icon="mdi-package-variant"
                :rules="[v => !!v || 'Product is required']"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                @update:model-value="onProductChange"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="saleForm.qty"
                label="Quantity"
                type="number"
                min="1"
                prepend-inner-icon="mdi-counter"
                :rules="[v => v > 0 || 'Quantity must be at least 1']"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="saleForm.unitPrice"
                label="Unit Price"
                type="number"
                min="0"
                prefix="$"
                prepend-inner-icon="mdi-currency-usd"
                :rules="[v => v >= 0 || 'Price must be valid']"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                :model-value="currencyFormatter.format(saleForm.amount)"
                label="Total Amount"
                readonly
                prepend-inner-icon="mdi-calculator"
                hint="Calculated as Qty x Unit Price"
                persistent-hint
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="font-weight-bold"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="saleForm.voucherCode"
                label="Voucher Code"
                prepend-inner-icon="mdi-ticket-percent"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="saleForm.paymentType"
                label="Payment Type"
                prepend-inner-icon="mdi-credit-card-outline"
                placeholder="e.g., Credit Card, Cash"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="saleForm.status"
                label="Status"
                :items="['CONFIRM', 'APPROVED', 'DELETE']"
                prepend-inner-icon="mdi-list-status"
                :rules="[v => !!v || 'Status is required']"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="saleForm.date"
                label="Booking Date"
                type="date"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-card-actions class="pa-0 pt-6">
            <v-spacer></v-spacer>
            <v-btn variant="outlined" class="mr-2" @click="dialog = false">Cancel</v-btn>
            <v-btn
              color="primary"
              type="submit"
              class="btn-primary"
              :disabled="!formValid"
            >
              {{ editing ? 'Update' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420" persistent>
      <v-card class="premium-dialog">
        <v-card-text class="pa-6 text-center">
          <v-avatar size="56" class="avatar-error mb-4">
            <v-icon size="28" color="white">mdi-alert-outline</v-icon>
          </v-avatar>
          <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">Confirm Delete</h3>
          <p class="text-body-2 text-grey">
            Are you sure you want to delete this booking? This action cannot be undone.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn variant="outlined" class="mr-2" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" class="btn-error" @click="deleteSale">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
</style>
