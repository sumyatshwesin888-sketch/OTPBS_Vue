<script lang="ts">
import { defineComponent } from 'vue'
import { supabase } from '../../lib/supabase'
import type { Hotel, City } from '../../lib/supabase'

export default defineComponent({
  name: 'AdminHotels',
  data() {
    return {
      cities: [] as City[],
      cityLoading: false,
      cityDialog: false,
      deleteCityDialog: false,
      citySearch: '',
      cityForm: {
        cityId: '',
        cityName: ''
      },
      editingCity: false,
      cityToDelete: null as City | null,

      hotels: [] as Hotel[],
      hotelLoading: false,
      hotelDialog: false,
      deleteHotelDialog: false,
      hotelSearch: '',
      hotelCityFilter: null as string | null,
      hotelForm: {
        hotelId: '',
        cityId: '',
        hotelName: ''
      },
      editingHotel: false,
      hotelToDelete: null as Hotel | null,

      activeTab: 'cities',

      cityHeaders: [
        { title: 'City Name', key: 'cityName', align: 'start' as const },
        { title: 'Hotels Count', key: 'hotelsCount', sortable: false },
        { title: 'Actions', key: 'actions', sortable: false }
      ],

      hotelHeaders: [
        { title: 'Hotel Name', key: 'hotelName', align: 'start' as const },
        { title: 'City', key: 'city.cityName', align: 'start' as const },
        { title: 'Actions', key: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    filteredCities(): City[] {
      if (!this.citySearch) return this.cities
      const term = this.citySearch.toLowerCase()
      return this.cities.filter(c => c.cityName.toLowerCase().includes(term))
    },

    filteredHotels(): Hotel[] {
      let result = this.hotels
      if (this.hotelSearch) {
        const term = this.hotelSearch.toLowerCase()
        result = result.filter(h =>
          h.hotelName.toLowerCase().includes(term) ||
          (h.city && h.city.cityName.toLowerCase().includes(term))
        )
      }
      if (this.hotelCityFilter) {
        result = result.filter(h => h.cityId === this.hotelCityFilter)
      }
      return result
    },

    cityFormValid(): boolean {
      return !!this.cityForm.cityName
    },

    hotelFormValid(): boolean {
      return !!this.hotelForm.hotelName && !!this.hotelForm.cityId
    }
  },
  async mounted() {
    await Promise.all([this.fetchCities(), this.fetchHotels()])
  },
  methods: {
    async fetchCities() {
      this.cityLoading = true
      try {
        const { data, error } = await supabase
          .from('city')
          .select('*')
          .order('cityName', { ascending: true })

        if (error) throw error
        this.cities = data || []
      } catch (error) {
        console.error('Error fetching cities:', error)
      } finally {
        this.cityLoading = false
      }
    },

    getHotelsCountForCity(cityId: string): number {
      return this.hotels.filter(h => h.cityId === cityId).length
    },

    openAddCityDialog() {
      this.editingCity = false
      this.cityForm = {
        cityId: '',
        cityName: ''
      }
      this.cityDialog = true
    },

    openEditCityDialog(city: City) {
      this.editingCity = true
      this.cityForm = {
        cityId: city.cityId,
        cityName: city.cityName
      }
      this.cityDialog = true
    },

    async saveCity() {
      try {
        if (this.editingCity) {
          const { error } = await supabase
            .from('city')
            .update({ cityName: this.cityForm.cityName })
            .eq('cityId', this.cityForm.cityId)

          if (error) throw error
        } else {
          const { error } = await supabase
            .from('city')
            .insert([{ cityName: this.cityForm.cityName }])

          if (error) throw error
        }

        this.cityDialog = false
        await this.fetchCities()
      } catch (error) {
        console.error('Error saving city:', error)
      }
    },

    openDeleteCityDialog(city: City) {
      this.cityToDelete = city
      this.deleteCityDialog = true
    },

    async deleteCity() {
      if (!this.cityToDelete) return

      try {
        const { error } = await supabase
          .from('city')
          .delete()
          .eq('cityId', this.cityToDelete.cityId)

        if (error) throw error

        this.deleteCityDialog = false
        this.cityToDelete = null
        await Promise.all([this.fetchCities(), this.fetchHotels()])
      } catch (error) {
        console.error('Error deleting city:', error)
      }
    },

    async fetchHotels() {
      this.hotelLoading = true
      try {
        const { data, error } = await supabase
          .from('hotel')
          .select('*, city(*)')
          .order('hotelName', { ascending: true })

        if (error) throw error
        this.hotels = data || []
      } catch (error) {
        console.error('Error fetching hotels:', error)
      } finally {
        this.hotelLoading = false
      }
    },

    openAddHotelDialog() {
      this.editingHotel = false
      this.hotelForm = {
        hotelId: '',
        cityId: '',
        hotelName: ''
      }
      this.hotelDialog = true
    },

    openEditHotelDialog(hotel: Hotel) {
      this.editingHotel = true
      this.hotelForm = {
        hotelId: hotel.hotelId,
        cityId: hotel.cityId,
        hotelName: hotel.hotelName
      }
      this.hotelDialog = true
    },

    async saveHotel() {
      try {
        if (this.editingHotel) {
          const { error } = await supabase
            .from('hotel')
            .update({
              cityId: this.hotelForm.cityId,
              hotelName: this.hotelForm.hotelName
            })
            .eq('hotelId', this.hotelForm.hotelId)

          if (error) throw error
        } else {
          const { error } = await supabase
            .from('hotel')
            .insert([{
              cityId: this.hotelForm.cityId,
              hotelName: this.hotelForm.hotelName
            }])

          if (error) throw error
        }

        this.hotelDialog = false
        await this.fetchHotels()
      } catch (error) {
        console.error('Error saving hotel:', error)
      }
    },

    openDeleteHotelDialog(hotel: Hotel) {
      this.hotelToDelete = hotel
      this.deleteHotelDialog = true
    },

    async deleteHotel() {
      if (!this.hotelToDelete) return

      try {
        const { error } = await supabase
          .from('hotel')
          .delete()
          .eq('hotelId', this.hotelToDelete.hotelId)

        if (error) throw error

        this.deleteHotelDialog = false
        this.hotelToDelete = null
        await this.fetchHotels()
      } catch (error) {
        console.error('Error deleting hotel:', error)
      }
    }
  }
})
</script>

<template>
  <div>
    <!-- Tabs -->
    <v-tabs v-model="activeTab" class="premium-tabs mb-6">
      <v-tab value="cities">
        <v-icon start size="18">mdi-city</v-icon>
        Cities
        <v-badge :content="cities.length" color="primary" inline class="ml-2" size="small"></v-badge>
      </v-tab>
      <v-tab value="hotels">
        <v-icon start size="18">mdi-domain</v-icon>
        Hotels
        <v-badge :content="hotels.length" color="primary" inline class="ml-2" size="small"></v-badge>
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- Cities Tab -->
      <v-window-item value="cities">
        <!-- Filter Bar -->
        <v-card class="filter-bar mb-6">
          <v-row align="center">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="citySearch"
                label="Search cities..."
                prepend-inner-icon="mdi-magnify"
                density="comfortable"
                variant="outlined"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="8" class="text-right">
              <v-btn
                color="primary"
                class="btn-primary"
                prepend-icon="mdi-plus"
                @click="openAddCityDialog"
              >
                Add City
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Cities Table -->
        <v-card class="enterprise-card">
          <v-data-table
            :headers="cityHeaders"
            :items="filteredCities"
            :loading="cityLoading"
            item-value="cityId"
            class="premium-table elevation-0"
          >
            <template #item.cityName="{ item }">
              <div class="d-flex align-center py-2">
                <v-avatar size="36" class="avatar-gradient mr-3">
                  <v-icon size="18" color="white">mdi-city</v-icon>
                </v-avatar>
                <span class="font-weight-medium text-body-2 text-grey-darken-3">{{ item.cityName }}</span>
              </div>
            </template>

            <template #item.hotelsCount="{ item }">
              <span class="status-chip" style="background: rgba(59,130,246,0.1); color: #2563eb;">
                <v-icon start size="14">mdi-domain</v-icon>
                {{ getHotelsCountForCity(item.cityId) }} hotels
              </span>
            </template>

            <template #item.actions="{ item }">
              <v-btn
                icon
                variant="text"
                color="primary"
                size="small"
                class="mr-1"
                @click="openEditCityDialog(item)"
              >
                <v-icon>mdi-pencil-outline</v-icon>
                <v-tooltip activator="parent" location="top">Edit</v-tooltip>
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="error"
                size="small"
                @click="openDeleteCityDialog(item)"
              >
                <v-icon>mdi-delete-outline</v-icon>
                <v-tooltip activator="parent" location="top">Delete</v-tooltip>
              </v-btn>
            </template>

            <template #no-data>
              <div class="premium-empty-state">
                <v-icon>mdi-city</v-icon>
                <p class="empty-title">No cities found</p>
                <p class="empty-text">Add cities to get started</p>
                <v-btn color="primary" class="btn-primary mt-4" prepend-icon="mdi-plus" @click="openAddCityDialog">
                  Add City
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>

      <!-- Hotels Tab -->
      <v-window-item value="hotels">
        <!-- Filter Bar -->
        <v-card class="filter-bar mb-6">
          <v-row align="center">
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="hotelSearch"
                label="Search hotels..."
                prepend-inner-icon="mdi-magnify"
                density="comfortable"
                variant="outlined"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="hotelCityFilter"
                label="Filter by City"
                :items="[
                  { title: 'All Cities', value: null },
                  ...cities.map(c => ({ title: c.cityName, value: c.cityId }))
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
                @click="openAddHotelDialog"
              >
                Add Hotel
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Hotels Table -->
        <v-card class="enterprise-card">
          <v-data-table
            :headers="hotelHeaders"
            :items="filteredHotels"
            :loading="hotelLoading"
            item-value="hotelId"
            class="premium-table elevation-0"
          >
            <template #item.hotelName="{ item }">
              <div class="d-flex align-center py-2">
                <v-avatar size="36" class="avatar-gradient mr-3">
                  <v-icon size="18" color="white">mdi-domain</v-icon>
                </v-avatar>
                <span class="font-weight-medium text-body-2 text-grey-darken-3">{{ item.hotelName }}</span>
              </div>
            </template>

            <template #item.city.cityName="{ item }">
              <span class="status-chip" style="background: rgba(59,130,246,0.1); color: #2563eb;">
                <v-icon start size="14">mdi-city</v-icon>
                {{ item.city?.cityName || 'Unknown' }}
              </span>
            </template>

            <template #item.actions="{ item }">
              <v-btn
                icon
                variant="text"
                color="primary"
                size="small"
                class="mr-1"
                @click="openEditHotelDialog(item)"
              >
                <v-icon>mdi-pencil-outline</v-icon>
                <v-tooltip activator="parent" location="top">Edit</v-tooltip>
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="error"
                size="small"
                @click="openDeleteHotelDialog(item)"
              >
                <v-icon>mdi-delete-outline</v-icon>
                <v-tooltip activator="parent" location="top">Delete</v-tooltip>
              </v-btn>
            </template>

            <template #no-data>
              <div class="premium-empty-state">
                <v-icon>mdi-domain</v-icon>
                <p class="empty-title">No hotels found</p>
                <p class="empty-text">Add hotels to get started</p>
                <v-btn color="primary" class="btn-primary mt-4" prepend-icon="mdi-plus" @click="openAddHotelDialog">
                  Add Hotel
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- City Dialog -->
    <v-dialog v-model="cityDialog" max-width="500" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-6 pb-0">
          <div>
            <h3 class="text-h6 font-weight-bold text-grey-darken-3">{{ editingCity ? 'Edit City' : 'Add New City' }}</h3>
            <p class="text-caption text-grey mt-1">{{ editingCity ? 'Update city name' : 'Create a new city' }}</p>
          </div>
          <v-btn icon variant="text" size="small" @click="cityDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-form @submit.prevent="saveCity" class="pa-6 pt-4 premium-form">
          <v-text-field
            v-model="cityForm.cityName"
            label="City Name"
            :rules="[v => !!v || 'City name is required']"
            required
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          ></v-text-field>

          <v-card-actions class="pa-0 pt-6">
            <v-spacer></v-spacer>
            <v-btn variant="outlined" class="mr-2" @click="cityDialog = false">Cancel</v-btn>
            <v-btn
              color="primary"
              type="submit"
              class="btn-primary"
              :disabled="!cityFormValid"
            >
              {{ editingCity ? 'Update' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Hotel Dialog -->
    <v-dialog v-model="hotelDialog" max-width="500" persistent>
      <v-card class="premium-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-6 pb-0">
          <div>
            <h3 class="text-h6 font-weight-bold text-grey-darken-3">{{ editingHotel ? 'Edit Hotel' : 'Add New Hotel' }}</h3>
            <p class="text-caption text-grey mt-1">{{ editingHotel ? 'Update hotel information' : 'Create a new hotel' }}</p>
          </div>
          <v-btn icon variant="text" size="small" @click="hotelDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-form @submit.prevent="saveHotel" class="pa-6 pt-4 premium-form">
          <v-text-field
            v-model="hotelForm.hotelName"
            label="Hotel Name"
            :rules="[v => !!v || 'Hotel name is required']"
            required
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          ></v-text-field>

          <v-select
            v-model="hotelForm.cityId"
            label="City"
            :items="cities"
            item-title="cityName"
            item-value="cityId"
            :rules="[v => !!v || 'City is required']"
            required
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          ></v-select>

          <v-card-actions class="pa-0 pt-6">
            <v-spacer></v-spacer>
            <v-btn variant="outlined" class="mr-2" @click="hotelDialog = false">Cancel</v-btn>
            <v-btn
              color="primary"
              type="submit"
              class="btn-primary"
              :disabled="!hotelFormValid"
            >
              {{ editingHotel ? 'Update' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Delete City Dialog -->
    <v-dialog v-model="deleteCityDialog" max-width="420" persistent>
      <v-card class="premium-dialog">
        <v-card-text class="pa-6 text-center">
          <v-avatar size="56" class="avatar-error mb-4">
            <v-icon size="28" color="white">mdi-alert-outline</v-icon>
          </v-avatar>
          <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">Confirm Delete</h3>
          <p class="text-body-2 text-grey">
            Are you sure you want to delete <strong>{{ cityToDelete?.cityName }}</strong>? This will also delete all hotels in this city.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn variant="outlined" class="mr-2" @click="deleteCityDialog = false">Cancel</v-btn>
          <v-btn color="error" class="btn-error" @click="deleteCity">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Hotel Dialog -->
    <v-dialog v-model="deleteHotelDialog" max-width="420" persistent>
      <v-card class="premium-dialog">
        <v-card-text class="pa-6 text-center">
          <v-avatar size="56" class="avatar-error mb-4">
            <v-icon size="28" color="white">mdi-alert-outline</v-icon>
          </v-avatar>
          <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">Confirm Delete</h3>
          <p class="text-body-2 text-grey">
            Are you sure you want to delete <strong>{{ hotelToDelete?.hotelName }}</strong>? This action cannot be undone.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-center">
          <v-btn variant="outlined" class="mr-2" @click="deleteHotelDialog = false">Cancel</v-btn>
          <v-btn color="error" class="btn-error" @click="deleteHotel">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
</style>
