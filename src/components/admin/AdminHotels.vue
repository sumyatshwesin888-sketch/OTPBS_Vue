<template>
  <div>
    <!-- Premium Glassmorphic Navigation Tabs -->
    <v-tabs v-model="activeTab" class="premium-tabs mb-4" color="primary" align-tabs="start">
      <v-tab value="cities" class="text-none font-weight-bold text-caption rounded-t-lg">
        <v-icon start size="16">mdi-city-variant-outline</v-icon>
        Cities
        <v-badge :content="cities.length" color="primary" inline class="ml-2 core-badge"></v-badge>
      </v-tab>
      <v-tab value="hotels" class="text-none font-weight-bold text-caption rounded-t-lg">
        <v-icon start size="16">mdi-domain</v-icon>
        Hotels
        <v-badge :content="hotels.length" color="indigo" inline class="ml-2 core-badge"></v-badge>
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- ================= CITIES SYSTEM LAYER ================= -->
      <v-window-item value="cities">
        <!-- Compact Filter Bar -->
        <v-card class="filter-bar-card mb-4 pa-3">
          <v-row align="center" no-gutters class="ga-2">
            <v-col cols="12" sm="5" md="4">
              <v-text-field
                v-model="citySearch"
                label="Search administrative cities..."
                prepend-inner-icon="mdi-magnify"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                class="sleek-input"
                @update:model-value="clickCitySearch"
              ></v-text-field>
            </v-col>
            <v-spacer class="hidden-xs-only"></v-spacer>
            <v-col cols="auto" class="text-right">
              <v-btn
                color="primary"
                class="btn-primary text-none text-caption font-weight-bold"
                prepend-icon="mdi-plus"
                elevation="0"
                height="36"
                @click="openAddCityDialog"
              >
                Add City
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Cities High-Density Enterprise Registry -->
        <v-card class="enterprise-card">
          <v-card-title class="pa-4 pb-2">
            <div>
              <h3 class="card-title-text mb-0">Regional Hub Directory</h3>
              <p class="card-subtitle-text mb-0">
                Manage operational destination jurisdictions and associated entity metrics
              </p>
            </div>
          </v-card-title>

          <v-card-text class="pt-0 px-4 pb-4">
            <v-data-table
              :headers="cityHeaders"
              :items="filteredCities"
              :loading="cityLoading"
              item-value="cityId"
              hide-default-footer
              class="premium-table elevation-0"
              fixed-header
              height="450"
            >
              <!-- Index Column -->
              <template #item.index="{ index }">
                <span class="text-body-2 font-weight-medium text-slate-500">
                  {{ index + 1 }}
                </span>
              </template>

              <!-- City Column Identity -->
              <template #item.cityName="{ item }">
                <div class="d-flex align-center py-1">
                  <v-avatar size="28" class="avatar-gradient mr-2 glass-avatar">
                    <v-icon size="14" color="white">mdi-city-variant-outline</v-icon>
                  </v-avatar>
                  <span
                    class="font-weight-semibold text-grey-darken-3"
                    style="font-size: 0.8rem !important"
                  >
                    {{ item.cityName }}
                  </span>
                </div>
              </template>

              <template #item.locationType="{ item }">
                <span class="text-body-2 text-grey-darken-3" style="font-size: 0.8rem !important">
                  {{ item.locationType }}
                </span>
              </template>
              <template #item.photo="{ item }">
                <span class="text-body-2 text-grey-darken-3" style="font-size: 0.8rem !important">
                  {{ item.photo }}
                </span>
              </template>
              <template #item.region="{ item }">
                <span class="text-body-2 text-grey-darken-3" style="font-size: 0.8rem !important">
                  {{ item.region }}
                </span>
              </template>

              <template #item.website="{ item }">
                <span class="text-body-2 text-grey-darken-3" style="font-size: 0.8rem !important">
                  {{ item.website }}
                </span>
              </template>

              <template #item.detail="{ item }">
                <span class="text-body-2 text-grey-darken-3" style="font-size: 0.8rem !important">
                  {{ item.detail }}
                </span>
              </template>

              <!-- Operation Control Handlers -->
              <template #item.actions="{ item }">
                <v-btn
                  icon
                  variant="text"
                  color="slate-600"
                  size="small"
                  class="mr-1"
                  @click="openEditCityDialog(item)"
                >
                  <v-icon size="18">mdi-pencil-outline</v-icon>
                  <v-tooltip activator="parent" location="top">Edit Hub</v-tooltip>
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  color="error"
                  size="small"
                  @click="openDeleteCityDialog(item)"
                >
                  <v-icon size="18">mdi-delete-outline</v-icon>
                  <v-tooltip activator="parent" location="top">Delete Hub</v-tooltip>
                </v-btn>
              </template>

              <!-- Table State Fallback -->
              <template #no-data>
                <div class="premium-empty-state pa-6 text-center">
                  <v-avatar size="48" color="grey-lighten-4" class="mb-2">
                    <v-icon color="grey-darken-1" size="22">mdi-city-off-outline</v-icon>
                  </v-avatar>
                  <p class="card-title-text mb-0">No municipal areas discovered</p>
                  <p class="card-subtitle-text">
                    Adjust query conditions or provision a new regional boundary entry
                  </p>
                  <v-btn
                    color="primary"
                    class="btn-primary text-none text-caption font-weight-bold mt-3"
                    prepend-icon="mdi-plus"
                    size="small"
                    @click="openAddCityDialog"
                  >
                    Add City
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- ================= HOTELS SYSTEM LAYER ================= -->
      <v-window-item value="hotels">
        <!-- Multi-Axis Filter Bar -->
        <v-card class="filter-bar-card mb-4 pa-3">
          <v-row align="center" no-gutters class="ga-2">
            <v-col cols="12" sm="5" md="3">
              <v-text-field
                v-model="hotelSearch"
                label="Search hospitality units..."
                prepend-inner-icon="mdi-magnify"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                class="sleek-input"
                @update:model-value="clickHotelSearch"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="3">
              <v-select
                v-model="cityAll"
                label="City"
                :items="cityAllList"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                class="sleek-input"
                item-title="cityName"
                item-value="cityName"
                @update:model-value="clickHotelCityFilter()"
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
                @click="openAddHotelDialog"
              >
                Add Hotel
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Hotels High-Density Enterprise Registry -->
        <v-card class="enterprise-card">
          <v-card-title class="pa-4 pb-2">
            <div>
              <h3 class="card-title-text mb-0">Hospitality Asset Registry</h3>
              <p class="card-subtitle-text mb-0">
                Manage partner accommodations, systemic alignments and regional bindings
              </p>
            </div>
          </v-card-title>

          <v-card-text class="pt-0 px-4 pb-4">
            <v-data-table
              :headers="hotelHeaders"
              :items="hotels"
              :loading="hotelLoading"
              item-value="hotelId"
              hide-default-footer
              class="premium-table elevation-0"
              fixed-header
              height="450"
            >
              <!-- Hotel Identity Column -->
              <template #item.hotelName="{ item }">
                <div class="d-flex align-center py-1">
                  <v-avatar size="28" class="indigo-gradient mr-2 glass-avatar">
                    <v-icon size="14" color="white">mdi-domain</v-icon>
                  </v-avatar>
                  <span
                    class="font-weight-semibold text-grey-darken-3"
                    style="font-size: 0.8rem !important"
                  >
                    {{ item.hotelName }}
                  </span>
                </div>
              </template>

              <!-- City Dynamic Link Tag (FIXED SLOT NAME) -->
              <template #item.cityDto.cityName="{ item }">
                <span class="status-chip chip-indigo d-inline-flex align-center" style="gap: 4px">
                  <v-icon size="11">mdi-map-marker-outline</v-icon>
                  {{ item.cityDto ? item.cityDto.cityName : 'N/A' }}
                </span>
              </template>

              <!-- Operation Control Handlers -->
              <template #item.actions="{ item }">
                <v-btn
                  icon
                  variant="text"
                  color="slate-600"
                  size="small"
                  class="mr-1"
                  @click="openEditHotelDialog(item)"
                >
                  <v-icon size="18">mdi-pencil-outline</v-icon>
                  <v-tooltip activator="parent" location="top">Edit Asset</v-tooltip>
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  color="error"
                  size="small"
                  @click="openDeleteHotelDialog(item)"
                >
                  <v-icon size="18">mdi-delete-outline</v-icon>
                  <v-tooltip activator="parent" location="top">Delete Asset</v-tooltip>
                </v-btn>
              </template>

              <!-- Table State Fallback -->
              <template #no-data>
                <div class="premium-empty-state pa-6 text-center">
                  <v-avatar size="48" color="grey-lighten-4" class="mb-2">
                    <v-icon color="grey-darken-1" size="22">mdi-domain-off</v-icon>
                  </v-avatar>
                  <p class="card-title-text mb-0">No lodging matrices verified</p>
                  <p class="card-subtitle-text">
                    Modify search indexes or build a new vendor partner connection statement
                  </p>
                  <v-btn
                    color="primary"
                    class="btn-primary text-none text-caption font-weight-bold mt-3"
                    prepend-icon="mdi-plus"
                    size="small"
                    @click="openAddHotelDialog"
                  >
                    Add Hotel
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- ================= MODAL SCHEMATICS DIALOGS ================= -->

    <!-- City Manifest Context Dialog -->
    <v-dialog v-model="cityDialog" max-width="460px" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-5 pb-2">
          <div>
            <h3 class="card-title-text" style="font-size: 1.1rem !important">
              {{ editingCity ? 'Edit Boundary Parameters' : 'Provision Hub Matrix' }}
            </h3>
            <p class="card-subtitle-text">
              {{
                editingCity
                  ? 'Modify structural operational data variables for city records'
                  : 'Inject a new geo-location ledger allocation index'
              }}
            </p>
          </div>
          <v-btn icon variant="text" size="small" @click="cityDialog = false">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="px-5 pb-5 pt-2 premium-form">
          <v-form @submit.prevent="saveCity">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="cityForm.cityName"
                  label="Official Regional Title *"
                  prepend-inner-icon="mdi-city"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="cityForm.locationType"
                  label="Location Type (e.g. DOMESTIC)"
                  prepend-inner-icon="mdi-map-marker-outline"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-text-field>
              </v-col>

              <!-- Photo URL Field -->
              <v-col cols="12">
                <v-text-field
                  v-model="cityForm.photo"
                  label="Photo URL"
                  prepend-inner-icon="mdi-image-outline"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-text-field>
              </v-col>
              <!-- Region Field -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="cityForm.region"
                  label="Region (e.g. Myanmar)"
                  prepend-inner-icon="mdi-earth"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-text-field>
              </v-col>

              <!-- Website Field -->
              <v-col cols="12">
                <v-text-field
                  v-model="cityForm.website"
                  label="Website URL"
                  prepend-inner-icon="mdi-web"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-text-field>
              </v-col>

              <!-- Detail Field -->
              <v-col cols="12">
                <v-textarea
                  v-model="cityForm.detail"
                  label="Detailed Description"
                  prepend-inner-icon="mdi-information-outline"
                  variant="outlined"
                  density="compact"
                  rows="3"
                  hide-details="auto"
                  class="sleek-input"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-card-actions class="pa-0 pt-5">
              <v-spacer></v-spacer>
              <v-btn
                variant="outlined"
                class="mr-2 text-none text-caption font-weight-bold"
                height="34"
                @click="cityDialog = false"
                >Cancel</v-btn
              >
              <v-btn
                color="primary"
                type="submit"
                class="btn-primary text-none text-caption font-weight-bold"
                height="34"
                :disabled="!cityFormValid"
              >
                {{ editingCity ? 'Update Parameters' : 'Add' }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Hotel Manifest Context Dialog -->
    <v-dialog v-model="hotelDialog" max-width="480px" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-5 pb-2">
          <div>
            <h3 class="card-title-text" style="font-size: 1.1rem !important">
              {{ editingHotel ? 'Edit Asset Parameters' : 'Provision Accommodation Unit' }}
            </h3>
            <p class="card-subtitle-text">
              {{
                editingHotel
                  ? 'Modify structural localized details for selected vendor instance'
                  : 'Register a new hospitality structural vendor module resource'
              }}
            </p>
          </div>
          <v-btn icon variant="text" size="small" @click="hotelDialog = false">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="px-5 pb-5 pt-2 premium-form">
          <v-form @submit.prevent="saveHotel">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="hotelForm.hotelName"
                  label="Registered Hotel Entity Brand *"
                  prepend-inner-icon="mdi-badge-account-horizontal-outline"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="hotelForm.cityDto"
                  label="Assigned Administrative Hub Area *"
                  :items="cityList"
                  item-title="cityName"
                  prepend-inner-icon="mdi-map-marker-radius-outline"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="sleek-input"
                  return-object
                ></v-select>
              </v-col>
            </v-row>

            <v-card-actions class="pa-0 pt-5">
              <v-spacer></v-spacer>
              <v-btn
                variant="outlined"
                class="mr-2 text-none text-caption font-weight-bold"
                height="34"
                @click="hotelDialog = false"
                >Cancel</v-btn
              >
              <v-btn
                color="primary"
                type="submit"
                class="btn-primary text-none text-caption font-weight-bold"
                height="34"
                :disabled="!hotelFormValid"
              >
                {{ editingHotel ? 'Update Properties' : 'Add' }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialogs -->
    <v-dialog v-model="deleteCityDialog" max-width="400px" persistent>
      <v-card class="premium-dialog">
        <v-card-text class="pa-5 text-center">
          <v-avatar size="48" class="bg-error mb-3">
            <v-icon size="24" color="white">mdi-alert-octagon-outline</v-icon>
          </v-avatar>
          <h3 class="card-title-text text-center mb-1">Confirm Regional Wipe</h3>
          <p class="card-subtitle-text text-center text-wrap px-2">
            Are you absolutely confident about disconnecting
            <strong>{{ cityToDelete?.cityName }}</strong
            >?
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn
            variant="outlined"
            class="mr-2 text-none text-caption font-weight-bold"
            height="32"
            @click="deleteCityDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="error"
            class="text-none text-caption font-weight-bold"
            height="32"
            @click="deleteCity"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteHotelDialog" max-width="400px" persistent>
      <v-card class="premium-dialog">
        <v-card-text class="pa-5 text-center">
          <v-avatar size="48" class="bg-error mb-3">
            <v-icon size="24" color="white">mdi-trash-can-outline</v-icon>
          </v-avatar>
          <h3 class="card-title-text text-center mb-1">Absolute Asset Dropping</h3>
          <p class="card-subtitle-text text-center px-2">
            Are you sure you want to drop lodging index
            <strong>{{ hotelToDelete?.hotelName }}</strong
            >?
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn
            variant="outlined"
            class="mr-2 text-none text-caption font-weight-bold"
            height="32"
            @click="deleteHotelDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="error"
            class="text-none text-caption font-weight-bold"
            height="32"
            @click="deleteHotel"
            >Delete</v-btn>
          
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Hotel, City } from '../../lib/supabase'
import cityService from '@/service/CityService'

export default defineComponent({
  name: 'AdminHotels',
  data() {
    return {
      cityList: [] as City[],
      cityAllList: [] as any[],
      cityAll: 'ALL',
      cities: [] as City[],
      cityNameInput: 'ALL',

      cityLoading: false,
      cityDialog: false,
      deleteCityDialog: false,
      citySearch: '',
      cityForm: {
        cityId: '',
        cityName: '',
        locationType: '',
        photo: '',
        region: '',
        website: '',
        detail: '',
      },
      editingCity: false,
      cityToDelete: null as City | null,

      hotels: [] as Hotel[],
      hotelLoading: false,
      hotelDialog: false,
      deleteHotelDialog: false,
      hotelSearch: '',
      hotelForm: {
        hotelId: '',
        hotelName: '',
        cityDto: { cityId: 0, cityName: '' },
      },
      editingHotel: false,
      hotelToDelete: null as Hotel | null,

      activeTab: 'cities',

      cityHeaders: [
        { title: 'No.', key: 'index', align: 'start' as const, sortable: false },
        { title: 'City Name', key: 'cityName', align: 'start' as const },
        { title: 'Location Type', key: 'locationType', align: 'start' as const },
        { title: 'Photo', key: 'photo', align: 'start' as const },
        { title: 'Region', key: 'region', align: 'start' as const },
        { title: 'Website', key: 'website', align: 'start' as const },
        { title: 'Detail', key: 'detail', align: 'start' as const },
        { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
      ],

      hotelHeaders: [
        { title: 'Hotel Name', key: 'hotelName', align: 'start' as const },
        { title: 'City', key: 'cityDto.cityName', align: 'start' as const },
        { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
      ],
    }
  },
  computed: {
    filteredCities(): City[] {
      if (!this.citySearch) return this.cities
      const term = this.citySearch.toLowerCase()
      return this.cities.filter((c) => c.cityName && c.cityName.toLowerCase().includes(term))
    },
    cityFormValid(): boolean {
      return !!this.cityForm.cityName
    },
    hotelFormValid(): boolean {
      return !!this.hotelForm.hotelName && !!this.hotelForm.cityDto?.cityId
    },
  },
  mounted() {
    this.getCityMethod()
    this.getHotelListMethod()
  },
  methods: {
   getHotelListMethod() {
  this.hotelLoading = true
  cityService
    .getHotel('ALL', 'ALL', '')
    .then((response) => {
      let hotelData = [];
      if (response && response.data) {
        hotelData = response.data;
      } else if (Array.isArray(response)) {
        hotelData = response;
      }

      this.hotels.splice(0)
      this.hotels.push(...hotelData)
      
      console.log("True Data:", hotelData)
    })
    .catch((err) => console.error('Hotel Fetch Error: ', err))
    .finally(() => (this.hotelLoading = false))
},

    getCityMethod() {
      this.cityLoading = true
      let searchStr = ''
      if (this.citySearch) {
        searchStr = String(this.citySearch).replace(':1', '').trim()
      }
      cityService
        .getCity(this.cityNameInput || 'ALL', searchStr)
        .then((res) => {
          this.cities = res
          this.cityList = res; 
          
          this.cityAllList.splice(0)
          this.cityAllList.push({ cityName: 'ALL', cityId: 0 })
          this.cityAllList.push(...res)
          
          this.cityLoading = false
        })
        .catch((err) => {
          console.error('City Fetch Error:', err)
          this.cityLoading = false
        })
    },

    clickCitySearch() {
      this.cityLoading = true
      let searchStr = ''
      if (this.citySearch) {
        searchStr = String(this.citySearch).replace(':1', '').trim()
      }
      const cityName = this.cityNameInput ? this.cityNameInput : 'ALL'
      cityService
        .getCity(cityName, searchStr)
        .then((res) => {
          this.cities = res
          this.cityLoading = false
        })
        .catch((err) => {
          console.error('City Fetch Error:', err)
          this.cityLoading = false
        })
    },

    clickHotelSearch() {
      if (!this.hotelSearch) {
        this.getHotelListMethod()
        return
      }
      const term = this.hotelSearch.toLowerCase()
      const filtered = this.hotels.filter(
        (h) => h.hotelName && h.hotelName.toLowerCase().includes(term),
      )
      this.hotels.splice(0, this.hotels.length, ...filtered)
    },

    clickHotelCityFilter() {
      if (!this.cityAll || this.cityAll === 'ALL') {
        this.getHotelListMethod()
        return
      }
      const selectedCityName =
        typeof this.cityAll === 'object' ? (this.cityAll as any).cityName : this.cityAll

      const filtered = this.hotels.filter((h) => {
        const cDto = (h as any).cityDto
        return cDto && cDto.cityName === selectedCityName
      })
      this.hotels.splice(0, this.hotels.length, ...filtered)
    },

    openAddCityDialog() {
      this.editingCity = false // Add လုပ်မှာဖြစ်လို့ false ပေး
      this.cityForm = {
        cityId: '',
        cityName: '',
        locationType: '',
        photo: '',
        region: '',
        website: '',
        detail: '',
      }
      this.cityDialog = true
    },

    openEditCityDialog(city: City) {
      this.editingCity = true //  Edit လုပ်မှာဖြစ်လို့ true ပေး
      this.cityForm = { ...city }
      this.cityDialog = true
    },
async saveCity() {
      // Database ထဲထည့်ဖို့ payload Object တည်ဆောက်
      const payload = {
        cityId: this.cityForm.cityId ? Number(this.cityForm.cityId) : null,
        cityName: this.cityForm.cityName,
        locationType: this.cityForm.locationType,
        photo: this.cityForm.photo,
        region: this.cityForm.region,
        website: this.cityForm.website,
        detail: this.cityForm.detail,
      };

      // အသစ်ဆောက်တာလား (Add)၊ ပြင်တာလား (Edit) ခွဲပြီး API ခေါ်ပါတယ်
      const apiCall = this.editingCity 
        ? cityService.updateCity(payload) //  Edit/Update အတွက်
        : cityService.addCity(payload);    //  Database ထဲ Add ဖို့အတွက်

      apiCall
        .then(() => {
          this.cityDialog = false  // Modal Box ကို ပိတ်မယ်
          this.getCityMethod()     // Table မှာ Data ချက်ချင်း update ဖြစ်အောင် ပြန်ခေါ်
          
          //  Form ထဲကစာတွေကို ပြန်ရှင်း
          this.cityForm = {
            cityId: '',
            cityName: '',
            locationType: '',
            photo: '',
            region: '',
            website: '',
            detail: '',
          }
        })
        .catch((err) => console.error("City Save Error", err))
    },

    openDeleteCityDialog(city: City) {
      this.cityToDelete = city
      this.deleteCityDialog = true
    },

    async deleteCity() {
      if (!this.cityToDelete) return
      
      // Delete APIကို လှမ်းခေါ်ပေးလိုက်ပါတယ်
      cityService.deleteCity(this.cityToDelete.cityId)
        .then(() => {
          this.deleteCityDialog = false
          this.getCityMethod()
        })
        .catch((err) => console.error("City Delete Error", err))
    },

    openAddHotelDialog() {
      this.editingHotel = false
      this.hotelForm = {
        hotelId: '',
        hotelName: '',
        cityDto: this.cityList[0] || { cityId: 0, cityName: '' },
      }
      this.hotelDialog = true
    },

    openEditHotelDialog(item: any) {
      this.editingHotel = true
      this.hotelForm = JSON.parse(JSON.stringify(item))
      this.hotelDialog = true
    },

    async saveHotel() {
      // Hotel အတွက်လည်း Add / Update ခွဲခေါ်ပေး
      const apiCall = this.editingHotel
        ? cityService.updateHotel(this.hotelForm) 
        : cityService.addHotel(this.hotelForm);

      apiCall
        .then(() => {
          this.hotelDialog = false
          this.getHotelListMethod()
        })
        .catch((err) => console.error('Hotel Save Error: ', err))
    },

    openDeleteHotelDialog(hotel: Hotel) {
      this.hotelToDelete = hotel
      this.deleteHotelDialog = true
    },

    async deleteHotel() {
      if (!this.hotelToDelete) return
      
      //  Hotel Delete API ကို လှမ်းခေါ်ပေး
      cityService.deleteHotel(this.hotelToDelete.hotelId)
        .then(() => {
          this.deleteHotelDialog = false
          this.getHotelListMethod()
        })
        .catch((err) => console.error("Hotel Delete Error", err))
    },
  },
})
</script>

<style scoped>
.enterprise-card:hover,
.filter-bar-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.6) !important;
  box-shadow: 0 8px 30px 0 rgba(59, 130, 246, 0.06) !important;
}

/* Micro Typography Hierarchy */
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

/* Premium Navigation Subsystems */
.premium-tabs :deep(.v-btn) {
  letter-spacing: normal !important;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.25) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  margin-right: 4px;
}
.premium-tabs :deep(.v-tab--selected) {
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(10px) !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08) !important;
  border-bottom: 2px solid #3b82f6 !important;
}
.core-badge :deep(.v-badge__wrapper) {
  font-size: 0.65rem !important;
  height: 16px !important;
  min-width: 16px !important;
}

/* Glass Control Elements */
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

/* Core Visual Micro Elements */
.avatar-gradient {
  background: linear-gradient(135deg, #3b82f6, #06b6d4) !important;
}
.indigo-gradient {
  background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
}
.glass-avatar {
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* Micro Action Badges */
.status-chip {
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.chip-cyan {
  background: rgba(6, 182, 212, 0.08);
  color: #0891b2;
}
.chip-indigo {
  background: rgba(99, 102, 241, 0.08);
  color: #4f46e5;
}

/* High-Density Matrix Table Blueprint */
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
}
.premium-table :deep(td) {
  border-bottom: 1px solid rgba(241, 245, 249, 0.3) !important;
  padding: 6px 12px !important;
}

/* Elegant Soft Dialog Configurations */
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

/* Button & Shadow Glow Paradigms */
.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: white !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px 0 rgba(59, 130, 246, 0.2) !important;
}
.btn-primary:hover {
  box-shadow: 0 4px 16px 0 rgba(59, 130, 246, 0.35) !important;
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
  box-shadow: 0 0 14px rgba(239, 68, 68, 0.3) !important;
}
</style>
