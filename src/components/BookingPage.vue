<template>
  <div class="page-wrapper">
    <div class="stepper-container">
      <div class="stepper">
        <div class="step active">
          <div class="circle">1</div>
          <span>Package</span>
        </div>
        <div class="line"></div>
        <div class="step ">
          <div class="circle">2</div>
          <span>Payment</span>
        </div>
        <div class="line"></div>
        <div class="step">
          <div class="circle">3</div>
          <span>Confirmation</span>
        </div>
      </div>
    </div>
    

    <div class="checkout-layout">
      <div class="form-section">
        <h3>Traveler Information</h3>
        <form @submit.prevent="proceedToPayment">
          <div class="form-group">
            <label>Full Name</label>
            <input readonly v-model="form.name" type="text" placeholder="Enter your name" />
            <span class="error" v-if="errors.name">{{ errors.name }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Phone Number</label>
              <input  readonly v-model="form.phone" type="text" placeholder="09xxxxxxxxx" />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input readonly v-model="form.email" type="email" placeholder="example@mail.com" />
            </div>
          </div>

          
            <div class="form-group">
              <label>Number of Travelers</label>
              <select v-model="form.travelers">
                <option v-for="n in 15" :key="n" :value="n">{{ n }} Traveler(s)</option>
              </select>
            </div>
           
         

          <div class="actions">
          <button class="back-btn" @click="$router.go(-1)">Back</button>
          <button type="submit" class="btn-submit" @click="proceedToPayment"  >Continue to Payment</button> 
          </div>
        </form>
      </div>

      <div class="summary-section" v-if="selectedPackage">
  <div class="summary-card">
    <!-- <img :src="selectedImg ? 'http://localhost:8088/api/v1/productphoto/' + selectedImg : ''" :alt="selectedPackage.title" class="package-img" /> -->
      <img
              :src="selectedImg ? 'http://localhost:8088/api/v1/productphoto/' + selectedImg : ''"
              :alt="selectedPackage.title"
              class="package-img"
            />
    <div class="card-body">
      <h3>{{ selectedPackage.title }}</h3>
      <p>Duration: {{selectedPackage.day}} Day /
{{selectedPackage.night}} Night</p>
      
      <div class="price-row">
        <span>Price/Person</span>
        <strong>{{ selectedPackage.amount.toLocaleString() }} MMK</strong>
      </div>
      <div class="price-row">
        <span>Travelers</span>
        <strong>{{ form.travelers }}</strong>
      </div>
      
      <hr />
      
      <div class="total-row">
        <span>Total Amount</span>
        <strong>{{ totalPrice.toLocaleString() }} MMK</strong>
      </div>
    </div>
  </div>
  </div>
</div>
  </div>
  
  
  
</template>
<script>
import packageService from '@/service/PackageService'

 
export default {
  data() {
    return {

      selectedImg: '',
      loginUser:{},
       selectedPackage: null,
       form: { 
        name: '', 
        email: '', 
        phone: '', 
        travelers: 1, 
        date: '' 
      },
     
    
       
currentStep: 1,
      steps: ['Traveler Info', 'Payment', 'Confirmation'],
    
      errors: {},
      


    }
  },

  computed: {

   

    totalPrice() {
      if (!this.selectedPackage) return 0
  return this.selectedPackage.amount * (this.form.travelers || 1)
    }
  },
 
  mounted() {
     this.loginUser = JSON.parse(localStorage.getItem('loginUser'));

    if(this.loginUser.userAccountId==0 || this.loginUser.userAccountId == undefined){
       this.$router.push('/login');
    }
    this.form.name  = this.loginUser.profileName;
    this.form.phone = this.loginUser.phone;
    this.form.email = this.loginUser.email;
      
    this.loadPackageDetail();
  // this.loadUserData();
    // this.loadSelectedPackage();
    // const today = new Date().toISOString().split('T')[0];
    // this.form.date = today;
  },

   watch: {
    // '$route.params.id'() {
    //   this.loadSelectedPackage();
    // }
  },
  methods: {
  // 1. Package အချက်အလက်များ Load လုပ်ခြင်း
  // loadSelectedPackage() {
  //   const id = this.$route.params.id;
  //   this.selectedPackage = this.packagesDataset.find(p => p.id == id);
  // },

//   loadUserData(){

//  const user = JSON.parse(localStorage.getItem('user'));

//  if(!user){
//    this.$router.push('/login');
//    return;
//  }

//  this.form.name = user.fullName;
//  this.form.email = user.email;
//  this.form.phone = user.phone;

// },

  loadPackageDetail(){

 const id = this.$route.params.id;

 packageService
 .getProductById(id)

 .then(response=>{

    console.log("Package Detail:",response);

    this.selectedPackage = response;
    this.selectedImg=response.photo;

 })

 .catch(err=>{

    console.log(err);

 });

},

  
  saveBookingData() {
    const bookingData = {
      package: this.selectedPackage, 
      travelerInfo: this.form,      
      totalAmount: this.totalPrice
    };
    console.log("Selected Package:", this.selectedPackage);
    localStorage.setItem('booking_data', JSON.stringify(bookingData));
  },

  // 3. Validation စစ်ဆေးခြင်း
  validateForm() {
     this.errors = {}
    if (!this.form.name) this.errors.name = 'Full name is required'
  if (!this.form.email) this.errors.email = 'Email is required'
  if (!this.form.phone) this.errors.phone = 'Phone is required'

  if (Object.keys(this.errors).length > 0) {
    return false
  }

  this.saveBookingData()
  this.$router.push('/payment')

  },

  // 4. Button နှိပ်သည့်အခါ ခေါ်မည့် Function
  proceedToPayment() {
     const id = this.$route.params.id;
     localStorage.setItem('traveller', this.form.travelers);
      localStorage.setItem('amount', this.selectedPackage.amount);
      localStorage.setItem('productId', id);
     const ok = this.validateForm()
  if (!ok) return
  
},
  }
};


   /*props: {},
  mounted: function() {},
  
  watch: {},
  components: {}*/

</script>
<style scoped>
.template{
    background: radial-gradient(circle at top, #eaf3ff, #f6f9ff);
}
.page-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "Inter", sans-serif;

}


.actions {
  display: flex;
  gap: 14px;
  margin-top: 22px;
}

.back-btn {
  padding: 16px 26px;
  border-radius: 14px;
  border: 1px solid #bfdbfe;
  background: white;
  cursor: pointer;
  font-weight: 600;
  color: #1d4ed8;
  transition: 0.2s;
}
/* =========================
   ✨ MODERN STEPPER (BLUE GLASS)
========================= */
.stepper-container {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 26px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(37, 99, 235, 0.1);
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.12);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
}

.circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #dbeafe;
  font-weight: 700;
  transition: all 0.3s ease;
  color: #64748b;
}

/* ACTIVE STEP */
.step.active .circle {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border-color: transparent;
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.35);
  transform: scale(1.05);
}

.step.active span {
  color: #1d4ed8;
  font-weight: 700;
}

/* COMPLETED STEP */
.step.completed .circle {
  background: #1d4ed8;
  color: white;
  border-color: #1d4ed8;
}

/* CONNECT LINE */
.line {
  width: 80px;
  height: 2px;
  background: linear-gradient(to right, #dbeafe, #93c5fd);
  border-radius: 10px;
}

/* =========================
   ✨ LAYOUT
========================= */
.checkout-layout {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

/* =========================
   ✨ FORM CARD (GLASS STYLE)
========================= */
.form-section {
  flex: 2;
  padding: 28px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(37, 99, 235, 0.08);
  box-shadow: 0 18px 45px rgba(30, 64, 175, 0.12);
}

.form-section h3 {
  color: #1e3a8a;
  font-weight: 800;
  margin-bottom: 20px;
}

/* INPUTS */
.form-group {
  margin-bottom: 16px;
}

label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

input,
select {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #dbeafe;
  margin-top: 6px;
  outline: none;
  transition: 0.2s;
  background: white;
}

input:focus,
select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* FORM ROW */
.form-row {
  display: flex;
  gap: 14px;
}

/* BUTTON */
.btn-submit {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.35);
  transition: all 0.2s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
}

/* =========================
   ✨ SUMMARY CARD (TICKET STYLE)
========================= */
.summary-section {
  flex: 1;
}

.summary-card {
  border-radius: 22px;
  overflow: hidden;
  background: white;
  border: 1px solid #e0e7ff;
  box-shadow: 0 18px 45px rgba(30, 64, 175, 0.12);
  transition: 0.3s;
}

.summary-card:hover {
  transform: translateY(-5px);
}

.package-img {
  width: 100%;
  height: 210px;
  object-fit: cover;
}

.card-body {
  padding: 22px;
}

.card-body h3 {
  color: #0f172a;
  font-weight: 800;
  margin-bottom: 6px;
}

.card-body p {
  color: #64748b;
  margin-bottom: 16px;
}

/* PRICE ROW */
.price-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: #334155;
}

/* TOTAL */
.total-row {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 18px;
  font-weight: 800;
  color: #1d4ed8;
}

@media (max-width: 768px) {
  .checkout-layout {
    flex-direction: column;
  }

  .form-row {
    flex-direction: column;
  }

  .stepper {
    flex-wrap: wrap;
    border-radius: 20px;
  }
}
</style>

""