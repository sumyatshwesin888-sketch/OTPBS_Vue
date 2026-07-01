<script lang="ts">
import { defineComponent } from 'vue'
import { supabase } from '../lib/supabase'
import type { Product, UserAccount, Hotel } from '../lib/supabase'

export default defineComponent({
  name: 'Products',
  data() {
    return {
      products: [] as Product[],
      users: [] as UserAccount[],
      hotels: [] as Hotel[],
      loading: true,
      dialog: false,
      deleteDialog: false,
      search: '',
      typeFilter: null as string | null,
      locationTypeFilter: null as string | null,
      currentStep: 1,
      productForm: {
        productId: '',
        userAccountId: '',
        hotelId: '' as string | null,
        locationType: 'DOMESTIC' as 'DOMESTIC' | 'INTERNATIONAL',
        photo: '',
        title: '',
        location: '',
        day: 0,
        night: 0,
        groupSize: 0,
        amount: 0,
        type: 'Standard' as 'Budget' | 'Standard' | 'Premium',
        meals: '',
        photoOne: '',
        photoTwo: '',
        photoThree: '',
        photoFour: '',
        detail: '',
        travelDate: '',
        ticket: ''
      },
      editing: false,
      itemToDelete: null as Product | null,
      headers: [
        { title: 'Product', key: 'title', align: 'start' as const },
        { title: 'Type', key: 'type', align: 'start' as const },
        { title: 'Location', key: 'locationType', align: 'start' as const },
        { title: 'Duration', key: 'duration', sortable: false },
        { title: 'Price', key: 'amount', align: 'end' as const },
        { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const }
      ],
      steps: ['Basic Info', 'Details', 'Photos & Extra']
    }
  },
  computed: {
    filteredProducts(): Product[] {
      let result = this.products
      if (this.search) {
        const term = this.search.toLowerCase()
        result = result.filter(p =>
          p.title.toLowerCase().includes(term) ||
          (p.location && p.location.toLowerCase().includes(term))
        )
      }
      if (this.typeFilter) {
        result = result.filter(p => p.type === this.typeFilter)
      }
      if (this.locationTypeFilter) {
        result = result.filter(p => p.locationType === this.locationTypeFilter)
      }
      return result
    },
    formValid(): boolean {
      return !!(this.productForm.title && this.productForm.userAccountId && this.productForm.amount > 0)
    },
    currencyFormatter() {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    }
  },
  async mounted() {
    await Promise.all([this.fetchProducts(), this.fetchUsers(), this.fetchHotels()])
  },
  methods: {
    async fetchProducts() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('product')
          .select('*, userAccount(*), hotel(*, city(*))')
          .order('created_at', { ascending: false })

        if (error) throw error
        this.products = data || []
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchUsers() {
      try {
        const { data } = await supabase.from('user_account').select('*')
        this.users = data || []
        if (this.users.length > 0) {
          this.productForm.userAccountId = this.users[0].userAccountId
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    },

    async fetchHotels() {
      try {
        const { data } = await supabase.from('hotel').select('*, city(*)')
        this.hotels = data || []
      } catch (error) {
        console.error('Error fetching hotels:', error)
      }
    },

    openAddDialog() {
      this.editing = false
      this.currentStep = 1
      this.productForm = {
        productId: '',
        userAccountId: this.users[0]?.userAccountId || '',
        hotelId: null,
        locationType: 'DOMESTIC',
        photo: '',
        title: '',
        location: '',
        day: 0,
        night: 0,
        groupSize: 0,
        amount: 0,
        type: 'Standard',
        meals: '',
        photoOne: '',
        photoTwo: '',
        photoThree: '',
        photoFour: '',
        detail: '',
        travelDate: '',
        ticket: ''
      }
      this.dialog = true
    },

    openEditDialog(product: Product) {
      this.editing = true
      this.currentStep = 1
      this.productForm = {
        productId: product.productId,
        userAccountId: product.userAccountId,
        hotelId: product.hotelId || null,
        locationType: product.locationType,
        photo: product.photo || '',
        title: product.title,
        location: product.location || '',
        day: product.day || 0,
        night: product.night || 0,
        groupSize: product.groupSize || 0,
        amount: product.amount,
        type: product.type,
        meals: product.meals || '',
        photoOne: product.photoOne || '',
        photoTwo: product.photoTwo || '',
        photoThree: product.photoThree || '',
        photoFour: product.photoFour || '',
        detail: product.detail || '',
        travelDate: product.travelDate || '',
        ticket: product.ticket || ''
      }
      this.dialog = true
    },

    async saveProduct() {
      try {
        const payload = {
          userAccountId: this.productForm.userAccountId,
          hotelId: this.productForm.hotelId || null,
          locationType: this.productForm.locationType,
          photo: this.productForm.photo || null,
          title: this.productForm.title,
          location: this.productForm.location || null,
          day: this.productForm.day || null,
          night: this.productForm.night || null,
          groupSize: this.productForm.groupSize || null,
          amount: this.productForm.amount,
          type: this.productForm.type,
          meals: this.productForm.meals || null,
          photoOne: this.productForm.photoOne || null,
          photoTwo: this.productForm.photoTwo || null,
          photoThree: this.productForm.photoThree || null,
          photoFour: this.productForm.photoFour || null,
          detail: this.productForm.detail || null,
          travelDate: this.productForm.travelDate || null,
          ticket: this.productForm.ticket || null
        }

        if (this.editing) {
          const { error } = await supabase
            .from('product')
            .update(payload)
            .eq('productId', this.productForm.productId)

          if (error) throw error
        } else {
          const { error } = await supabase
            .from('product')
            .insert([payload])

          if (error) throw error
        }

        this.dialog = false
        await this.fetchProducts()
      } catch (error) {
        console.error('Error saving product:', error)
      }
    },

    openDeleteDialog(product: Product) {
      this.itemToDelete = product
      this.deleteDialog = true
    },

    async deleteProduct() {
      if (!this.itemToDelete) return

      try {
        const { error } = await supabase
          .from('product')
          .delete()
          .eq('productId', this.itemToDelete.productId)

        if (error) throw error

        this.deleteDialog = false
        this.itemToDelete = null
        await this.fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    },

    getTypeColor(type: string): string {
      return type === 'Budget' ? 'success' : type === 'Standard' ? 'info' : 'warning'
    },

    getTypeClass(type: string): string {
      return `chip-${type.toLowerCase()}`
    },

    getDuration(product: Product): string {
      const day = product.day || 0
      const night = product.night || 0
      return `${day} Days ${night} Nights`
    },

    formatDate(date: string | null): string {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
  }
})
</script>

<template>
  <div>
    <!-- Filter Bar -->
    <v-card class="filter-bar mb-6">
      <v-row align="center">
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="search"
            label="Search products..."
            prepend-inner-icon="mdi-magnify"
            density="comfortable"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-select
            v-model="typeFilter"
            label="Package Type"
            :items="[
              { title: 'All', value: null },
              { title: 'Budget', value: 'Budget' },
              { title: 'Standard', value: 'Standard' },
              { title: 'Premium', value: 'Premium' }
            ]"
            density="comfortable"
            variant="outlined"
            hide-details
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-select
            v-model="locationTypeFilter"
            label="Location Type"
            :items="[
              { title: 'All', value: null },
              { title: 'Domestic', value: 'DOMESTIC' },
              { title: 'International', value: 'INTERNATIONAL' }
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
            Add Product
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Data Table -->
    <v-card class="enterprise-card">
      <v-data-table
        :headers="headers"
        :items="filteredProducts"
        :loading="loading"
        item-value="productId"
        class="premium-table elevation-0"
      >
        <template #item.title="{ item }">
          <div class="d-flex align-center py-3">
            <v-avatar size="48" rounded="lg" class="mr-3" color="grey-lighten-3">
              <v-img v-if="item.photo" :src="item.photo" cover></v-img>
              <v-icon v-else color="grey">mdi-package-variant</v-icon>
            </v-avatar>
            <div>
              <p class="font-weight-medium text-grey-darken-3 mb-0">{{ item.title }}</p>
              <p class="text-caption text-grey mb-0">
                <v-icon size="14">mdi-map-marker</v-icon>
                {{ item.location || 'Unknown' }}
              </p>
            </div>
          </div>
        </template>

        <template #item.type="{ item }">
          <span :class="getTypeClass(item.type)" class="status-chip">
            {{ item.type }}
          </span>
        </template>

        <template #item.locationType="{ item }">
          <span
            :class="item.locationType === 'DOMESTIC' ? 'chip-domestic' : 'chip-international'"
            class="status-chip"
          >
            <v-icon start size="14">{{ item.locationType === 'DOMESTIC' ? 'mdi-home' : 'mdi-airplane' }}</v-icon>
            {{ item.locationType }}
          </span>
        </template>

        <template #item.duration="{ item }">
          <span class="text-body-2">
            <v-icon size="14" color="grey" class="mr-1">mdi-calendar</v-icon>
            {{ getDuration(item) }}
          </span>
        </template>

        <template #item.amount="{ item }">
          <span class="font-weight-bold text-body-2" style="color: #2563eb;">{{ currencyFormatter.format(item.amount) }}</span>
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
            <v-icon>mdi-package-variant</v-icon>
            <p class="empty-title">No products found</p>
            <p class="empty-text">Add tour packages to get started</p>
            <v-btn color="primary" class="btn-primary mt-4" prepend-icon="mdi-plus" @click="openAddDialog">
              Add Product
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="900" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-6 pb-0">
          <div>
            <h3 class="text-h6 font-weight-bold text-grey-darken-3">{{ editing ? 'Edit Product' : 'Add New Product' }}</h3>
            <p class="text-caption text-grey mt-1">{{ editing ? 'Update product information' : 'Create a new tour package' }}</p>
          </div>
          <v-btn icon variant="text" size="small" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-stepper v-model="currentStep" class="rounded-0 elevation-0" alt-labels>
          <v-stepper-header>
            <v-stepper-item :value="1" title="Basic Info" subtitle="Title & Type" :complete="currentStep > 1"></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item :value="2" title="Details" subtitle="Duration & Price" :complete="currentStep > 2"></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item :value="3" title="Photos" subtitle="Images & Extras"></v-stepper-item>
          </v-stepper-header>

          <v-stepper-window>
            <v-stepper-window-item :value="1">
              <v-form class="pa-4 premium-form">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="productForm.title"
                      label="Product Title"
                      :rules="[v => !!v || 'Title is required']"
                      required
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="productForm.userAccountId"
                      label="Tour Operator"
                      :items="users"
                      item-title="profileName"
                      item-value="userAccountId"
                      :rules="[v => !!v || 'Operator is required']"
                      required
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="productForm.location"
                      label="Location"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="productForm.hotelId"
                      label="Hotel"
                      :items="hotels"
                      item-title="hotelName"
                      item-value="hotelId"
                      clearable
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="productForm.locationType"
                      label="Location Type"
                      :items="['DOMESTIC', 'INTERNATIONAL']"
                      :rules="[v => !!v || 'Location type is required']"
                      required
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="productForm.type"
                      label="Package Type"
                      :items="['Budget', 'Standard', 'Premium']"
                      :rules="[v => !!v || 'Package type is required']"
                      required
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-form>
            </v-stepper-window-item>

            <v-stepper-window-item :value="2">
              <v-form class="pa-4 premium-form">
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model.number="productForm.day"
                      label="Number of Days"
                      type="number"
                      min="0"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model.number="productForm.night"
                      label="Number of Nights"
                      type="number"
                      min="0"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model.number="productForm.groupSize"
                      label="Group Size"
                      type="number"
                      min="0"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model.number="productForm.amount"
                      label="Price"
                      type="number"
                      min="0"
                      prefix="$"
                      :rules="[v => v > 0 || 'Price must be greater than 0']"
                      required
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="productForm.meals"
                      label="Meals Included"
                      placeholder="e.g., Breakfast, Lunch"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="productForm.travelDate"
                      label="Travel Date"
                      type="date"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="productForm.ticket"
                      label="Ticket Type"
                      placeholder="e.g., Economy Class"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="productForm.detail"
                      label="Detailed Description"
                      rows="4"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-form>
            </v-stepper-window-item>

            <v-stepper-window-item :value="3">
              <v-form class="pa-4 premium-form">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="productForm.photo"
                      label="Main Photo URL"
                      hint="Enter a valid image URL"
                      persistent-hint
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    >
                      <template #append>
                        <v-btn v-if="productForm.photo" color="primary" variant="text" size="small">
                          Preview
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="productForm.photoOne"
                      label="Photo 1 URL"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="productForm.photoTwo"
                      label="Photo 2 URL"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="productForm.photoThree"
                      label="Photo 3 URL"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="productForm.photoFour"
                      label="Photo 4 URL"
                      variant="outlined"
                      density="comfortable"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-stepper-window-item>
          </v-stepper-window>

          <v-stepper-actions>
            <template #prev>
              <v-btn
                v-if="currentStep > 1"
                variant="outlined"
                @click="currentStep--"
              >
                Previous
              </v-btn>
            </template>
            <template #next>
              <v-btn
                v-if="currentStep < 3"
                color="primary"
                class="btn-primary"
                @click="currentStep++"
              >
                Next
              </v-btn>
              <v-btn
                v-else
                color="primary"
                class="btn-primary"
                :disabled="!formValid"
                @click="saveProduct"
              >
                {{ editing ? 'Update' : 'Create' }}
              </v-btn>
            </template>
          </v-stepper-actions>
        </v-stepper>
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
            Are you sure you want to delete <strong>{{ itemToDelete?.title }}</strong>? This will also delete associated itineraries and bookings.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn variant="outlined" class="mr-2" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" class="btn-error" @click="deleteProduct">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
</style>
