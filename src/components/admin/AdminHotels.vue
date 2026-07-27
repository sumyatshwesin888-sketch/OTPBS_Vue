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

          <v-card class="enterprise-card border" variant="flat" rounded="lg">
            <v-card-text class="pt-0 px-4 pb-4">
              <v-data-table
                v-model:items-per-page="itemsPerPage"
                :headers="cityHeaders"
                :items="filteredCities"
                :loading="cityLoading"
                item-value="cityId"
                :items-per-page-options="[5, 10, 25, 50]"
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

                <!-- City Name Column -->
                <template #item.cityName="{ item }">
                  <div class="d-flex align-center py-1 text-no-wrap">
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

                <!-- Location Type Column -->
                <template #item.locationType="{ item }">
                  <span
                    v-if="item.locationType"
                    class="status-chip d-inline-flex align-center text-no-wrap"
                    :class="item.locationType === 'DOMESTIC' ? 'chip-cyan' : 'chip-indigo'"
                    style="gap: 4px"
                  >
                    <v-icon size="12">
                      {{ item.locationType === 'DOMESTIC' ? 'mdi-home-map-marker' : 'mdi-earth' }}
                    </v-icon>
                    {{ item.locationType }}
                  </span>
                  <span v-else class="text-grey-lighten-1" style="font-size: 0.8rem">-</span>
                </template>

                <!-- Photo Column -->
                <template #item.photo="{ item }">
                  <div class="d-flex align-center text-no-wrap">
                    <div
                      v-if="item.photo"
                      class="d-flex align-center cursor-pointer ga-2"
                      @click="previewImage(item)"
                    >
                      <v-avatar size="32" rounded="md" class="border glass-avatar">
                        <v-img :src="getImageUrl(item.photo)" cover>
                          <template #error>
                            <v-icon size="16" color="grey-darken-1"
                              >mdi-image-broken-variant</v-icon
                            >
                          </template>
                        </v-img>
                      </v-avatar>

                      <span
                        class="text-caption text-primary font-weight-medium text-truncate"
                        style="max-width: 110px"
                      >
                        {{ item.photo }}
                      </span>

                      <v-tooltip activator="parent" location="top"
                        >Click to preview image</v-tooltip
                      >
                    </div>

                    <div v-else class="d-flex align-center text-grey-lighten-1">
                      <v-icon size="16" class="mr-1">mdi-image-off-outline</v-icon>
                      <span style="font-size: 0.75rem !important">No photo</span>
                    </div>
                  </div>
                </template>

                <!-- Region Column -->
                <template #item.region="{ item }">
                  <div class="d-flex align-center text-no-wrap ga-1">
                    <v-icon size="14" color="teal-darken-1">mdi-map-marker-radius-outline</v-icon>
                    <span
                      class="text-body-2 text-grey-darken-3"
                      style="font-size: 0.8rem !important"
                    >
                      {{ item.region || 'N/A' }}
                    </span>
                  </div>
                </template>

                <!-- Website Column -->
                <template #item.website="{ item }">
                  <div class="d-flex align-center text-no-wrap ga-1">
                    <v-icon size="14" color="primary">mdi-web</v-icon>
                    <a
                      v-if="item.website"
                      :href="item.website.replace(/^'|'$/g, '')"
                      target="_blank"
                      class="text-decoration-none text-primary text-truncate"
                      style="max-width: 160px; font-size: 0.8rem !important"
                    >
                      {{ item.website.replace(/^'|'$/g, '') }}
                    </a>
                    <span v-else class="text-grey-lighten-1" style="font-size: 0.8rem">-</span>
                  </div>
                </template>

                <!-- Detail Column -->
                <template #item.detail="{ item }">
                  <div class="d-flex align-center text-no-wrap ga-1">
                    <v-icon size="14" color="amber-darken-2">mdi-information-outline</v-icon>
                    <span
                      class="text-body-2 text-grey-darken-3 text-truncate"
                      style="max-width: 220px; font-size: 0.8rem !important"
                    >
                      {{ item.detail || 'N/A' }}
                    </span>
                    <v-tooltip v-if="item.detail" activator="parent" location="top" max-width="300">
                      {{ item.detail }}
                    </v-tooltip>
                  </div>
                </template>

                <!-- Actions Column -->
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

                <!-- No Data -->
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

        <!-- Hotels Registry -->
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
              v-model:items-per-page="itemsPerPage"
              :headers="hotelHeaders"
              :items="hotels"
              :loading="hotelLoading"
              item-value="hotelId"
              :items-per-page-options="[5, 10, 25, 50]"
              class="premium-table elevation-0"
              fixed-header
              height="450"
            >
              <template #item.index="{ index }">
                <span class="text-body-2 font-weight-medium text-slate-500">
                  {{ index + 1 }}
                </span>
              </template>

              <template #item.hotelName="{ item }">
                <div class="d-flex align-center py-1 text-no-wrap">
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

              <template #item.cityDto.cityName="{ item }">
                <span class="status-chip chip-indigo d-inline-flex align-center" style="gap: 4px">
                  <v-icon size="11">mdi-map-marker-outline</v-icon>
                  {{ item.cityDto ? item.cityDto.cityName : 'N/A' }}
                </span>
              </template>

              <template #item.actions="{ item }">
                <div class="text-no-wrap">
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
                </div>
              </template>

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

    <!-- ================= DIALOGS ================= -->

    <!-- City Dialog -->
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

              <v-col cols="12">
                <div class="d-flex align-center ga-3">
                  <v-avatar size="48" rounded="lg" class="border glass-avatar bg-grey-lighten-4">
                    <v-img :src="previewUrl || getImageUrl(cityForm.photo)" cover>
                      <template #error>
                        <v-icon color="grey">mdi-image-outline</v-icon>
                      </template>
                    </v-img>
                  </v-avatar>

                  <v-file-input
                    v-model="selectedFile"
                    label="Choose photo"
                    prepend-inner-icon="mdi-camera"
                    prepend-icon=""
                    density="compact"
                    variant="outlined"
                    accept="image/*"
                    hide-details
                    clearable
                    class="sleek-input flex-grow-1"
                    @change="onFileChange"
                    @click:clear="previewUrl = null"
                  ></v-file-input>
                </div>
              </v-col>

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
                {{ editingCity ? 'Update' : 'Add' }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Hotel Dialog -->
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
                <!-- Hotel Dialog ထဲရှိ v-select ကို အောက်ပါအတိုင်း ပြင်ပါ -->
                <v-select
                  v-model="hotelForm.cityId"
                  :items="cityList"
                  item-title="cityName"
                  item-value="cityId"
                  label="Select City "
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
                {{ editingHotel ? 'Update' : 'Add' }}
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
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <!-- Image Preview Lightbox Dialog -->
  <v-dialog v-model="imagePreviewDialog" max-width="500px">
    <v-card class="premium-dialog text-center pa-4">
      <v-card-title class="d-flex justify-space-between align-center pa-2 pb-0">
        <span class="card-title-text">{{ selectedCityForPreview?.cityName }}</span>
        <v-btn icon variant="text" size="small" @click="imagePreviewDialog = false">
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-2">
        <v-img
          v-if="selectedCityForPreview?.photo"
          :src="getImageUrl(selectedCityForPreview.photo)"
          rounded="lg"
          max-height="350"
          cover
          class="elevation-2"
        >
          <template #error>
            <div
              class="d-flex flex-column align-center justify-center fill-height bg-grey-lighten-4"
            >
              <v-icon size="40" color="grey-darken-1">mdi-image-broken-variant</v-icon>
              <span class="text-caption text-grey-darken-1 mt-2">Image failed to load</span>
            </div>
          </template>
        </v-img>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Hotel, City } from '../../lib/supabase'
import cityService from '@/service/CityService'

export default defineComponent({
  name: 'AdminHotels',
  data() {
    return {
      selectedFile: null as File | null,
      previewUrl: null as string | null,
      imagePreviewDialog: false,
      selectedCityForPreview: null as City | null,
      itemsPerPage: 10,
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
        hotelId: null,
        hotelName: '',
        cityId: null,
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
        { title: 'No.', key: 'index', align: 'start' as const, sortable: false, width: '80px' },
        { title: 'Hotel Name', key: 'hotelName', align: 'start' as const },
        { title: 'City', key: 'cityDto.cityName', align: 'start' as const, width: '220px' },
        {
          title: 'Actions',
          key: 'actions',
          sortable: false,
          align: 'end' as const,
          width: '120px',
        },
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
    //  Validation စစ်
    hotelFormValid() {
      return !!this.hotelForm.hotelName && !!this.hotelForm.cityId
    },
  },
  mounted() {
    this.getCityMethod()
    this.getHotelListMethod()
  },
  methods: {
    getImageUrl(photoName: string) {
      if (!photoName) return ''
      if (photoName.startsWith('http')) return photoName

      const backendBaseUrl = 'http://localhost:8088/productphoto'
      return `${backendBaseUrl}/${photoName}`
    },

    previewImage(city: City) {
      this.selectedCityForPreview = city
      this.imagePreviewDialog = true
    },

    getHotelListMethod() {
      this.hotelLoading = true
      cityService
        .getHotel('ALL', 'ALL', '')
        .then((response) => {
          let hotelData = []
          if (response && response.data) {
            hotelData = response.data
          } else if (Array.isArray(response)) {
            hotelData = response
          }

          this.hotels.splice(0)
          this.hotels.push(...hotelData)
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
          this.cityList = res

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

    onFileChange(event: any) {
      const file = event.target.files?.[0] || this.selectedFile
      if (file) {
        this.previewUrl = URL.createObjectURL(file)
        this.cityForm.photo = file.name
      } else {
        this.previewUrl = null
        this.cityForm.photo = ''
      }
    },

    openAddCityDialog() {
      this.editingCity = false
      this.selectedFile = null
      this.previewUrl = null
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
      this.editingCity = true
      this.cityForm = { ...city }
      this.cityDialog = true
    },

    async saveCity() {
      const payload = {
        cityId: this.cityForm.cityId ? Number(this.cityForm.cityId) : null,
        cityName: this.cityForm.cityName,
        locationType: this.cityForm.locationType,
        photo: this.cityForm.photo,
        region: this.cityForm.region,
        website: this.cityForm.website,
        detail: this.cityForm.detail,
      }

      const apiCall = this.editingCity
        ? cityService.updateCity(payload)
        : cityService.addCity(payload)

      apiCall
        .then(() => {
          this.cityDialog = false
          this.getCityMethod()

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
        .catch((err) => console.error('City Save Error', err))
    },

    openDeleteCityDialog(city: City) {
      this.cityToDelete = city
      this.deleteCityDialog = true
    },

    async deleteCity() {
      if (!this.cityToDelete) return

      cityService
        .deleteCity(this.cityToDelete.cityId)
        .then(() => {
          this.deleteCityDialog = false
          this.getCityMethod()
        })
        .catch((err) => console.error('City Delete Error', err))
    },

   // Hotel သစ်ထည့်ရန် Dialog ဖွင့်ခြင်း
    openAddHotelDialog() {
      this.editingHotel = false
      
      // cityList ထဲမှာ city ရှိရင် ပထမဆုံး city ရဲ့ id ကို default ထည့် မရှိရင် null
      const defaultCityId = this.cityList.length > 0 ? this.cityList[0].cityId : null

      this.hotelForm = {
        hotelId: null,
        hotelName: '',
        cityId: defaultCityId
      }
      this.hotelDialog = true
    },

    // Hotel ပြင်ရန် Dialog 
   openEditHotelDialog(item: any) {
      this.editingHotel = true
      
      // ID များကို ရှာဖွေယူခြင်း
      const hId = item.hotelId || (item.raw && item.raw.hotelId)
      const hName = item.hotelName || (item.raw && item.raw.hotelName) || ''
      
      // cityDto ထဲက cityId သို့မဟုတ် item ထဲက cityId ကို ယူမည်
      const cId = item.cityDto ? item.cityDto.cityId : (item.cityId || null)

      this.hotelForm = {
        hotelId: hId ? Number(hId) : null,
        hotelName: hName,
        cityId: cId ? Number(cId) : null
      }

      this.hotelDialog = true
    },

    async saveHotel() {
      if (!this.hotelForm.hotelName || !this.hotelForm.cityId) {
        alert('Hotel Name နှင့် City ကို ရွေးချယ်ပေးပါ။')
        return
      }

      if (this.editingHotel && !this.hotelForm.hotelId) {
        alert('Hotel ID is null')
        return
      }

      const payload = {
        hotelId: Number(this.hotelForm.hotelId),
        hotelName: this.hotelForm.hotelName,
        cityDto: {
          cityId: Number(this.hotelForm.cityId)
        }
      }

      const apiCall = this.editingHotel
        ? cityService.updateHotel(payload)
        : cityService.addHotel(payload)

      apiCall
        .then(() => {
          this.hotelDialog = false
          this.getHotelListMethod() // Table Data ကို Refresh ပြန်လုပ်
        })
        .catch((err) => {
          console.error('Hotel Save Error: ', err)
          alert('Update Error!')
        })
    },

    confirmDeleteHotel() {
    if (!this.hotelToDelete) return

    const id = this.hotelToDelete.hotelId

    // 1. Backend Delete API ကို ခေါ်ပါမည်
    cityService.deleteHotel(id)
      .then((response) => {
        // 2. Database ထဲမှာ status = 'DELETED' ဖြစ်သွားပြီဖြစ်၍ 
        //    UI ထဲက hotels array ထဲမှလည်း ချက်ချင်း ဖယ်ထုတ်ပေးပါမည်
        this.hotels = this.hotels.filter(hotel => hotel.hotelId !== id)

        // 3. Delete Modal/Dialog ကို ပိတ်ပြီး အကြောင်းကြားစာ ပြပါမည်
        this.deleteHotelDialog = false
        alert('Hotel has been deleted successfully!')
      })
      .catch((error) => {
        console.error('Error deleting hotel:', error)
        alert('Failed to delete hotel. Please try again.')
      })
  },
     openDeleteHotelDialog(hotel: Hotel) {
      this.hotelToDelete = hotel
      this.deleteHotelDialog = true
    },

   async deleteHotel() {
      if (!this.hotelToDelete) return

      const id = this.hotelToDelete.hotelId

      cityService
        .deleteHotel(id)
        .then(() => {
          this.deleteHotelDialog = false
          //  Local Array ထဲကနေ တိုက်ရိုက် ဖျက်ထုတ်ပါ
          this.hotels = this.hotels.filter(hotel => hotel.hotelId !== id)
          
          // Backend ကနေ List ကို အသစ်ပြန်ဆွဲပါ
          this.getHotelListMethod()
          
          alert('Hotel deleted successfully!')
        })
        .catch((err) => {
          console.error('Hotel Delete Error', err)
          alert('Failed to delete hotel!')
        })
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
  white-space: nowrap !important;
}
.premium-table :deep(td) {
  border-bottom: 1px solid rgba(241, 245, 249, 0.3) !important;
  padding: 6px 12px !important;
  white-space: nowrap !important;
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
:deep(.v-table__wrapper) {
  overflow-x: auto !important;
}
.chip-cyan {
  background: rgba(6, 182, 212, 0.1) !important;
  color: #0891b2 !important;
}
.chip-indigo {
  background: rgba(99, 102, 241, 0.1) !important;
  color: #4f46e5 !important;
}
</style>
