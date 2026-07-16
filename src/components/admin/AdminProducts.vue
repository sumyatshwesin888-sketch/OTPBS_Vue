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
        <!-- Serial Number (No.) Column -->
        <template #item.index="{ index }">
          <span class="text-body-2 font-weight-medium text-slate-500">
            {{ index + 1 }}
          </span>
        </template>

        <!-- Product Info -->
        <template #item.title="{ item }">
          <div class="d-flex align-center py-3 text-no-wrap">
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
          <span class="text-body-2 text-slate-700 d-inline-flex align-center text-no-wrap">
            <v-icon size="16" color="grey-darken-1" class="mr-1">mdi-map-marker-outline</v-icon>
            {{ item.location || 'Unknown' }}
          </span>
        </template>

        <template #item.duration="{ item }">
          <span class="text-body-2 text-slate-700 text-no-wrap">
            <v-icon size="14" color="grey-darken-1" class="mr-1">mdi-clock-outline</v-icon>
            {{ getDuration(item) }}
          </span>
        </template>

        <template #item.groupSize="{ item }">
          <span class="text-body-2 text-no-wrap">{{ item.groupSize || '-' }}</span>
        </template>

        <template #item.meals="{ item }">
          <span class="text-body-2 text-truncate d-inline-block" style="max-width: 120px;">
            {{ item.meals || '-' }}
          </span>
        </template>

        <template #item.travelDate="{ item }">
          <span class="text-body-2 text-no-wrap">{{ formatDate(item.travelDate) }}</span>
        </template>

        <template #item.ticket="{ item }">
          <v-chip size="small" :color="item.ticket > 5 ? 'success' : 'warning'" variant="tonal" class="font-weight-bold text-no-wrap">
            {{ item.ticket ?? 0 }} Left
          </v-chip>
        </template>

        <template #item.transport="{ item }">
          <span v-if="item.transport" class="status-chip chip-domestic text-no-wrap">
            <v-icon start size="14" class="mr-1">
              {{ item.transport === 'FLIGHT' ? 'mdi-airplane' : 'mdi-car' }}
            </v-icon>
            {{ item.transport }}
          </span>
          <span v-else>-</span>
        </template>

        <template #item.amount="{ item }">
          <span class="font-weight-bold text-body-2 text-primary text-no-wrap">
            {{ currencyFormatter.format(item.amount) }}
          </span>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex align-center justify-end text-no-wrap">
            <v-btn icon variant="text" size="small" class="mr-1" @click="openImageDialog(item)">
              <v-badge
                :content="getImageCount(item)"
                :color="getImageBadgeColor(item)"
                location="top end"
                offset-x="2"
                offset-y="2"
              >
                <v-icon :color="getImageBadgeColor(item)" size="22">
                  {{ getImageIcon(item) }}
                </v-icon>
              </v-badge>
              <v-tooltip activator="parent" location="top">
                {{ getImageCount(item) }} / 5 Photos Uploaded
              </v-tooltip>
            </v-btn>

            <v-btn icon variant="text" color="slate-600" size="small" class="mr-1" @click="openEditDialog(item)">
              <v-icon size="20">mdi-pencil-outline</v-icon>
            </v-btn>

            <v-btn icon variant="text" color="error" size="small" @click="openDeleteDialog(item)">
              <v-icon size="20">mdi-delete-outline</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Product Dialog Form -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card rounded="lg" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold text-slate-800 px-2 pb-4">
          {{ editing ? 'Edit Travel Product' : 'Add New Travel Product' }}
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

    <!-- Dedicated 5 Images Upload Dialog -->
    <v-dialog v-model="imageDialog" max-width="700" persistent>
      <v-card class="premium-dialog" rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center pa-6 border-bottom">
          <div>
            <h3 class="text-h6 font-weight-bold text-slate-800">Upload Product Photos</h3>
            <p class="text-caption text-muted mb-0 mt-0.5">Select real image files for <strong>{{ imageForm.title }}</strong></p>
          </div>
          <v-btn icon variant="text" size="small" color="grey-darken-1" @click="imageDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6 bg-slate-50">
          <v-row dense>
            <!-- Main Cover Photo -->
            <v-col cols="12" class="mb-4">
              <v-card variant="outlined" class="pa-4 bg-white border d-flex align-center" rounded="lg">
                <v-avatar size="90" rounded="lg" class="mr-4 border bg-grey-lighten-4">
                  <v-img v-if="imagePreviews.photo!=null" 
                  :src="filePhoto"
                   cover></v-img>
                  <v-icon v-else size="36" color="grey-darken-1">mdi-image-filter-hdr</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-subtitle-2 font-weight-bold text-slate-800 mb-1">Main Cover Photo</div>
                  <input type="file" id="file" ref="file" @change="changeImage" class="file-input-anim" />
                  <!-- <v-file-input
                    label="Select Cover Photo"
                    density="compact"
                    variant="outlined"
                    accept="image/*"
                    hide-details
                    prepend-icon=""
                    prepend-inner-icon="mdi-camera"
                    @change="handleFileChange($event, 'photo')"
                  ></v-file-input> -->
                </div>
              </v-card>
            </v-col>

            <v-col cols="6" md="6">
                <v-card variant="outlined" class="pa-4 bg-white border d-flex align-center" rounded="lg">
                <v-avatar size="90" rounded="lg" class="mr-4 border bg-grey-lighten-4">
                  <v-img v-if="imagePreviews.photoOne!=null" 
                  :src="filePhotoOne"
                   cover></v-img>
                  <v-icon v-else size="36" color="grey-darken-1">mdi-image-filter-hdr</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-subtitle-2 font-weight-bold text-slate-800 mb-1">Main Cover Photo</div>
                  <input type="file" id="file" ref="fileOne" @change="changeImageOne" class="file-input-anim" />
                </div>
              </v-card>
            </v-col>
            <v-col cols="6" md="6">
<v-card variant="outlined" class="pa-4 bg-white border d-flex align-center" rounded="lg">
                <v-avatar size="90" rounded="lg" class="mr-4 border bg-grey-lighten-4">
                  <v-img v-if="imagePreviews.photoTwo!=null" 
                  :src="filePhotoTwo"
                   cover></v-img>
                  <v-icon v-else size="36" color="grey-darken-1">mdi-image-filter-hdr</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-subtitle-2 font-weight-bold text-slate-800 mb-1">Main Cover Photo</div>
                  <input type="file" id="file" ref="file" @change="changeImageTwo" class="file-input-anim" />
                </div>
              </v-card>
            </v-col>

            
            <v-col cols="6" md="6">
                <v-card variant="outlined" class="pa-4 bg-white border d-flex align-center" rounded="lg">
                <v-avatar size="90" rounded="lg" class="mr-4 border bg-grey-lighten-4">
                  <v-img v-if="imagePreviews.photoThree!=null" 
                  :src="filePhotoThree"
                   cover></v-img>
                  <v-icon v-else size="36" color="grey-darken-1">mdi-image-filter-hdr</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-subtitle-2 font-weight-bold text-slate-800 mb-1">Main Cover Photo</div>
                  <input type="file" id="file" ref="file" @change="changeImageThree" class="file-input-anim" />
                </div>
              </v-card>
            </v-col>
            <v-col cols="6" md="6">
<v-card variant="outlined" class="pa-4 bg-white border d-flex align-center" rounded="lg">
                <v-avatar size="90" rounded="lg" class="mr-4 border bg-grey-lighten-4">
                  <v-img v-if="imagePreviews.photoFour!=null" 
                  :src="filePhotoFour"
                   cover></v-img>
                  <v-icon v-else size="36" color="grey-darken-1">mdi-image-filter-hdr</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-subtitle-2 font-weight-bold text-slate-800 mb-1">Main Cover Photo</div>
                  <input type="file" id="file" ref="file" @change="changeImageFour" class="file-input-anim" />
                </div>
              </v-card>
            </v-col>
            <!-- Sub Photos (4 Slots) -->
            <!-- <v-col cols="12" sm="6" v-for="num in ['One', 'Two', 'Three', 'Four']" :key="num">
              <v-card variant="outlined" class="pa-3 bg-white border d-flex align-center mb-3" rounded="lg">
                <v-avatar size="64" rounded="lg" class="mr-3 border bg-grey-lighten-4">
                  <v-img v-if="imagePreviews['photo' + num]" 
                  :src="'http://localhost:8088/api/v1/productphoto/' + imagePreviews['photo' + num]"
                   cover></v-img>
                  <v-icon v-else size="24" color="grey-darken-1">mdi-image-outline</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-caption font-weight-semibold text-slate-700 mb-1">Sub Photo {{ num }}</div>
                  <v-file-input
                    label="Choose File"
                    density="compact"
                    variant="outlined"
                    accept="image/*"
                    hide-details
                    prepend-icon=""
                    prepend-inner-icon="mdi-camera"
                    @change="handleFileChange($event, 'photo' + num)"
                  ></v-file-input>
                </div>
              </v-card>
            </v-col> -->
          </v-row>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-4 bg-white justify-end">
          <v-btn variant="outlined" color="slate-600" class="text-none mr-2" @click="imageDialog = false">Cancel</v-btn>
          <v-btn 
            color="primary" 
            class="btn-primary text-none px-5" 
            elevation="0" 
            :loading="uploadingImages"
            @click="saveProductImages"
          >
            Save Uploads
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400" persistent>
      <v-card class="premium-dialog pa-2" rounded="lg">
        <v-card-text class="pa-6 text-center">
          <v-avatar size="48" color="red-lighten-5" class="mb-4">
            <v-icon size="24" color="error">mdi-alert-circle-outline</v-icon>
          </v-avatar>
          <h3 class="text-h6 font-weight-bold text-slate-800 mb-2">Delete Product</h3>
          <p class="text-body-2 text-muted">
            Are you sure you want to delete <strong>{{ itemToDelete?.title }}</strong>? This action cannot be undone.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn variant="outlined" color="slate-600" class="text-none mr-2" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" class="text-none px-4" variant="flat" rounded="md" elevation="0" @click="deleteProduct">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PackageService from '@/service/PackageService'
import { supabase } from '@/lib/supabase'

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
      
      products: [] as any[], 

      headers: [
        { title: 'No.', key: 'index', align: 'start' as const, sortable: false },
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
      },

      imageForm: {
        productId: '',
        title: '',
        photo: '',
        photoOne: '',
        photoTwo: '',
        photoThree: '',
        photoFour: ''
      },
      imageFiles: {
        photo: null as File | null,
        photoOne: null as File | null,
        photoTwo: null as File | null,
        photoThree: null as File | null,
        photoFour: null as File | null
      } as Record<string, File | null>,
      imagePreviews: {
        photo: '',
        photoOne: '',
        photoTwo: '',
        photoThree: '',
        photoFour: ''
      } as Record<string, string>,
      uploadingImages: false,
      filePhoto:'',
      filePhotoOne:'',
      filePhotoTwo:'',
      filePhotoThree:'',
      filePhotoFour:'',
    }
  },

  computed: {
    filteredProducts(): any[] {
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
  watch: {
    
    search() {
      this.fetchProducts();
    },
    typeFilter() {
      this.fetchProducts();
    },
    locationTypeFilter() {
      this.fetchProducts();
    }
  },

  methods: {
    changeImage: function (e) {
      let image = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.filePhoto = e.target.result;
      };
    },
    changeImageOne: function (e) {
      let image = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.filePhotoOne = e.target.result;
      };
    },
    changeImageTwo: function (e) {
      let image = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.filePhotoTwo = e.target.result;
      };
    },
    changeImageThree: function (e) {
      let image = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.filePhotoThree = e.target.result;
      };
    },
    changeImageFour: function (e) {
      let image = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.filePhotoFour = e.target.result;
      };
    },
    getTypeClass(type: string): string { return `chip-${(type || 'standard').toLowerCase()}` }, 
    getDuration(p: any): string { return `${p.day || 0}D / ${p.night || 0}N` }, 
    formatDate(dateStr: string): string {
      if (!dateStr) return '-'
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }, 

    async fetchProducts() {
      try {
        this.loading = true;
        
        const data = await PackageService.getProduct(
          this.locationTypeFilter || undefined,
          this.typeFilter || undefined,
          this.search || undefined
        );
        this.products = data; 
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        this.loading = false;
      }
    },

    openAddDialog() {
      this.editing = false;
      this.dialog = true; 
    },
    
    closeDialog() {
      this.dialog = false; 
      this.newProduct = { title: '', location: '', locationType: 'DOMESTIC', type: 'Standard', amount: 0, day: 0, night: 0, groupSize: '', meals: '', travelDate: '', ticket: 0, transport: 'CAR' };
    },
    
    async saveProduct() {
      try {
        this.loading = true; 
        let response;
        
        if (this.editing) {
          // --- EDIT PRODUCT---
          response = await PackageService.updateProduct(this.newProduct);
        } else {
          // --- ADD PRODUCT ---
          response = await PackageService.addProduct(this.newProduct);
        }
        
        if (response > 0) { 
          alert(this.editing ? 'Product updated successfully!' : 'Product saved successfully!');
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

    openEditDialog(item: any) {
      this.editing = true;
      this.newProduct = { ...item };

      this.dialog = true;
    },

    openDeleteDialog(item: any) {
      this.itemToDelete = item;
      this.deleteDialog = true;
    },

    async deleteProduct() {
      if (!this.itemToDelete) return;
      try {
        this.loading = true;
      
        const response = await PackageService.deleteProduct(this.itemToDelete.productId);
        
        if (response > 0) {
          this.products = this.products.filter((p: any) => p.productId !== this.itemToDelete.productId);
          alert('Product deleted successfully.');
        } else {
          alert('Failed to delete product from server.');
        }
        
        this.deleteDialog = false;
        this.itemToDelete = null;
      } catch (error) {
        console.error("Error deleting product:", error);
        alert('An error occurred while deleting.');
      } finally {
        this.loading = false;
      }
    },

    // Image Handlers
    getImageCount(item: any): number {
      let count = 0;
      if (item.photo) count++;
      if (item.photoOne) count++;
      if (item.photoTwo) count++;
      if (item.photoThree) count++;
      if (item.photoFour) count++;
      return count;
    },

    getImageIcon(item: any): string {
      const count = this.getImageCount(item);
      if (count === 0) return 'mdi-image-off-outline';
      if (count === 5) return 'mdi-image-multiple';
      return 'mdi-image-multiple-outline';
    },

    getImageBadgeColor(item: any): string {
      const count = this.getImageCount(item);
      if (count === 0) return 'grey-darken-1';
      if (count === 5) return 'success';
      return 'primary';
    },

    openImageDialog(item) {
      this.imagePreviews = Object.assign({},item);
      this.filePhoto = 'http://localhost:8088/api/v1/productphoto/' + this.imagePreviews.photo;
      this.filePhotoOne = 'http://localhost:8088/api/v1/productphoto/' + this.imagePreviews.photoOne;
      this.filePhotoTwo = 'http://localhost:8088/api/v1/productphoto/' + this.imagePreviews.photoTwo;
      this.filePhotoThree = 'http://localhost:8088/api/v1/productphoto/' + this.imagePreviews.photoThree;
      this.filePhotoFour = 'http://localhost:8088/api/v1/productphoto/' + this.imagePreviews.photoFour;
      // this.imageForm = {
      //   productId: product.productId,
      //   title: product.title,
      //   photo: product.photo || '',
      //   photoOne: product.photoOne || '',
      //   photoTwo: product.photoTwo || '',
      //   photoThree: product.photoThree || '',
      //   photoFour: product.photoFour || ''
      // };

      // this.imageFiles = {
      //   photo: null,
      //   photoOne: null,
      //   photoTwo: null,
      //   photoThree: null,
      //   photoFour: null
      // };

      // this.imagePreviews = {
      //   photo: product.photo || '',
      //   photoOne: product.photoOne || '',
      //   photoTwo: product.photoTwo || '',
      //   photoThree: product.photoThree || '',
      //   photoFour: product.photoFour || ''
      // };

      this.imageDialog = true;
    },

    handleFileChange(event: any, key: string) {
      const files = event.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        this.imageFiles[key] = file;
        this.imagePreviews[key] = URL.createObjectURL(file);
      }
    },

    async uploadImageFile(file: File): Promise<string | null> {
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `products/${fileName}`

        const { data, error } = await supabase.storage
          .from('products')
          .upload(filePath, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath)

        return publicUrl
      } catch (err) {
        console.warn('Supabase fallback to Base64 format...', err)
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      }
    },

    async saveProductImages() {
      var formData = new FormData();
      formData.append("file", this.$refs.file.files[0]);
      PackageService
        .updateProductPhoto(formData, this.imagePreviews.productId,0)
        .then((response) => {
          this.fetchProducts();
        })
        .catch((error) => {
          this.$swal( error.response.data.message, "error");
        });
      var formData = new FormData();
      formData.append("file", this.$refs.fileOne.files[0]);
      PackageService
        .updateProductPhoto(formData, this.imagePreviews.productId,1)
        .then((response) => {
          this.fetchProducts();
        })
        .catch((error) => {
          this.$swal( error.response.data.message, "error");
        });
    //   this.uploadingImages = true;
    //   try {
    //     const payload: Record<string, string | null> = {};
    //     const keys = ['photo', 'photoOne', 'photoTwo', 'photoThree', 'photoFour'];

    //     for (const key of keys) {
    //       const file = this.imageFiles[key];
    //       if (file) {
    //         const uploadedUrl = await this.uploadImageFile(file);
    //         payload[key] = uploadedUrl;
    //       } else {
    //         payload[key] = this.imageForm[key as keyof typeof this.imageForm] || null;
    //       }
    //     }

    //     const idx = this.products.findIndex(p => p.productId === this.imageForm.productId);
    //     if (idx !== -1) {
    //       this.products[idx] = { ...this.products[idx], ...payload };
    //     }

    //     if (supabase) {
    //       await supabase
    //         .from('product')
    //         .update(payload)
    //         .eq('productId', this.imageForm.productId);
    //     }

    //     this.imageDialog = false;
    //     alert('Photos uploaded successfully!');
    //   } catch (error) {
    //     console.error('Error saving images:', error);
    //     alert('Failed to save images.');
    //   } finally {
    //     this.uploadingImages = false;
    //   }
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


.premium-table :deep(td) { 
  white-space: nowrap !important;
}
.premium-table :deep(th) { 
  font-weight: 600 !important; 
  color: #475569 !important; 
  background-color: #f8fafc !important; 
  font-size: 13px !important;
  z-index: 2 !important;
  white-space: nowrap !important;
}
</style>