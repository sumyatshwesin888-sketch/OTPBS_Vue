<template>
  <div class="admin-itinerary-page">

    <!-- ================= Filter ================= -->

    <v-card class="filter-bar-card mb-4 pa-3">

      <v-row align="center">

        <v-col cols="12" md="4">

          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search"
            placeholder="Search by Title or City"
            clearable
            density="comfortable"
            variant="outlined"
            hide-details
          />

        </v-col>

        <v-col cols="12" md="3">

          <v-select
            v-model="productFilter"
            :items="productOptions"
            item-title="title"
            item-value="value"
            label="Package"
            clearable
            density="comfortable"
            variant="outlined"
            hide-details
          />

        </v-col>

        <v-spacer />

        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          class="text-none"
          @click="openAddDialog"
        >
          Add Itinerary
        </v-btn>

      </v-row>

    </v-card>

    <!-- ================= Empty ================= -->

    <v-card
      v-if="filteredProducts.length==0"
      class="pa-10 text-center"
    >

      <v-icon
        size="60"
        color="grey"
      >
        mdi-package-variant-remove
      </v-icon>

      <h3 class="mt-4">
        No Product Found
      </h3>

    </v-card>

    <!-- ================= Product ================= -->

    <v-expansion-panels
      v-else
      multiple
    >

      <v-expansion-panel

        v-for="product in filteredProducts"

        :key="product.productId"

        class="mb-4"

      >

        <!-- Header -->

        <v-expansion-panel-title>

          <div class="d-flex align-center w-100">

            <v-avatar
              size="52"
              rounded="lg"
            >

              <v-img
                v-if="product.photo"
                :src="product.photo"
                cover
              />

              <v-icon
                v-else
              >
                mdi-image
              </v-icon>

            </v-avatar>

            <div class="ml-4 flex-grow-1">

              <h3 class="mb-1">

                {{ product.title }}

              </h3>

              <div class="text-grey">

                <v-icon size="16">

                  mdi-map-marker

                </v-icon>

                {{ product.cityName }}

              </div>

            </div>

            <v-chip
              color="primary"
              variant="tonal"
            >

              {{ getItinerariesForProduct(product.productId).length }}

              DAYS PLAN

            </v-chip>

          </div>

        </v-expansion-panel-title>

        <!-- Body -->

        <v-expansion-panel-text>

          <div class="text-right mb-5">

            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              class="text-none"
              @click="openAddForProduct(product.productId)"
            >

              Add Day

            </v-btn>

          </div>

          <!-- Timeline -->

          <v-timeline
            side="end"
            align="start"
            density="comfortable"
          >

            <v-timeline-item

              v-for="itinerary in getItinerariesForProduct(product.productId)"

              :key="itinerary.itineraryId"

              dot-color="primary"

              class="timeline-item-custom"

            >

              <template #opposite>

                <div class="day-indicator">

                  DAY {{ itinerary.dayNo }}

                </div>

              </template>

              <v-card class="timeline-card">

                <v-card-text>

                  <div class="timeline-header">

                    <div class="timeline-content">

                      <h3>

                        {{ itinerary.title }}

                      </h3>

                      <p>

                        {{ itinerary.detail }}

                      </p>

                    </div>

                    <div class="timeline-action">

                      <v-btn
                        icon
                        variant="text"
                        @click="openEditDialog(itinerary)"
                      >

                        <v-icon>

                          mdi-pencil

                        </v-icon>

                      </v-btn>

                      <v-btn
                        icon
                        color="error"
                        variant="text"
                        @click="openDeleteDialog(itinerary)"
                      >

                        <v-icon>

                          mdi-delete

                        </v-icon>

                      </v-btn>

                    </div>

                  </div>

                </v-card-text>

              </v-card>

            </v-timeline-item>
                        <!-- Empty Timeline -->
            <v-timeline-item
              v-if="getItinerariesForProduct(product.productId).length === 0"
              dot-color="grey"
            >
              <template #opposite>
                <div class="day-indicator">
                  EMPTY
                </div>
              </template>

              <v-card class="timeline-card">
                <v-card-text class="text-center py-8">

                  <v-icon
                    size="50"
                    color="grey"
                  >
                    mdi-calendar-remove
                  </v-icon>

                  <h3 class="mt-3">
                    No Itinerary
                  </h3>

                  <p class="text-grey">
                    Click the button below to create the first day schedule.
                  </p>

                  <v-btn
                    class="mt-4"
                    color="primary"
                    prepend-icon="mdi-plus"
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

    <!-- ================= Add / Edit Dialog ================= -->

    <v-dialog
      v-model="dialog"
      max-width="650"
      persistent
    >

      <v-card>

        <v-card-title>

          {{ editing ? "Edit Itinerary" : "Add Itinerary" }}

        </v-card-title>

        <v-card-text>

          <v-form
            ref="form"
            v-model="formValid"
          >

            <v-select
              v-model="itineraryForm.productId"
              :items="products"
              item-title="title"
              item-value="productId"
              label="Product"
              class="mb-4"
            />

            <v-text-field
              v-model.number="itineraryForm.dayNo"
              type="number"
              label="Day"
              class="mb-4"
            />

            <v-text-field
              v-model="itineraryForm.title"
              label="Title"
              class="mb-4"
            />

            <v-textarea
              v-model="itineraryForm.detail"
              label="Detail"
              rows="4"
            />

          </v-form>

        </v-card-text>

        <v-card-actions>

          <v-spacer />

          <v-btn
            variant="outlined"
            @click="dialog=false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            @click="saveItinerary"
          >
            {{ editing ? "Update" : "Save" }}
          </v-btn>

        </v-card-actions>

      </v-card>

    </v-dialog>

    <!-- ================= Delete Dialog ================= -->

    <v-dialog
      v-model="deleteDialog"
      max-width="450"
    >

      <v-card>

        <v-card-title>

          Delete Itinerary

        </v-card-title>

        <v-card-text>

          Are you sure you want to delete

          <strong>

            {{ itemToDelete?.title }}

          </strong>

          ?

        </v-card-text>

        <v-card-actions>

          <v-spacer />

          <v-btn
            variant="outlined"
            @click="deleteDialog=false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="error"
            @click="deleteItinerary"
          >
            Delete
          </v-btn>

        </v-card-actions>

      </v-card>

    </v-dialog>

  </div>

</template>

<script>
import { defineComponent } from "vue";

import ProductService from "@/service/ProductService";
import ItineraryService from "@/service/ItineraryService";
export default defineComponent({
  name: 'AdminItineraries',
 data() {
  return {
    itineraries: [],
    products: [],
    loading: true,

    formValid: false,

    dialog: false,
    deleteDialog: false,

    search: "",
    productFilter: null,

    expandedProduct: null,

    itineraryForm: {
      itineraryId: 0,
      productId: null,
      title: "",
      detail: "",
      dayNo: 1
    },

  editing: false,
      itemToDelete: null,
      headers: [
        { title: 'Day', key: 'dayNo', width: 80, align: 'center' },
        { title: 'Title', key: 'title', align: 'start'  },
        { title: 'Product', key: 'product.title', align: 'start'  },
        { title: 'Detail', key: 'detail', sortable: false },
        { title: 'Actions', key: 'actions', sortable: false }
      ]
    }
  },
computed: {

  productOptions() {

    return [
      { title: "All Products", value: null },

      ...this.products.map((p) => ({
        title: p.title,
        value: p.productId
      }))

    ];

  },

  filteredProducts() {

    let result = [...this.products];

    // Product Filter
    if (this.productFilter) {

      result = result.filter(
        p => p.productId == this.productFilter
      );

    }

    // Search
    if (this.search && this.search.trim() !== "") {

      const keyword = this.search.toLowerCase().trim();

      result = result.filter(p =>

        (p.title &&
          p.title.toLowerCase().includes(keyword))

        ||

        (p.cityName &&
          p.cityName.toLowerCase().includes(keyword))

      );

    }

    return result;

  }

},
mounted() {

    this.fetchProducts();

    this.fetchItineraries();

},
  methods: {

  fetchItineraries() {

    this.loading = true;

    ItineraryService.getItinerary()
      .then((response) => {

        this.itineraries = response;
        console.log("Itinerary =", response);
        this.loading = false;

      })
      .catch((err) => {

        console.log(err);
        this.loading = false;

      });

  },

  fetchProducts() {

    ProductService.getProduct()
      .then((response) => {

        this.products = response;

        console.log("Products =", response);

      })
      .catch((err) => {

        console.log(err);

      });

  },

  openAddDialog() {

    this.editing = false;

    this.itineraryForm = {

      itineraryId: 0,
      productId: this.products.length ? this.products[0].productId : null,
      title: "",
      detail: "",
      dayNo: 1

    };

    this.dialog = true;

  },

  openAddForProduct(productId) {

    const productItineraries = this.itineraries.filter(
      i => i.productId == productId
    );

    const nextDay = productItineraries.length
      ? Math.max(...productItineraries.map(i => i.dayNo)) + 1
      : 1;

    this.editing = false;

    this.itineraryForm = {

      itineraryId: 0,
      productId: productId,
      title: "",
      detail: "",
      dayNo: nextDay

    };

    this.dialog = true;

  },

  openEditDialog(itinerary) {

    this.editing = true;

    this.itineraryForm = {

      itineraryId: itinerary.itineraryId,
      productId: itinerary.productId,
      title: itinerary.title,
      detail: itinerary.detail,
      dayNo: itinerary.dayNo

    };

    this.dialog = true;

  },

  openDeleteDialog(itinerary) {

    this.itemToDelete = itinerary;
    this.deleteDialog = true;

  },

  async deleteItinerary() {

    if (!this.itemToDelete) return;

    try {

      await ItineraryService.deleteItinerary(
        this.itemToDelete.itineraryId
      );

      this.deleteDialog = false;
      this.itemToDelete = null;

      this.fetchItineraries();

    } catch (err) {

      console.log(err);

    }

  },

  async saveItinerary() {

    try {

      const payload = {

        productId: Number(this.itineraryForm.productId),
        title: this.itineraryForm.title,
        detail: this.itineraryForm.detail,
        dayNo: Number(this.itineraryForm.dayNo)

      };

      if (this.editing) {

        await ItineraryService.updateItinerary(
          this.itineraryForm.itineraryId,
          payload
        );

      } else {

        await ItineraryService.addItinerary(payload);

      }

      this.dialog = false;

      this.fetchItineraries();

    } catch (err) {

      console.log(err);

    }

  },

  toggleProductExpand(productId) {

    this.expandedProduct =
      this.expandedProduct === productId
        ? null
        : productId;

  },

  getItinerariesForProduct(productId) {

    return this.itineraries
      .filter(i => i.productId == productId)
      .sort((a, b) => a.dayNo - b.dayNo);

  },

}
})
</script>

<style scoped>

.admin-itinerary-page{
    background:#f5f7fb;
    padding:24px;
    min-height:100vh;
}

/* ===========================
   Filter
=========================== */

.filter-bar-card{
    border-radius:18px;
    border:1px solid #e5e7eb;
    box-shadow:0 8px 18px rgba(0,0,0,.05);
}

/* ===========================
   Expansion
=========================== */

.v-expansion-panel{
    border-radius:18px !important;
    overflow:hidden;
    margin-bottom:20px;
    box-shadow:0 10px 25px rgba(0,0,0,.06);
}

.v-expansion-panel-title{
    min-height:88px !important;
    padding:18px 22px !important;
}

.v-expansion-panel-text{
    padding:20px !important;
}

/* ===========================
   Avatar
=========================== */

.v-avatar{
    border:2px solid #fff;
    box-shadow:0 6px 18px rgba(0,0,0,.08);
}

/* ===========================
   Product
=========================== */

.card-title-text,
h3{
    font-weight:700;
    color:#1f2937;
}

.card-subtitle-text{
    color:#6b7280;
}

/* ===========================
   Timeline
=========================== */

.v-timeline{
    width:100%;
}

.timeline-item-custom{
    width:100%;
    margin-bottom:24px;
}

.day-indicator{

    width:90px;

    text-align:center;

    font-weight:700;

    color:#1976d2;

    font-size:17px;

}

/* line */

:deep(.v-timeline-divider__before),
:deep(.v-timeline-divider__after){

    width:2px;

    background:#d4d4d4;

}

/* dot */

:deep(.v-timeline-divider__dot){

    width:20px;

    height:20px;

    border:4px solid #fff;

    background:#1976d2;

    box-shadow:0 0 0 3px #1976d2;

}

/* ===========================
   Timeline Card
=========================== */

.timeline-card{

    width:100%;

    min-height:120px;

    border-radius:18px;

    border-left:5px solid #1976d2;

    box-shadow:0 10px 24px rgba(0,0,0,.08);

    transition:.25s;

}

.timeline-card:hover{

    transform:translateY(-3px);

    box-shadow:0 16px 30px rgba(0,0,0,.12);

}

.timeline-header{

    display:flex;

    justify-content:space-between;

    align-items:flex-start;

    gap:20px;

}

.timeline-content{

    flex:1;

}

.timeline-content h3{

    font-size:19px;

    margin-bottom:10px;

}

.timeline-content p{

    color:#6b7280;

    line-height:1.7;

    margin:0;

}

.timeline-action{

    display:flex;

    gap:6px;

    flex-shrink:0;

}

/* ===========================
   Button
=========================== */

.timeline-action .v-btn{

    width:36px;

    height:36px;

}

.timeline-action .v-icon{

    font-size:20px;

}

/* ===========================
   Dialog
=========================== */

.v-dialog .v-card{

    border-radius:18px;

}

/* ===========================
   Inputs
=========================== */

:deep(.v-field){

    border-radius:12px;

}

/* ===========================
   Empty
=========================== */

.text-grey{

    color:#6b7280;

}

/* ===========================
   Responsive
=========================== */

@media (max-width:960px){

    .admin-itinerary-page{

        padding:18px;

    }

    .timeline-header{

        flex-direction:column;

    }

    .timeline-action{

        width:100%;

        justify-content:flex-end;

    }

}

@media (max-width:600px){

    .admin-itinerary-page{

        padding:12px;

    }

    .day-indicator{

        width:60px;

        font-size:14px;

    }

    .timeline-card{

        min-height:100px;

    }

    .timeline-content h3{

        font-size:17px;

    }

    .timeline-content p{

        font-size:14px;

    }

}
</style>