<template>
  <div>
    <!-- Stats Cards (Premium Glassmorphic Architecture) -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative">
          <div class="card-accent card-accent-green"></div>
          <v-card-text class="pa-4 pr-6">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Total Revenue</p>
                <p class="stat-value">{{ currencyFormatter.format(totalRevenue) }}</p>
                <p class="stat-trend">
                  <v-icon size="11" color="success">mdi-trending-up</v-icon>
                  <span class="ml-1">Gross earnings</span>
                </p>
              </div>
              
              <div class="stat-icon-container stat-icon-container-green">
                <v-icon size="18">mdi-cash-multiple</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative">
          <div class="card-accent card-accent-blue"></div>
          <v-card-text class="pa-4 pr-6">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Confirmed</p>
                <p class="stat-value">{{ confirmedBookings }}</p>
                <p class="stat-trend">
                  <v-icon size="11" color="primary">mdi-clock-check-outline</v-icon>
                  <span class="ml-1">Awaiting approval</span>
                </p>
              </div>
              <div class="stat-icon-container stat-icon-container-blue">
                <v-icon size="18">mdi-check-circle-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative">
          <div class="card-accent card-accent-amber"></div>
          <v-card-text class="pa-4 pr-6">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Approved</p>
                <p class="stat-value">{{ approvedBookings }}</p>
                <p class="stat-trend">
                  <v-icon size="11" color="warning">mdi-shield-check-outline</v-icon>
                  <span class="ml-1">Finalized bookings</span>
                </p>
              </div>
              <div class="stat-icon-container stat-icon-container-amber">
                <v-icon size="18">mdi-thumb-up-outline</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" style="position: relative">
          <div class="card-accent card-accent-red"></div>
          <v-card-text class="pa-4 pr-6">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="stat-label">Cancelled</p>
                <p class="stat-value">{{ cancelledBookings }}</p>
                <p class="stat-trend">
                  <v-icon size="11" color="error">mdi-alert-circle-outline</v-icon>
                  <span class="ml-1">Revoked bookings</span>
                </p>
              </div>
              <div class="stat-icon-container stat-icon-container-red">
                <v-icon size="18">mdi-cancel</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter Bar -->
    <v-card class="filter-bar-card mb-4 pa-3">
      <v-row align="center" no-gutters class="ga-2">
        <v-col cols="12" sm="5" md="4">
          <v-text-field
            v-model="search"
            label="Search bookings..."
            prepend-inner-icon="mdi-magnify"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="sleek-input"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" md="3">
          <v-select
            v-model="statusFilter"
            label="Status"
            :items="[
              { title: 'All', value: null },
              { title: 'Confirmed', value: 'CONFIRM' },
              { title: 'Approved', value: 'APPROVED' },
              { title: 'Cancelled', value: 'DELETE' },
            ]"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="sleek-input"
          ></v-select>
        </v-col>
        <v-spacer class="hidden-xs-only"></v-spacer>
        <v-col cols="auto" class="text-right">
          <v-btn
            color="primary"
            class="btn-primary text-none text-caption font-weight-bold"
            prepend-icon="mdi-plus"
            elevation="0"
            height="36"
            @click="openAddDialog"
          >
            New Booking
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Data Table Card -->
    <v-card class="enterprise-card">
      <v-card-title class="pa-4 pb-2">
        <div>
          <h3 class="card-title-text mb-0">Booking & Sales Registry</h3>
          <p class="card-subtitle-text mb-0">
            Manage tour client statements, operator validation and confirmations
          </p>
        </div>
      </v-card-title>

      <v-card-text class="pt-0 px-4 pb-4">
        <v-data-table
          :headers="headers"
          :items="saleList"
          hide-default-footer
          class="premium-table elevation-0"
          fixed-header
          height="480"
        >
          <!-- Auto Increment No. Column -->
          <template #item.index="{ index }">
           <span>{{index+1}}</span>
          </template>

          <!-- Booking ID -->
          <!-- <template #item.saleId="{ item }">
            <span
              class="text-caption font-weight-bold text-primary"
              style="font-size: 0.75rem !important"
            >
              #{{ item.saleId.slice(0, 8).toUpperCase() }}
            </span>
          </template> -->

          <!-- Customer Name -->
          <!-- <template #item.customer.profileName="{ item }">
            <div class="d-flex align-center py-1">
              <v-avatar size="28" class="avatar-gradient mr-2 glass-avatar">
                <span class="text-white font-weight-bold" style="font-size: 0.7rem">
                  {{ item.customer?.profileName?.charAt(0) || 'U' }}
                </span>
              </v-avatar>
              <span
                class="font-weight-semibold text-grey-darken-3"
                style="font-size: 0.8rem !important"
              >
                {{ item.customer?.profileName || 'N/A' }}
              </span>
            </div>
          </template> -->

          <!-- Product Title -->
          <!-- <template #item.product.title="{ item }">
            <span
              class="text-grey-darken-2 d-inline-block text-truncate"
              style="max-width: 180px; font-size: 0.8rem !important"
            >
              {{ item.product?.title || 'N/A' }}
            </span>
          </template> -->

          <!-- Unit Price -->
          <!-- <template #item.unitPrice="{ item }">
            <span
              class="text-grey-darken-1 font-weight-medium"
              style="font-size: 0.8rem !important"
            >
              {{ item.unitPrice }}
            </span>
          </template> -->

          <!-- Qty -->
          <!-- <template #item.qty="{ item }">
            <span
              class="text-grey-darken-1 font-weight-medium"
              style="font-size: 0.8rem !important"
            >
              {{ item.qty }}
            </span>
          </template> -->

          <!-- Amount -->
          <!-- <template #item.amount="{ item }">
            <span class="font-weight-bold text-primary" style="font-size: 0.8rem !important">
              {{ item.amount }}
            </span>
          </template> -->

          <!-- Voucher Code -->
          <!-- <template #item.voucherCode="{ item }">
            <span>
              {{ item.voucherCode }}
           </span>
          </template> -->

          <!-- Payment Type -->
          <!-- <template #item.paymentType="{ item }">
            <span class="text-grey-darken-1 text-caption" style="font-size: 0.8rem !important">
              {{ item.paymentType }}
            </span>
          </template> -->

          <!-- Status Dropdown Trigger (စတေးတပ်စ် ပြောင်းလဲရန် နေရာ) -->
          <!-- <template #item.status="{ item }">
            <v-menu location="bottom end" offset="4">
              <template #activator="{ props }">
                <span
                  v-bind="props"
                  :class="['status-chip', getStatusClass(item.status)]"
                  class="cursor-pointer d-inline-flex align-center"
                  style="gap: 4px; padding: 4px 10px; border-radius: 20px;"
                >
                  <v-icon size="12" class="mr-1">{{ getStatusIcon(item.status) }}</v-icon>
                  {{ formatStatusDisplay(item.status) }}
                  <v-icon end size="11" class="ml-1">mdi-chevron-down</v-icon>
                </span>
              </template> -->
              <!-- <v-list density="compact" class="pa-1 glass-menu">
                <v-list-item class="menu-item rounded-lg" @click="updateStatus(item, 'CONFIRM')">
                  <v-list-item-title class="text-caption font-weight-medium text-success d-flex align-center">
                    <v-icon size="14" class="mr-2" color="success">mdi-clock-outline</v-icon> Confirm
                  </v-list-item-title>
                </v-list-item>
                <v-list-item class="menu-item rounded-lg" @click="updateStatus(item, 'APPROVED')">
                  <v-list-item-title class="text-caption font-weight-medium text-primary d-flex align-center">
                    <v-icon size="14" class="mr-2" color="primary">mdi-check-circle-outline</v-icon> Approve
                  </v-list-item-title>
                </v-list-item>
                <v-list-item class="menu-item rounded-lg" @click="updateStatus(item, 'DELETE')">
                  <v-list-item-title class="text-caption font-weight-medium text-error d-flex align-center">
                    <v-icon size="14" class="mr-2" color="error">mdi-cancel</v-icon> Cancel (Delete)
                  </v-list-item-title>
                </v-list-item>
              </v-list> -->
            <!-- </v-menu>
          </template> -->

          <!-- Date -->
          <template #item.date="{ item }">
            <span class="text-grey-darken-1" style="font-size: 0.8rem !important">
              {{ formatDate(item.date) }}
            </span>
          </template>

          <!-- Modified Date -->
          <template #item.modifiedDate="{ item }">
            <span class="text-grey-darken-1" style="font-size: 0.8rem !important">
              {{ formatDate(item.modifiedDate) }}
            </span>
          </template>

          <!-- Actions (လုံးဝ ဖျက်ပစ်မည့် ခလုတ်) -->
          <template #item.actions="{ item }">
            <div class="d-flex align-center justify-end text-no-wrap">
              <v-btn
                icon
                variant="text"
                color="slate-600"
                size="small"
                class="mr-1"
                @click="openEditDialog(item)"
              >
                <v-icon size="18">mdi-pencil-outline</v-icon>
                <v-tooltip activator="parent" location="top">Edit</v-tooltip>
              </v-btn>
              <v-btn icon variant="text" color="error" size="small" @click="openDeleteDialog(item)">
                <v-icon size="18">mdi-delete-outline</v-icon>
                <v-tooltip activator="parent" location="top">Delete</v-tooltip>
              </v-btn>
            </div>
          </template>

          <!-- Empty State -->
          <!-- <template #no-data>
            <div class="premium-empty-state pa-6 text-center">
              <v-avatar size="48" color="grey-lighten-4" class="mb-2">
                <v-icon color="grey-darken-1" size="22">mdi-cart-off-outline</v-icon>
              </v-avatar>
              <p class="card-title-text mb-0">No bookings discovered</p>
              <p class="card-subtitle-text">
                Try modifying your text parameters or register a statement
              </p>
            </div>
          </template> -->
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="620px" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-5 pb-2">
          <div>
            <h3 class="card-title-text" style="font-size: 1.1rem !important">
              {{ editing ? 'Edit Booking Entry' : 'Create Booking Statement' }}
            </h3>
            <p class="card-subtitle-text">
              {{
                editing
                  ? 'Modify standard sales pipeline parameters'
                  : 'Provision a new customer seat itinerary allocation'
              }}
            </p>
          </div>
          <v-btn icon variant="text" size="small" @click="dialog = false">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="px-5 pb-5 pt-2 premium-form">
          <v-form @submit.prevent="saveSale">
            <v-row class="form-row-spacing">
              <v-col cols="12" sm="6">
                <!-- Tour Operator Space -->
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="saleForm.customer"
                  label="Customer"
                  :items="userList"
                  item-title="profileName"
                  prepend-inner-icon="mdi-account-outline"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="saleForm.productId"
                  label="Destination Product Package *"
                  :items="products"
                  item-title="title"
                  item-value="productId"
                  prepend-inner-icon="mdi-package-variant-closed"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                  @update:model-value="onProductChange"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="saleForm.qty"
                  label="Seat Quantity *"
                  type="number"
                  min="1"
                  prepend-inner-icon="mdi-format-list-numbered"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-text-field>
              </v-col>

              <!-- Unit Price Field -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="saleForm.unitPrice"
                  label="Unit Rate (Auto-filled) *"
                  type="number"
                  suffix="MMK"
                  prepend-inner-icon="mdi-tag-outline"
                  required
                  readonly
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input field-readonly"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  :model-value="currencyFormatter.format(saleForm.amount)"
                  label="Aggregated Total (ReadOnly)"
                  readonly
                  prepend-inner-icon="mdi-calculator"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input font-weight-bold field-readonly"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="saleForm.voucherCode"
                  label="Voucher Code"
                  prepend-inner-icon="mdi-ticket-percent-outline"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-text-field>
              </v-col>

              <!-- Payment Type Select Box -->
              <v-col cols="12" sm="6">
                <v-select
                  v-model="saleForm.paymentType"
                  label="Payment Type"
                  :items="['KBZpay', 'WAVEpay', 'AYApay']"
                  prepend-inner-icon="mdi-credit-card-outline"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="saleForm.status"
                  label="Workflow Pipeline Status *"
                  :items="['CONFIRM', 'APPROVED', 'DELETE']"
                  prepend-inner-icon="mdi-list-status"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="saleForm.date"
                  label="Booking Ledger Date"
                  type="date"
                  prepend-inner-icon="mdi-calendar-range"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-card-actions class="pa-0 pt-4">
              <v-spacer></v-spacer>
              <v-btn
                variant="outlined"
                class="mr-2 text-none text-caption font-weight-bold"
                height="34"
                @click="dialog = false"
                >Cancel</v-btn
              >
              <v-btn
                color="primary"
                type="submit"
                class="btn-primary text-none text-caption font-weight-bold"
                height="34"
                :disabled="!formValid"
              >
                {{ editing ? 'Update Ledger' : 'Create Ledger' }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="380" persistent>
      <v-card class="premium-dialog">
        <v-card-text class="pa-5 text-center">
          <v-avatar size="48" class="avatar-error mb-3">
            <v-icon size="24" color="white">mdi-alert-outline</v-icon>
          </v-avatar>
          <h3 class="card-title-text text-center mb-1" style="font-size: 1.05rem !important">
            Confirm Absolute Removal
          </h3>
          <p class="card-subtitle-text text-center">
            Are you sure you want to drop booking statement? This operations ledger layer cannot be
            restored.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn
            variant="outlined"
            class="mr-2 text-none text-caption font-weight-bold"
            height="32"
            @click="deleteDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="error"
            class="btn-error text-none text-caption font-weight-bold"
            height="32"
            @click="deleteSale"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { supabase } from '../../lib/supabase'
import type { Sale, UserAccount, Product } from '../../lib/supabase'
import saleService from '@/service/SaleService'
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
        paymentType: 'KBZpay',
        status: 'CONFIRM' as 'CONFIRM' | 'APPROVED' | 'DELETE',
        date: '',
        customer:{},
        product:{},
      },
      userList:[],
      editing: false,
      itemToDelete: null as Sale | null,
      headers: [
        { title: 'No.', key: 'index', align: 'start' as const, sortable: false },
        { title: 'Booking ID', key: 'saleId', align: 'start' as const },
        { title: 'Customer', key: 'customer.profileName', align: 'start' as const },
        { title: 'Product', key: 'product.title', align: 'start' as const },
        { title: 'Unit Price', key: 'unitPrice', align: 'end' as const },
        { title: 'Qty', key: 'qty', align: 'center' as const },
        { title: 'Total Amount', key: 'amount', align: 'end' as const },
        { title: 'Voucher Code', key: 'voucherCode', align: 'start' as const },
        { title: 'Payment Type', key: 'paymentType', align: 'start' as const },
        { title: 'Status', key: 'status', align: 'center' as const },
        { title: 'Date', key: 'date', align: 'start' as const },
        { title: 'Modified Date', key: 'modifiedDate', align: 'start' as const },
        { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
      ],
      saleList:[],
    }
  },
  computed: {
    filteredSales(): Sale[] {
      let result = [];
      this.getSaleMethod();
      // if (this.search) {
      //   const term = this.search.toLowerCase()
      //   result = result.filter(
      //     (s) =>
      //       s.saleId.toLowerCase().includes(term) ||
      //       (s.customer?.profileName && s.customer.profileName.toLowerCase().includes(term)) ||
      //       (s.product?.title && s.product.title.toLowerCase().includes(term)),
      //   )
      // }
      // if (this.statusFilter) {
      //   result = result.filter(
      //     (s) => (s.status || '').toUpperCase() === this.statusFilter?.toUpperCase()
      //   )
      // }
      return result
    },
    formValid(): boolean {
      return !!(
        this.saleForm.userAccountId &&
        this.saleForm.customerId &&
        this.saleForm.productId &&
        this.saleForm.qty > 0 &&
        this.saleForm.unitPrice >= 0
      )
    },

    currencyFormatter() {
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })

      return {
        format: (value: number) => `${formatter.format(value || 0)} MMK`,
      }
    },
    totalRevenue(): number {
      return this.sales
        .filter((s) => (s.status || '').toUpperCase() !== 'DELETE')
        .reduce((sum, s) => sum + (s.amount || 0), 0)
    },
    confirmedBookings(): number {
      return this.sales.filter(
        (s) => {
          const status = (s.status || '').toUpperCase();
          return status === 'CONFIRM' || status === 'CONFIRMED';
        }
      ).length
    },
    approvedBookings(): number {
      return this.sales.filter(
        (s) => {
          const status = (s.status || '').toUpperCase();
          return status === 'APPROVED' || status === 'APPROVE';
        }
      ).length
    },
    cancelledBookings(): number {
      return this.sales.filter((s) => (s.status || '').toUpperCase() === 'DELETE').length
    },
  },
  async mounted() {
    this.getSaleMethod();
    await Promise.all([this.fetchSales(), this.fetchUsers(), this.fetchProducts()])
  },
  methods: {
    
    getSaleMethod(){
            saleService
        .getSale("All")
        .then((response) => {
          this.saleList.splice(0);
          this.saleList.push(...response);
        })
        .catch((err) => {
          console.error('API Fetch Error: ', err)
        })
    },
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
        paymentType: 'KBZpay',
        status: 'CONFIRM',
        date: today,
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
        paymentType: sale.paymentType || 'KBZpay',
        status: sale.status,
        date: sale.date ? new Date(sale.date).toISOString().split('T')[0] : '',
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
          date: this.saleForm.date || null,
        }

        if (this.editing) {
          const { error } = await supabase
            .from('sale')
            .update(payload)
            .eq('saleId', this.saleForm.saleId)
          if (error) throw error
        } else {
          const { error } = await supabase.from('sale').insert([payload])
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
      const product = this.products.find((p) => p.productId === this.saleForm.productId)
      if (product) {
        this.saleForm.unitPrice = product.amount
        this.calculateAmount()
      }
    },

    calculateAmount() {
      this.saleForm.amount = this.saleForm.qty * this.saleForm.unitPrice
    },

    // Case-insensitive helpers for UI
    getStatusClass(status: string): string {
      const s = (status || '').toUpperCase()
      if (s === 'CONFIRM' || s === 'CONFIRMED') return 'status-confirm'
      if (s === 'APPROVED' || s === 'APPROVE') return 'chip-standard'
      return 'status-delete'
    },

    getStatusIcon(status: string): string {
      const s = (status || '').toUpperCase()
      if (s === 'CONFIRM' || s === 'CONFIRMED') return 'mdi-clock-outline'
      if (s === 'APPROVED' || s === 'APPROVE') return 'mdi-check-circle-outline'
      return 'mdi-cancel'
    },

    formatStatusDisplay(status: string): string {
      const s = (status || '').toUpperCase()
      if (s === 'CONFIRM' || s === 'CONFIRMED') return 'Confirmed'
      if (s === 'APPROVED' || s === 'APPROVE') return 'Approved'
      if (s === 'DELETE' || s === 'CANCELLED') return 'Cancelled'
      return status || 'N/A'
    },

    formatDate(date: string | null): string {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
  },
  watch: {
    'saleForm.qty'() {
      this.calculateAmount()
    },
    'saleForm.unitPrice'() {
      this.calculateAmount()
    },
  },
})
</script>

<style scoped>
/* Glassmorphism & Modern Micro Elements */
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

.enterprise-card,
.filter-bar-card {
  background: rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(16px) saturate(120%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(120%) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 6px 24px 0 rgba(31, 38, 135, 0.03) !important;
  border-radius: 14px !important;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
}

/* Compact Core Typography Hierarchy */
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

/* Interactivity & Neon Edge Glow Effect */
.stat-card:hover,
.enterprise-card:hover,
.filter-bar-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.65) !important;
}

.card-accent {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 4px;
  height: 100%;
}

.stat-card:has(.card-accent-green):hover {
  box-shadow: 0 6px 24px 0 rgba(76, 175, 80, 0.15) !important;
  border-color: rgba(76, 175, 80, 0.3) !important;
}
.stat-card:has(.card-accent-blue):hover {
  box-shadow: 0 6px 24px 0 rgba(33, 150, 243, 0.15) !important;
  border-color: rgba(33, 150, 243, 0.3) !important;
}
.stat-card:has(.card-accent-amber):hover {
  box-shadow: 0 6px 24px 0 rgba(255, 193, 7, 0.15) !important;
  border-color: rgba(255, 193, 7, 0.3) !important;
}
.stat-card:has(.card-accent-red):hover {
  box-shadow: 0 6px 24px 0 rgba(244, 67, 54, 0.15) !important;
  border-color: rgba(244, 67, 54, 0.3) !important;
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
.card-accent-red {
  background: linear-gradient(180deg, #f44336, #ef5350);
}

/* Minimal Layout Elements */
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
.stat-icon-container-red {
  background: rgba(244, 67, 54, 0.08);
  color: #c62828 !important;
}

.stat-label {
  font-size: 0.725rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 1px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.stat-value {
  font-size: 1.2rem;
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

/* Glass Input Control Framework */
.sleek-input :deep(.v-field) {
  border-radius: 8px !important;
  background-color: rgba(255, 255, 255, 0.3) !important;
  border: 1px solid rgba(226, 232, 240, 0.8) !important;
  transition: all 0.25s ease-in-out;
}
.sleek-input :deep(.v-field--focused) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12) !important;
}
.sleek-input :deep(.v-field__outline) {
  display: none !important;
}
.sleek-input :deep(.v-label) {
  font-size: 0.8rem !important;
  color: #64748b !important;
}
.field-readonly :deep(.v-field) {
  background-color: rgba(241, 245, 249, 0.5) !important;
}

/* High-Density Dense Directory Table */
.premium-table {
  background: transparent !important;
}
.premium-table :deep(th) {
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  color: #475569 !important;
  background: rgba(241, 245, 249, 0.4) !important;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
  padding: 8px 12px !important;
  white-space: nowrap !important;
}
.premium-table :deep(td) {
  border-bottom: 1px solid rgba(241, 245, 249, 0.3) !important;
  padding: 6px 12px !important;
  white-space: nowrap !important;
}

.avatar-gradient {
  background: linear-gradient(135deg, #6366f1, #3b82f6);
}
.glass-avatar {
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
}

/* Micro Action Badges */
.status-chip {
  display: inline-flex;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  border: 1px solid transparent;
}
.status-confirm {
  background: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
  border-color: rgba(76, 175, 80, 0.2);
}
.chip-standard {
  background: rgba(33, 150, 243, 0.1);
  color: #1565c0;
  border-color: rgba(33, 150, 243, 0.2);
}
.status-delete {
  background: rgba(244, 67, 54, 0.1);
  color: #c62828;
  border-color: rgba(244, 67, 54, 0.2);
}

.glass-menu {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

/* Elegant Dialog Setup */
.premium-dialog {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(24px) saturate(140%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(140%) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 16px !important;
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.08) !important;
}

.form-row-spacing > div {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

/* Action Control Highlights */
.avatar-error {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: white !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px 0 rgba(59, 130, 246, 0.15) !important;
}

.btn-error {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
  color: white !important;
  border-radius: 8px !important;
}
</style>