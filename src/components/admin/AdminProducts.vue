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

    <!-- Data Table -->
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

    <!-- Add Product Dialog Form -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card rounded="lg" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold text-slate-800 px-2 pb-4">
          Add New Travel Product
        </v-card-title>
        
        <v-card-text class="pa-2">
          <v-form ref="productForm">
            <v-row dense>
              <v-col cols="12">
                <v-text-field v-model="newProduct.title" label="Product Title *" variant="outlined" density="compact" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="newProduct.location" label="Location *" variant="outlined" density="compact" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="newProduct.locationType" label="Region Type *" :items="['DOMESTIC', 'INTERNATIONAL']" variant="outlined" density="compact" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="newProduct.type" label="Package Type *" :items="['Budget', 'Standard', 'Premium']" variant="outlined" density="compact" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.number="newProduct.amount" label="Price (MMK) *" type="number" variant="outlined" density="compact" required></v-text-field>
              </v-col>
              <v-col cols="6" sm="3">
                <v-text-field v-model.number="newProduct.day" label="Days" type="number" variant="outlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="6" sm="3">
                <v-text-field v-model.number="newProduct.night" label="Nights" type="number" variant="outlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="newProduct.groupSize" label="Group Size (e.g., 15 Pax)" variant="outlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="newProduct.meals" label="Meals Info" variant="outlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="newProduct.travelDate" label="Travel Date" type="date" variant="outlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.number="newProduct.ticket" label="Available Tickets" type="number" variant="outlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select v-model="newProduct.transport" label="Transport" :items="['FLIGHT', 'CAR']" variant="outlined" density="compact"></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="px-2 pt-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="slate-600" class="text-none" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" variant="flat" class="text-none px-4" rounded="md" @click="saveProduct">Save Product</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import PackageService from '@/service/PackageService' //[cite: 8]

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
      
      // ✅ ပြင်ဆင်ချက် ၂: TypeScript Type Casting (products: [] as any[]) ထည့်ပေးထားပါသည်
      products: [] as any[], 

      headers: [
        { title: 'Product Info', key: 'title', align: 'start' as const },
        { title: 'Type', key: 'type', align: 'start' as const },
        { title: 'locationType', key: 'locationType', align: 'start' as const },
        { title: 'Location', key: 'location', align: 'start' as const },
        { title: 'Duration', key: 'duration' },
        { title: 'Group Size', key: 'groupSize' },
        { title: 'Meals', key: 'meals' },
        { title: 'Travel Date', key: 'travelDate' },
        { title: 'Tickets', key: 'ticket' },
        { title: 'Transport', key: 'transport' },
        { title: 'Price', key: 'amount', align: 'end' as const },
        { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const }
      ], 

      newProduct: {
        title: '',
        location: '',
        locationType: 'DOMESTIC',
        type: 'Standard',
        amount: 0,
        day: 0,
        night: 0,
        groupSize: '',
        meals: '',
        travelDate: '',
        ticket: 0,
        transport: 'CAR'
      }
    }
  },

  computed: {
    filteredProducts(): any[] {
      // ✅ ပြင်ဆင်ချက် ၃: TypeScript Type error မတက်စေရန် filter function ထဲမှ parameter ကို (p: any) ဟု သတ်မှတ်ပေးပါသည်
      return this.products.filter((p: any) => {
        const matchesSearch = !this.search || p.title.toLowerCase().includes(this.search.toLowerCase()) || (p.location && p.location.toLowerCase().includes(this.search.toLowerCase()))
        const matchesType = !this.typeFilter || p.type === this.typeFilter
        const matchesLocationType = !this.locationTypeFilter || p.locationType === this.locationTypeFilter
        return matchesSearch && matchesType && matchesLocationType
      })
    }, 
    currencyFormatter() { 
  return {
    format: (value: number) => new Intl.NumberFormat('en-US').format(value) + ' MMK'
  }
}
  },

  mounted() {
    this.fetchProducts();
  },

  methods: {
    getTypeClass(type: string): string { return `chip-${(type || 'standard').toLowerCase()}` }, 
    getDuration(p: any): string { return `${p.day || 0}D / ${p.night || 0}N` }, 
    formatDate(dateStr: string): string {
      if (!dateStr) return '-'
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }, 

    async fetchProducts() {
      try {
        this.loading = true;
        const data = await PackageService.getPackages(this.locationTypeFilter || undefined); //[cite: 8]
        this.products = data; 
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        this.loading = false;
      }
    },

    openAddDialog() {
      this.dialog = true; 
    },
    
    closeDialog() {
      this.dialog = false; 
      this.newProduct = { title: '', location: '', locationType: 'DOMESTIC', type: 'Standard', amount: 0, day: 0, night: 0, groupSize: '', meals: '', travelDate: '', ticket: 0, transport: 'CAR' };
    },
    
    async saveProduct() {
      try {
        this.loading = true; 
        const data = await PackageService.addPackage(this.newProduct); //[cite: 8]
        
        if (data > 0) { 
          alert('Product added successfully!');
          this.closeDialog();
          this.fetchProducts(); 
        } else {
          alert('Failed to save product.');
        }
      } catch (error) {
        console.error("Error saving product:", error);
        alert('An error occurred while connecting to the server.');
      } finally {
        this.loading = false; 
      }
    },

    // ✅ ပြင်ဆင်ချက် ၄: Template ထဲတွင် ခေါ်ယူထားသော်လည်း မရှိသေးသော Method များကို ဖြည့်စွက်ပေးလိုက်ပါသည်
    openImageDialog(item: any) {
      this.imageDialog = true;
      // လိုအပ်သော Image Dialog Control Logic ကို ဤနေရာတွင် ထပ်ထည့်နိုင်ပါသည်
    },

    openEditDialog(item: any) {
      this.editing = true;
      this.newProduct = { ...item }; // ရွေးချယ်လိုက်သော item data များကို form ထဲထည့်ပေးခြင်း
      this.dialog = true;
    },

    openDeleteDialog(item: any) {
      this.itemToDelete = item;
      this.deleteDialog = true;
      // လိုအပ်သော Delete Control Logic ကို ဤနေရာတွင် ထပ်ထည့်နိုင်ပါသည်
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

.premium-table :deep(th) { 
  font-weight: 600 !important; 
  color: #475569 !important; 
  background-color: #f8fafc !important; 
  font-size: 13px !important;
  z-index: 2 !important;
}
</style>