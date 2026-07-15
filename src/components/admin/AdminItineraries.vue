<template>
  <div>
    <!-- Compact Filter Bar -->
    <v-card class="filter-bar-card mb-4 pa-3">
      <v-row align="center" no-gutters class="ga-2">
        <v-col cols="12" sm="5" md="3">
          <v-text-field
            v-model="search"
            label="Search itineraries..."
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
            v-model="productFilter"
            label="Filter by Product Package"
            :items="[
              { title: 'All Products', value: null },
              ...products.map(p => ({ title: p.title, value: p.productId }))
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
            Add Itinerary
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Product Cards with Itineraries Matrix -->
    <v-row no-gutters>
      <v-col cols="12">
        <!-- Empty State Container for Products -->
        <v-card class="enterprise-card pa-6 text-center" v-if="products.length === 0 && !loading">
          <div class="premium-empty-state pa-4">
            <v-avatar size="48" color="grey-lighten-4" class="mb-2">
              <v-icon color="grey-darken-1" size="22">mdi-package-variant-remove</v-icon>
            </v-avatar>
            <p class="card-title-text mb-0">No destination packages available</p>
            <p class="card-subtitle-text">Create products first inside the registry before configuring timelines</p>
          </div>
        </v-card>

        <!-- Glassmorphic Expansion System -->
        <div v-else>
          <v-expansion-panels v-model="expandedProduct" class="premium-expansion">
            <v-expansion-panel
              v-for="product in products"
              :key="product.productId"
              :value="product.productId"
              class="mb-3 glass-panel"
            >
              <v-expansion-panel-title class="py-3 px-4">
                <div class="d-flex align-center w-100 pr-2">
                  <v-avatar size="38" rounded="lg" class="mr-3 glass-avatar shadow-glow-avatar" color="grey-lighten-4">
                    <v-img v-if="product.photo" :src="product.photo" cover></v-img>
                    <v-icon v-else size="18" color="grey-darken-1">mdi-package-variant</v-icon>
                  </v-avatar>
                  <div class="flex-grow-1 min-width-0">
                    <p class="card-title-text text-truncate mb-0">{{ product.title }}</p>
                    <p class="card-subtitle-text text-truncate mb-0 d-flex align-center">
                      <v-icon size="11" class="mr-1">mdi-map-marker-outline</v-icon>
                      {{ product.location || 'Location Unspecified' }}
                    </p>
                  </div>
                  <span class="status-chip chip-cyan d-inline-flex align-center ml-2" style="gap: 4px;">
                    <v-icon size="11">mdi-calendar-clock</v-icon>
                    {{ getItinerariesForProduct(product.productId).length }} Days Plan
                  </span>
                </div>
              </v-expansion-panel-title>

              <v-expansion-panel-text class="px-2 pt-2 pb-1">
                <div class="d-flex justify-end mb-3">
                  <v-btn
                    color="primary"
                    class="btn-primary text-none text-caption font-weight-bold"
                    prepend-icon="mdi-plus"
                    size="small"
                    height="30"
                    @click="openAddForProduct(product.productId)"
                  >
                    Add Day Schedule
                  </v-btn>
                </div>

                <!-- High-Density Dynamic Itinerary Timeline -->
                <v-timeline side="end" align="start" truncate-line="both" class="compact-timeline justify-start pa-0">
                  <v-timeline-item
                    v-for="itinerary in getItinerariesForProduct(product.productId)"
                    :key="itinerary.itineraryId"
                    :dot-color="itinerary.dayNo % 2 === 0 ? 'primary' : 'indigo'"
                    size="x-small"
                    class="timeline-item-custom mb-3"
                  >
                    <template #opposite>
                      <span class="day-indicator text-caption font-weight-bold text-primary">
                        Day {{ itinerary.dayNo }}
                      </span>
                    </template>

                    <v-card class="timeline-card enterprise-card ml-2">
                      <v-card-text class="pa-3">
                        <div class="d-flex justify-space-between align-start ga-3">
                          <div class="flex-grow-1">
                            <p class="font-weight-bold text-grey-darken-4 mb-1" style="font-size: 0.85rem; line-height: 1.3;">
                              {{ itinerary.title }}
                            </p>
                            <p class="text-grey-darken-1 text-wrap mb-0" style="font-size: 0.75rem; line-height: 1.4;" v-if="itinerary.detail">
                              {{ itinerary.detail }}
                            </p>
                            <v-chip v-else variant="tonal" color="grey" size="x-small" class="text-caption mt-1">No contextual info documented</v-chip>
                          </div>
                          <div class="d-flex align-center no-shrink">
                            <v-btn
                              icon
                              variant="text"
                              color="slate-600"
                              size="small"
                              density="card"
                              class="mr-1"
                              @click="openEditDialog(itinerary)"
                            >
                              <v-icon size="16">mdi-pencil-outline</v-icon>
                              <v-tooltip activator="parent" location="top">Edit Node</v-tooltip>
                            </v-btn>
                            <v-btn
                              icon
                              variant="text"
                              color="error"
                              size="small"
                              density="card"
                              @click="openDeleteDialog(itinerary)"
                            >
                              <v-icon size="16">mdi-delete-outline</v-icon>
                              <v-tooltip activator="parent" location="top">Delete Node</v-tooltip>
                            </v-btn>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-timeline-item>

                  <!-- Inner Panel Empty State Template -->
                  <v-timeline-item
                    v-if="getItinerariesForProduct(product.productId).length === 0"
                    dot-color="grey-lighten-2"
                    size="x-small"
                  >
                    <v-card class="timeline-card enterprise-card ml-2">
                      <v-card-text class="text-center text-grey pa-4">
                        <v-icon size="24" class="mb-1 text-grey-lighten-1">mdi-calendar-blank-outline</v-icon>
                        <p class="card-subtitle-text mb-2">No timeline tracking layer discovered for this product instance</p>
                        <v-btn
                          color="primary"
                          class="btn-primary text-none text-caption font-weight-bold"
                          size="small"
                          height="28"
                          @click="openAddForProduct(product.productId)"
                        >
                          Initialize First Day
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

    <!-- Add/Edit Matrix Context Dialog -->
    <v-dialog v-model="dialog" max-width="540px" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-5 pb-2">
          <div>
            <h3 class="card-title-text" style="font-size: 1.1rem !important;">
              {{ editing ? 'Edit Itinerary Layer' : 'Provision Schedule Allocation' }}
            </h3>
            <p class="card-subtitle-text">
              {{ editing ? 'Modify structural localized travel sequence events' : 'Build a new systematic timeline path configuration node' }}
            </p>
          </div>
          <v-btn icon variant="text" size="small" @click="dialog = false">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="px-5 pb-5 pt-2 premium-form">
          <v-form @submit.prevent="saveItinerary">
            <v-row class="form-row-spacing">
              <v-col cols="12">
                <v-select
                  v-model="itineraryForm.productId"
                  label="Target Product Package Relation *"
                  :items="products"
                  item-title="title"
                  item-value="productId"
                  prepend-inner-icon="mdi-package-variant-closed"
                  :rules="[v => !!v || 'Product relationship configuration is required']"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model.number="itineraryForm.dayNo"
                  label="Day Index Sequence *"
                  type="number"
                  min="1"
                  prepend-inner-icon="mdi-sort-numeric-ascending"
                  :rules="[v => v > 0 || 'Sequence metric must be at least 1']"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="8">
                <v-text-field
                  v-model="itineraryForm.title"
                  label="Timeline Heading Title *"
                  prepend-inner-icon="mdi-format-title"
                  :rules="[v => !!v || 'Contextual header title is required']"
                  required
                  placeholder="e.g., Transfer to Airport & Departure"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="itineraryForm.detail"
                  label="Detailed Structural Scope Itinerary Description"
                  rows="4"
                  prepend-inner-icon="mdi-text-box-outline"
                  placeholder="Describe step-by-step processing details or day actions..."
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-card-actions class="pa-0 pt-5">
              <v-spacer></v-spacer>
              <v-btn variant="outlined" class="mr-2 text-none text-caption font-weight-bold" height="34" @click="dialog = false">Cancel</v-btn>
              <v-btn
                color="primary"
                type="submit"
                class="btn-primary text-none text-caption font-weight-bold"
                height="34"
                :disabled="!formValid"
              >
                {{ editing ? 'Update Sequence' : 'Deploy Ledger Path' }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Destructive Ledger Isolation Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="390px" persistent>
      <v-card class="premium-dialog">
        <v-card-text class="pa-5 text-center">
          <v-avatar size="48" class="avatar-error mb-3 shadow-glow-error">
            <v-icon size="24" color="white">mdi-alert-circle-outline</v-icon>
          </v-avatar>
          <h3 class="card-title-text text-center mb-1" style="font-size: 1.05rem !important;">Confirm Sequence Removal</h3>
          <p class="card-subtitle-text text-center px-2">
            Are you sure you want to absolute drop timeline schedule layer <strong>{{ itemToDelete?.title }}</strong>? This operational node block cannot be restored.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn variant="outlined" class="mr-2 text-none text-caption font-weight-bold" height="32" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" class="btn-error text-none text-caption font-weight-bold" height="32" @click="deleteItinerary">Purge Node</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

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

<style scoped>
/* Glassmorphic Smooth Architecture Base Blueprint */
.enterprise-card, .filter-bar-card {
  background: rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(16px) saturate(120%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(120%) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 4px 20px 0 rgba(31, 38, 135, 0.02) !important;
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
}

.enterprise-card:hover, .filter-bar-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.6) !important;
  box-shadow: 0 8px 30px 0 rgba(59, 130, 246, 0.06) !important;
}

/* Micro Compact Typography Hierarchy */
.card-title-text {
  font-size: 0.925rem !important;
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

/* Premium Panel System Adaptations */
.premium-expansion :deep(.glass-panel) {
  background: rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(14px) saturate(110%) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.015) !important;
}
.premium-expansion :deep(.v-expansion-panel-title) {
  background: transparent !important;
  transition: all 0.25s ease;
}
.premium-expansion :deep(.v-expansion-panel-title--active) {
  background: rgba(255, 255, 255, 0.4) !important;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5) !important;
}

/* Glass Inputs Control Framework */
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

/* Micro Action Badges & Glow Elements */
.status-chip {
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
}
.chip-cyan { background: rgba(6, 182, 212, 0.08); color: #0891b2; }

.glass-avatar {
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
}
.shadow-glow-avatar {
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.1) !important;
}

/* Timeline High Density Custom Matrix */
.compact-timeline :deep(.v-timeline-item__body) {
  padding-inline-start: 8px !important;
}
.timeline-card {
  border-left: 3px solid #3b82f6 !important;
  background: rgba(255, 255, 255, 0.6) !important;
}
.day-indicator {
  letter-spacing: 0.02em;
  text-transform: uppercase;
  font-size: 0.725rem !important;
}

/* Elegant Soft Dialog Architectural Setups */
.premium-dialog {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(24px) saturate(140%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(140%) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 16px !important;
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.08) !important;
}
.form-row-spacing > div {
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}

/* Core Buttons Configurations */
.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: white !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px 0 rgba(59, 130, 246, 0.18) !important;
}
.btn-primary:hover {
  box-shadow: 0 4px 16px 0 rgba(59, 130, 246, 0.3) !important;
}
.btn-error {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
  color: white !important;
  border-radius: 8px !important;
}
.avatar-error {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
}
.shadow-glow-error {
  box-shadow: 0 0 14px rgba(239, 68, 68, 0.25) !important;
}
</style>