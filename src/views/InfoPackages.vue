<template>
<v-row class="mt=12 ml-12 mr-12 mt-12" >
  <div class="mt-5"></div>
  <v-col cols="12" md="12" class="mt=12">
  <v-tabs v-model="keyId">
      <v-tab value="keyId" @click="validate(0)" style="text-transform: none" >All</v-tab>
      <v-tab value="keyId" @click="validate(1)" style="text-transform: none" >Domestic Trips</v-tab>
      <v-tab value="keyId" @click="validate(2)"  style="text-transform: none" >Internation Trips</v-tab>
    </v-tabs>
<v-divider></v-divider> 
    <PackagesAll v-if="keyId==0"/>
    <PackagesType v-else/>
  </v-col>
</v-row>
</template>	
<script>
import PackagesAll from '@/components/PackagesAll.vue';
import PackagesType from '@/components/PackagesType.vue';
export default {
  data: () => ({
    // isCustomer:true,
    //   isItemTransaction:false,
    //   isPayment:false,
    //   isSeries:false,
       keyId:0, //keyId is 0,1,2
    //   statusType:"PENDING",
    //   serialKey:0,
  }),
   props: {},			
  mounted: function() {
    this.keyId = 0;
  },	
  methods: {
    validate:function(index){
        this.keyId = index;
    }
  },
  watch: {},
  computed : {},
  components: {PackagesAll,PackagesType}	
};
</script>
<style scoped>		

</style>




