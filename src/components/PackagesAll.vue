<template>
  <v-row no-gutters>
    <v-col cols="12" md="4" v-for="(item, index) in packageList" :key="index">
      <v-card class="ma-1">
        <v-row no-gutters>
          <v-col cols="12" md="12">
            <v-img :src="imageUrl(item.photo)"></v-img>
          </v-col>
          <v-col cols="12" md="12">
            <span class="text-headline-large"> {{ item.title }} </span>
          </v-col>
          <v-col cols="12" md="12">
            <span class="text-headline-large"> {{ item.location }} </span>
          </v-col>
          
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import packageService from '../service/PackagesService.js'
import axios from "@/config";
export default {
  data: () => ({
    packageList: [],
  }),
  props: {},
  mounted: function () {
    this.getPackage()
  },
  methods: {
    getPackage: function () {
      packageService
        .getPackage('ALL')
        .then((response) => {
          this.packageList.splice(0)
          this.packageList.push(...response)
        })
        .catch((error) => {
          this.$swal('Fail!', error.response.data.message, 'error')
        })
    },
    imageUrl:function(photo){
      console.log("photo");
      console.log(photo);
      
      const baseURL = axios?.defaults?.baseURL || "";
      return photo ? `${baseURL}/productphoto/${photo}` : "";
    }
  },
  watch: {},
  computed: {},
  components: {},
}
</script>
<style scoped></style>
