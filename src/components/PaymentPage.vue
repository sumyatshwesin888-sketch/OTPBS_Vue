<template>
  <div class="page-wrapper">
    <div class="stepper-container">
      <div class="stepper">
        <div class="step completed">
          <div class="circle">✓</div>
          <span>Package</span>
        </div>
        <div class="line"></div>
        <div class="step active">
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

    <div class="checkout-grid">
      <section class="payment-section">
        <div class="card">
          <h2 class="section-title mb-4">Payment Method</h2>
          
          <div class="payment-options">
            <div 
              v-for="method in paymentMethods" 
              :key="method.id" 
              class="payment-option"
              :class="{ selected: selectedMethod === method.id }"
              @click="selectedMethod = method.id"
            >
              <div class="radio-circle">
                <div v-if="selectedMethod === method.id" class="radio-dot" />
              </div>
              <span class="method-name">{{ method.name }}</span>
              <div class="method-logo" :style="{ background: method.color }">
                <span class="method-logo-text">{{ method.abbr }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="actions">
          <button class="back-btn" @click="$router.go(-1)">Back</button>
          <button class="pay-btn" @click="handlePayment">Confirm Payment</button>
        </div>
      </section>

      <aside class="summary-section" v-if="booking && booking.package">
        <div class="card summary-card">
          <!-- <img :src="booking.package.image" :alt="booking.package.title" class="summary-img" /> -->
            <img
              :src="booking.package.photo ? 'http://localhost:8088/api/v1/productphoto/' + booking.package.photo : ''"
              :alt="booking.package.title"
              class="summary-img"
            />
          <div class="summary-content">
            <h3>{{ booking.package.title }}</h3>
            <p class="destination">{{ booking.package.city }}</p>
            
            <div class="summary-details">
              <div class="row"><span>Travelers</span><strong>{{ booking.travelerInfo.travelers }}</strong></div>
              <div class="row"><span>Duration</span><strong>{{ booking.package.day }} Days 
                {{ booking.package.night }} Nights</strong></div>
              <!-- <div class="row"><span>Date</span><strong>{{ booking.travelerInfo.date }}</strong></div> -->
              <hr />
              <div class="row total"><span>Total Amount</span><strong>{{ booking.totalAmount.toLocaleString() }} MMK</strong></div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import packageService from '@/service/PackageService'

import saleService from '@/service/SaleService'

export default {
  data() {
    return {
      selectedImg: '',
      packageDetail: {},
      selectedMethod: 'kbzpay',
      booking: null,
      paymentMethods: [
        { id: 'kbzpay', name: 'KBZPay', abbr: 'KBZ', color: '#2563EB' },
        { id: 'wavepay', name: 'WavePay', abbr: 'Wave', color: '#F59E0B' },
        { id: 'ayapay', name: 'AYAPay', abbr: 'AYA', color: '#7C3AED' },
      ],
       loginUser:{},
       productId:0,
    };
   
  },

  mounted() {
   
  const savedData = localStorage.getItem('booking_data');
  
  if (savedData) {
    try {
      this.booking = JSON.parse(savedData);
      this.productId = this.booking.package.productId;
      console.log("Successfully loaded booking:", this.booking);
      console.log("PRODUCT ID =>", this.productId);
      
    } catch (e) {
      console.error("Failed to parse booking data", e);
    }
  } else {
    console.warn("No booking data found in localStorage");
    
  }
  console.log(JSON.parse(localStorage.getItem("booking_data")));

  const loginUser = localStorage.getItem("loginUser");

  if (loginUser) {
    this.loginUser = JSON.parse(loginUser);
    console.log("LOGIN USER =>", this.loginUser);
  }


},

  computed: {
    totalAmount() {
      // 1. Check if booking exists to avoid null errors
      if (!this.booking) return 0;
      
      
      return this.booking.package.price * this.booking.travelerInfo.travelers;
    }
  },

  methods: {
    handlePayment() {
      
      if (!this.selectedMethod) {
        alert("Please select a payment method.");
        return;
      } 
     let saleDto = {};

     saleDto.productId = Number(this.productId);

  saleDto.customerId = this.loginUser.userAccountId;

  saleDto.userAccountId = this.loginUser.userAccountId;

  saleDto.qty = Number(localStorage.getItem('traveller'));

  saleDto.unitPrice = Number(localStorage.getItem('amount'));

  saleDto.amount = saleDto.qty * saleDto.unitPrice;

  if(this.selectedMethod === 'kbzpay'){
      saleDto.paymentType = 'KBZpay';
  }
  else if(this.selectedMethod === 'wavepay'){
      saleDto.paymentType = 'WAVEpay';
  }
  else if(this.selectedMethod === 'ayapay'){
      saleDto.paymentType = 'AYApay';
  }


      console.log("SALE DTO =>", saleDto);

      saleService
 .addSale(saleDto)

 .then(response=>{

    console.log("Package Sale>>> ",response);

 })

 .catch(err=>{

    console.log(err);

 });

     // localStorage.setItem('payment', this.selectedMethod);
      const savedData = localStorage.getItem('booking_data');
      let booking = savedData ? JSON.parse(savedData) : {};

      booking.paymentMethod = this.selectedMethod;  
      booking.id = "BK-" + Math.floor(Math.random() * 90000 + 10000);
      booking.status = 'CONFIRM';
      booking.timestamp = new Date().toISOString();

      localStorage.setItem('booking_data', JSON.stringify(booking));

      alert('Payment Confirmed!');

      // saleService.addSale()
      this.$router.push('/confirmation')
    }
  }
};
</script>

<style scoped>
.template{
  background: #f5f9ff;
}
.page-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
  font-family: "Inter", sans-serif;
  
}

/* STEP PROGRESS (modern blue gradient) */
.stepper-container {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 14px 24px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(30, 64, 175, 0.12);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-weight: 500;
}

.circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #cbd5e1;
  background: white;
  font-weight: 700;
  transition: all 0.3s ease;
}

.step.active .circle {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-color: #2563eb;
  color: white;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.35);
}

.step.completed .circle {
  background: #1d4ed8;
  border-color: #1d4ed8;
  color: white;
}

.step.active span,
.step.completed span {
  color: #1d4ed8;
  font-weight: 700;
}

.line {
  width: 90px;
  height: 2px;
  background: linear-gradient(to right, #cbd5e1, #93c5fd);
}

/* GRID */
.checkout-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 28px;
}

/* CARD (glass + blue accent) */
.card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(37, 99, 235, 0.1);
  padding: 26px;
  border-radius: 18px;
  box-shadow: 0 12px 35px rgba(29, 78, 216, 0.08);
  backdrop-filter: blur(10px);
}

.section-title {
  font-size: 20px;
  font-weight: 800;
  color: #1e3a8a;
  margin-bottom: 18px;
}

/* PAYMENT OPTIONS (modern selectable cards) */
.payment-option {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 14px;
  cursor: pointer;
  margin-bottom: 12px;
  border: 1px solid #dbeafe;
  background: white;
  transition: all 0.25s ease;
}

.payment-option:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
}

.payment-option.selected {
  border-color: #2563eb;
  background: linear-gradient(135deg, #eff6ff, #ffffff);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
}

.radio-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #93c5fd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-option.selected .radio-circle {
  border-color: #2563eb;
}

.radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2563eb;
}

.method-name {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.method-logo {
  width: 64px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2563eb, #60a5fa);
}

.method-logo-text {
  color: white;
  font-size: 12px;
  font-weight: 800;
}

/* BUTTONS */
.actions {
  display: flex;
  gap: 14px;
  margin-top: 22px;
}

.pay-btn {
  flex: 1;
  padding: 16px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-weight: 800;
  color: white;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.35);
  transition: all 0.2s ease;
}

.pay-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.45);
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

.back-btn:hover {
  background: #eff6ff;
}

/* SUMMARY */
.summary-img {
  width: 100%;
  height: 190px;
  object-fit: cover;
  border-radius: 14px;
}

.summary-card h3 {
  margin-top: 14px;
  color: #1e3a8a;
  font-weight: 800;
}

.destination {
  color: #64748b;
  margin-bottom: 10px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  color: #334155;
}

.total {
  font-size: 1.2rem;
  font-weight: 800;
  color: #2563eb;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }

  .stepper {
    flex-wrap: wrap;
    border-radius: 20px;
  }
}
</style>