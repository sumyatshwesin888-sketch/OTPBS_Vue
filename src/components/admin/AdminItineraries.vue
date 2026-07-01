<script lang="ts">
import { defineComponent } from 'vue'
import { supabase } from '../../lib/supabase'
import type { Itinerary, Product } from '../../lib/supabase'

export default defineComponent({
  name: 'AdminItineraries',
  data() {
    return {
      itineraries: [] as Itinerary[],
      products: [] as Product[],
      loading: true,
      dialog: false,
      deleteDialog: false,
      search: '',
      productFilter: null as string | null,
      expandedProduct: null as string | null,
      itineraryForm: {
        itineraryId: '',
        productId: '',
        title: '',
        detail: '',
        dayNo: 1
      },
      editing: false,
      itemToDelete: null as Itinerary | null,
      headers: [
        { title: 'Day', key: 'dayNo', width: 80, align: 'center' as const },
        { title: 'Title', key: 'title', align: 'start' as const },
        { title: 'Product', key: 'product.title', align: 'start' as const },
        { title: 'Detail', key: 'detail', sortable: false },
        { title: 'Actions', key: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    filteredItineraries(): Itinerary[] {
      let result = this.itineraries
      if (this.search) {
        const term = this.search.toLowerCase()
        result = result.filter(i =>
          i.title.toLowerCase().includes(term) ||
          (i.detail && i.detail.toLowerCase().includes(term))
        )
      }
      if (this.productFilter) {
        result = result.filter(i => i.productId === this.productFilter)
      }
      return result.sort((a, b) => a.dayNo - b.dayNo)
    },
    formValid(): boolean {
      return !!(this.itineraryForm.title && this.itineraryForm.productId && this.itineraryForm.dayNo > 0)
    },

    itinerariesByProduct(): Record<string, Itinerary[]> {
      const grouped: Record<string, Itinerary[]> = {}
      this.filteredItineraries.forEach(i => {
        if (!grouped[i.productId]) {
          grouped[i.productId] = []
        }
        grouped[i.productId].push(i)
      })
      return grouped
    }
  },
  async mounted() {
    await Promise.all([this.fetchItineraries(), this.fetchProducts()])
  },
  methods: {
    async fetchItineraries() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('itinerary')
          .select('*, product(*)')
          .order('dayNo', { ascending: true })

        if (error) throw error
        this.itineraries = data || []
      } catch (error) {
        console.error('Error fetching itineraries:', error)
      } finally {
        this.loading = false
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
      this.itineraryForm = {
        itineraryId: '',
        productId: this.products[0]?.productId || '',
        title: '',
        detail: '',
        dayNo: 1
      }
      this.dialog = true
    },

    openAddForProduct(productId: string) {
      const productItineraries = this.itineraries.filter(i => i.productId === productId)
      const nextDay = productItineraries.length > 0
        ? Math.max(...productItineraries.map(i => i.dayNo)) + 1
        : 1

      this.editing = false
      this.itineraryForm = {
        itineraryId: '',
        productId,
        title: '',
        detail: '',
        dayNo: nextDay
      }
      this.dialog = true
    },

    openEditDialog(itinerary: Itinerary) {
      this.editing = true
      this.itineraryForm = {
        itineraryId: itinerary.itineraryId,
        productId: itinerary.productId,
        title: itinerary.title,
        detail: itinerary.detail || '',
        dayNo: itinerary.dayNo
      }
      this.dialog = true
    },

    async saveItinerary() {
      try {
        const payload = {
          productId: this.itineraryForm.productId,
          title: this.itineraryForm.title,
          detail: this.itineraryForm.detail || null,
          dayNo: this.itineraryForm.dayNo
        }

        if (this.editing) {
          const { error } = await supabase
            .from('itinerary')
            .update(payload)
            .eq('itineraryId', this.itineraryForm.itineraryId)

          if (error) throw error
        } else {
          const { error } = await supabase
            .from('itinerary')
            .insert([payload])

          if (error) throw error
        }

        this.dialog = false
        await this.fetchItineraries()
      } catch (error) {
        console.error('Error saving itinerary:', error)
      }
    },

    openDeleteDialog(itinerary: Itinerary) {
      this.itemToDelete = itinerary
      this.deleteDialog = true
    },

    async deleteItinerary() {
      if (!this.itemToDelete) return

      try {
        const { error } = await supabase
          .from('itinerary')
          .delete()
          .eq('itineraryId', this.itemToDelete.itineraryId)

        if (error) throw error

        this.deleteDialog = false
        this.itemToDelete = null
        await this.fetchItineraries()
      } catch (error) {
        console.error('Error deleting itinerary:', error)
      }
    },

    toggleProductExpand(productId: string) {
      if (this.expandedProduct === productId) {
        this.expandedProduct = null
      } else {
        this.expandedProduct = productId
      }
    },

    getItinerariesForProduct(productId: string): Itinerary[] {
      return this.itineraries
        .filter(i => i.productId === productId)
        .sort((a, b) => a.dayNo - b.dayNo)
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
            label="Search itineraries..."
            prepend-inner-icon="mdi-magnify"
            density="comfortable"
            variant="outlined"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="productFilter"
            label="Filter by Product"
            :items="[
              { title: 'All Products', value: null },
              ...products.map(p => ({ title: p.title, value: p.productId }))
            ]"
            density="comfortable"
            variant="outlined"
            hide-details
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" md="6" class="text-right">
          <v-btn
            color="primary"
            class="btn-primary"
            prepend-icon="mdi-plus"
            @click="openAddDialog"
          >
            Add Itinerary
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Product Cards with Itineraries -->
    <v-row>
      <v-col cols="12">
        <v-card class="enterprise-card pa-6" v-if="products.length === 0 && !loading">
          <div class="premium-empty-state">
            <v-icon>mdi-package-variant</v-icon>
            <p class="empty-title">No products available</p>
            <p class="empty-text">Create products first before adding itineraries</p>
          </div>
        </v-card>

        <div v-else>
          <v-expansion-panels v-model="expandedProduct" class="premium-expansion">
            <v-expansion-panel
              v-for="product in products"
              :key="product.productId"
              :value="product.productId"
              class="mb-3"
            >
              <v-expansion-panel-title class="py-4">
                <div class="d-flex align-center w-100">
                  <v-avatar size="48" rounded="lg" class="mr-3" color="grey-lighten-3">
                    <v-img v-if="product.photo" :src="product.photo" cover></v-img>
                    <v-icon v-else color="grey">mdi-package-variant</v-icon>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <p class="text-h6 font-weight-bold mb-0" style="color: #0f172a;">{{ product.title }}</p>
                    <p class="text-caption text-grey mb-0">
                      <v-icon size="14">mdi-map-marker</v-icon>
                      {{ product.location || 'Unknown' }}
                    </p>
                  </div>
                  <span class="status-chip" style="background: rgba(59,130,246,0.1); color: #2563eb;">
                    <v-icon start size="14">mdi-calendar-check</v-icon>
                    {{ getItinerariesForProduct(product.productId).length }} days
                  </span>
                </div>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <div class="d-flex justify-end mb-4">
                  <v-btn
                    color="primary"
                    class="btn-primary"
                    prepend-icon="mdi-plus"
                    size="small"
                    @click="openAddForProduct(product.productId)"
                  >
                    Add Day
                  </v-btn>
                </div>

                <v-timeline side="end" align="start" truncate-line="both">
                  <v-timeline-item
                    v-for="itinerary in getItinerariesForProduct(product.productId)"
                    :key="itinerary.itineraryId"
                    :dot-color="itinerary.dayNo % 2 === 0 ? 'primary' : 'info'"
                    size="small"
                  >
                    <template #opposite>
                      <div class="text-h6 font-weight-bold" style="color: #2563eb;">
                        Day {{ itinerary.dayNo }}
                      </div>
                    </template>

                    <v-card class="enterprise-card ml-4">
                      <v-card-text class="pa-4">
                        <div class="d-flex justify-space-between align-start">
                          <div>
                            <p class="text-subtitle-1 font-weight-bold mb-2" style="color: #0f172a;">{{ itinerary.title }}</p>
                            <p class="text-body-2 text-grey" v-if="itinerary.detail">
                              {{ itinerary.detail }}
                            </p>
                            <v-chip v-else color="grey-lighten-2" size="x-small">No details</v-chip>
                          </div>
                          <div>
                            <v-btn
                              icon
                              variant="text"
                              color="primary"
                              size="small"
                              class="mr-1"
                              @click="openEditDialog(itinerary)"
                            >
                              <v-icon>mdi-pencil-outline</v-icon>
                              <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                            </v-btn>
                            <v-btn
                              icon
                              variant="text"
                              color="error"
                              size="small"
                              @click="openDeleteDialog(itinerary)"
                            >
                              <v-icon>mdi-delete-outline</v-icon>
                              <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                            </v-btn>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-timeline-item>

                  <v-timeline-item
                    v-if="getItinerariesForProduct(product.productId).length === 0"
                    dot-color="grey-lighten-1"
                    size="small"
                  >
                    <v-card class="enterprise-card ml-4">
                      <v-card-text class="text-center text-grey pa-6">
                        <v-icon size="32" class="mb-2">mdi-calendar-remove</v-icon>
                        <p class="mb-2">No itinerary added yet</p>
                        <v-btn
                          color="primary"
                          class="btn-primary"
                          size="small"
                          @click="openAddForProduct(product.productId)"
                        >
                          Add First Day
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-6 pb-0">
          <div>
            <h3 class="text-h6 font-weight-bold text-grey-darken-3">{{ editing ? 'Edit Itinerary' : 'Add New Itinerary' }}</h3>
            <p class="text-caption text-grey mt-1">{{ editing ? 'Update itinerary details' : 'Create a new itinerary day' }}</p>
          </div>
          <v-btn icon variant="text" size="small" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-form @submit.prevent="saveItinerary" class="pa-6 pt-4 premium-form">
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="itineraryForm.productId"
                label="Product"
                :items="products"
                item-title="title"
                item-value="productId"
                :rules="[v => !!v || 'Product is required']"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model.number="itineraryForm.dayNo"
                label="Day Number"
                type="number"
                min="1"
                :rules="[v => v > 0 || 'Day number must be at least 1']"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="8">
              <v-text-field
                v-model="itineraryForm.title"
                label="Title"
                :rules="[v => !!v || 'Title is required']"
                required
                placeholder="e.g., Arrival & City Tour"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="itineraryForm.detail"
                label="Details"
                rows="4"
                placeholder="Describe the activities for this day..."
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              ></v-textarea>
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
            Are you sure you want to delete <strong>{{ itemToDelete?.title }}</strong>? This action cannot be undone.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn variant="outlined" class="mr-2" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" class="btn-error" @click="deleteItinerary">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
</style>
