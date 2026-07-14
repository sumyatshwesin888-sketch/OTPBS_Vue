<template>
  <div class="admin-products-container pa-6">
    <!-- Filter Bar -->
    <v-card class="filter-bar border mb-6 pa-4" variant="flat" rounded="lg">
      <v-row align="center" dense>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="search"
            label="Search products..."
            prepend-inner-icon="mdi-magnify"
            density="compact"
            variant="outlined"
            color="primary"
            flat
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
            density="compact"
            variant="outlined"
            color="primary"
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
            density="compact"
            variant="outlined"
            color="primary"
            hide-details
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="text-right">
          <v-btn
            color="primary"
            class="btn-primary text-none font-weight-medium px-4"
            prepend-icon="mdi-plus"
            rounded="md"
            elevation="0"
            @click="openAddDialog"
          >
            Add Product
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Data Table (Fixed Header & Height ထည့်သွင်းထားပါသည်) -->
    <v-card class="enterprise-card border" variant="flat" rounded="lg">
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="filteredProducts"
        :loading="loading"
        item-value="productId"
        class="premium-table"
        fixed-header
        height="550"
      >
        <!-- Product Info -->
        <template #item.title="{ item }">
          <div class="d-flex align-center py-3">
            <v-avatar size="44" rounded="md" class="mr-3 border" color="grey-lighten-4">
              <v-img v-if="item.photo" :src="item.photo" cover></v-img>
              <v-icon v-else color="grey-darken-1">mdi-package-variant</v-icon>
            </v-avatar>
            <div>
              <p class="font-weight-semibold text-slate-800 mb-0">{{ item.title }}</p>
            </div>
          </div>
        </template>

        <template #item.type="{ item }">
          <span :class="['status-chip', getTypeClass(item.type)]">
            {{ item.type }}
          </span>
        </template>

        <template #item.locationType="{ item }">
          <span :class="['status-chip', item.locationType === 'DOMESTIC' ? 'chip-domestic' : 'chip-international']">
            <v-icon start size="12" class="mr-1">
              {{ item.locationType === 'DOMESTIC' ? 'mdi-home-outline' : 'mdi-airplane' }}
            </v-icon>
            {{ item.locationType }}
          </span>
        </template>

        <!-- Location Column -->
        <template #item.location="{ item }">
          <span class="text-body-2 text-slate-700 d-inline-flex align-center">
            <v-icon size="16" color="grey-darken-1" class="mr-1">mdi-map-marker-outline</v-icon>
            {{ item.location || 'Unknown' }}
          </span>
        </template>

        <template #item.duration="{ item }">
          <span class="text-body-2 text-slate-700">
            <v-icon size="14" color="grey-darken-1" class="mr-1">mdi-clock-outline</v-icon>
            {{ getDuration(item) }}
          </span>
        </template>

        <template #item.groupSize="{ item }">
          <span class="text-body-2">{{ item.groupSize || '-' }}</span>
        </template>

        <template #item.meals="{ item }">
          <span class="text-body-2 text-truncate d-inline-block" style="max-width: 120px;">
            {{ item.meals || '-' }}
          </span>
        </template>

        <template #item.travelDate="{ item }">
          <span class="text-body-2">{{ formatDate(item.travelDate) }}</span>
        </template>

        <template #item.ticket="{ item }">
          <v-chip size="small" :color="item.ticket > 5 ? 'success' : 'warning'" variant="tonal" class="font-weight-bold">
            {{ item.ticket ?? 0 }} Left
          </v-chip>
        </template>

        <template #item.transport="{ item }">
          <span v-if="item.transport" class="status-chip chip-domestic">
            <v-icon start size="14" class="mr-1">
              {{ item.transport === 'FLIGHT' ? 'mdi-airplane' : 'mdi-car' }}
            </v-icon>
            {{ item.transport }}
          </span>
          <span v-else>-</span>
        </template>

        <template #item.amount="{ item }">
          <span class="font-weight-bold text-body-2 text-primary">
            {{ currencyFormatter.format(item.amount) }}
          </span>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <v-btn icon variant="text" color="primary" size="small" class="mr-1" @click="openImageDialog(item)">
            <v-icon size="20">mdi-image-multiple-outline</v-icon>
          </v-btn>
          <v-btn icon variant="text" color="slate-600" size="small" class="mr-1" @click="openEditDialog(item)">
            <v-icon size="20">mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn icon variant="text" color="error" size="small" @click="openDeleteDialog(item)">
            <v-icon size="20">mdi-delete-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AdminProducts',
  
  data() {
    return {
      itemsPerPage: 10,
      loading: false,
      dialog: false,
      deleteDialog: false,
      imageDialog: false,
      search: '',
      typeFilter: null as string | null,
      locationTypeFilter: null as string | null,
      currentStep: 1,
      editing: false,
      itemToDelete: null as any | null,
      
      products: [
        { productId: 'p1', title: 'Beautiful Bali Gateway', location: 'Bali, Indonesia', type: 'Premium', locationType: 'INTERNATIONAL', day: 5, night: 4, groupSize: '10-12 Pax', amount: 1250, meals: 'Breakfast & Dinner', travelDate: '2026-08-20', ticket: 15, transport: 'FLIGHT', photo: 'https://picsum.photos/id/10/200/200' },
        { productId: 'p2', title: 'Bagan Heritage Cultural Tour', location: 'Bagan, Myanmar', type: 'Budget', locationType: 'DOMESTIC', day: 3, night: 2, groupSize: '20 Pax', amount: 150, meals: 'Breakfast Only', travelDate: '2026-10-05', ticket: 25, transport: 'CAR', photo: 'https://picsum.photos/id/11/200/200' },
        { productId: 'p3', title: 'Tokyo Cherry Blossom Special', location: 'Tokyo, Japan', type: 'Premium', locationType: 'INTERNATIONAL', day: 7, night: 6, groupSize: '8-10 Pax', amount: 2100, meals: 'All Meals Included', travelDate: '2026-04-12', ticket: 5, transport: 'FLIGHT', photo: 'https://picsum.photos/id/12/200/200' },
        { productId: 'p4', title: 'Phuket Beach Relax Package', location: 'Phuket, Thailand', type: 'Standard', locationType: 'INTERNATIONAL', day: 4, night: 3, groupSize: '15 Pax', amount: 450, meals: 'Breakfast & Seafood Dinner', travelDate: '2026-09-15', ticket: 12, transport: 'FLIGHT', photo: 'https://picsum.photos/id/13/200/200' },
        { productId: 'p5', title: 'Inle Lake Magic & Culture', location: 'Shan State, Myanmar', type: 'Standard', locationType: 'DOMESTIC', day: 3, night: 2, groupSize: '12 Pax', amount: 180, meals: 'Breakfast & Lunch', travelDate: '2026-11-20', ticket: 8, transport: 'CAR', photo: 'https://picsum.photos/id/14/200/200' },
        { productId: 'p6', title: 'Seoul City Explorer', location: 'Seoul, South Korea', type: 'Standard', locationType: 'INTERNATIONAL', day: 6, night: 5, groupSize: '14 Pax', amount: 980, meals: 'Breakfast', travelDate: '2026-10-10', ticket: 20, transport: 'FLIGHT', photo: 'https://picsum.photos/id/15/200/200' },
        { productId: 'p7', title: 'Ngapali Luxury Beach Escape', location: 'Rakhine, Myanmar', type: 'Premium', locationType: 'DOMESTIC', day: 4, night: 3, groupSize: '6-8 Pax', amount: 350, meals: 'Breakfast Buffet', travelDate: '2026-12-24', ticket: 4, transport: 'FLIGHT', photo: 'https://picsum.photos/id/16/200/200' },
        { productId: 'p8', title: 'Bangkok Shopping Spree Tour', location: 'Bangkok, Thailand', type: 'Budget', locationType: 'INTERNATIONAL', day: 3, night: 2, groupSize: '25 Pax', amount: 299, meals: 'None', travelDate: '2026-08-05', ticket: 40, transport: 'FLIGHT', photo: 'https://picsum.photos/id/17/200/200' },
        { productId: 'p9', title: 'Pyin Oo Lwin Cool Breeze Getaway', location: 'Mandalay, Myanmar', type: 'Budget', locationType: 'DOMESTIC', day: 2, night: 1, groupSize: '30 Pax', amount: 80, meals: 'Traditional Dinner', travelDate: '2026-07-28', ticket: 18, transport: 'CAR', photo: 'https://picsum.photos/id/18/200/200' },
        { productId: 'p10', title: 'Singapore Modern City Wonders', location: 'Marina Bay, Singapore', type: 'Premium', locationType: 'INTERNATIONAL', day: 5, night: 4, groupSize: '10 Pax', amount: 1400, meals: 'Full Board', travelDate: '2026-09-02', ticket: 9, transport: 'FLIGHT', photo: 'https://picsum.photos/id/19/200/200' }
      ] as any[],

      headers: [
        { title: 'Product Info', key: 'title', align: 'start' as const },
        { title: 'Type', key: 'type', align: 'start' as const },
        { title: 'Region', key: 'locationType', align: 'start' as const },
        { title: 'Location', key: 'location', align: 'start' as const },
        { title: 'Duration', key: 'duration' },
        { title: 'Group Size', key: 'groupSize' },
        { title: 'Meals', key: 'meals' },
        { title: 'Travel Date', key: 'travelDate' },
        { title: 'Tickets', key: 'ticket' },
        { title: 'Transport', key: 'transport' },
        { title: 'Price', key: 'amount', align: 'end' as const },
        { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const }
      ]
    }
  },

  computed: {
    filteredProducts(): any[] {
      return this.products.filter(p => {
        const matchesSearch = !this.search || p.title.toLowerCase().includes(this.search.toLowerCase()) || (p.location && p.location.toLowerCase().includes(this.search.toLowerCase()))
        const matchesType = !this.typeFilter || p.type === this.typeFilter
        const matchesLocationType = !this.locationTypeFilter || p.locationType === this.locationTypeFilter
        return matchesSearch && matchesType && matchesLocationType
      })
    },
    currencyFormatter() { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }) }
  },

  methods: {
    getTypeClass(type: string): string { return `chip-${(type || 'standard').toLowerCase()}` },
    getDuration(p: any): string { return `${p.day || 0}D / ${p.night || 0}N` },
    formatDate(dateStr: string): string {
      if (!dateStr) return '-'
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }
})
</script>

<style scoped>
.admin-products-container { background-color: #f8fafc; min-height: 100vh; }
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.border { border: 1px solid #e2e8f0 !important; }
.status-chip { display: inline-flex; align-items: center; padding: 4px 10px; font-size: 11px; font-weight: 600; border-radius: 50px; text-transform: uppercase; }
.chip-budget { background-color: #f0fdf4; color: #16a34a; }
.chip-standard { background-color: #eff6ff; color: #2563eb; }
.chip-premium { background-color: #faf5ff; color: #7c3aed; }
.chip-domestic { background-color: #f1f5f9; color: #475569; }
.chip-international { background-color: #fff7ed; color: #ea580c; }

/* Sticky Header အလုပ်လုပ်စေရန် နောက်ခံအရောင်နှင့် z-index သတ်မှတ်ချက် */
.premium-table :deep(th) { 
  font-weight: 600 !important; 
  color: #475569 !important; 
  background-color: #f8fafc !important; 
  font-size: 13px !important;
  z-index: 2 !important;
}
</style>